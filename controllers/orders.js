const Order = require("../models/Orders");
const User = require("../models/User");
const Run = require("../models/Run");
const { log } = require("../helpers/Loger");
const moment = require("moment");
const { getComingRuns } = require("./runs");
const { getCostumerInternally } = require("./costumer");
const Customer = require("../models/Customer");
const Products = require("../models/Products");
const Promotion = require("../models/Promotion");

exports.sendCustomeIdToCreateOrder = async (req, res) => {
  try {
    console.clear();
    const { page } = req.query;

    if (!page)
      return res
        .status(400)
        .json(
          "the required query parameters are : page and limit and isarchived"
        );

    //===================
    const customer = await Customer.findById(req.params.id);
    let customerproductpromotions = [];
    let customercategorypromotions = [];

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "No customer is found by this Id!" });
    }
    const limit = 30;
    if (!customer.promotions.length) {
      const products = await Products.find({ visibility: true })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      return res.status(200).json({
        success: true,
        message: "The customer doesn't have any promotions",
        data: products,
      });
    }

    let promotionsArray = customer.promotions;
    for (let i = 0; i < promotionsArray.length; i++) {
      const promotion = await Promotion.findById(promotionsArray[i].toString());

      if (!promotion)
        return res.status(404).json({
          success: false,
          message: `the promotion with id ${promotionsArray[i]} is not valid`,
        });

      let now = new Date();
      let fromDate = new Date(promotion.from);
      let toDate = new Date(promotion.to);

      const products = await Products.find({ visibility: true })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      if (fromDate > now || toDate < now) {
        return res.status(403).json({
          success: true,
          products,
        });
      }

      if (!(JSON.stringify(promotion.categorypromotion) == "{}")) {
        customercategorypromotions.push(promotion);
      } else if (promotion.productspromotion.length) {
        customerproductpromotions.push(promotion);
      }
    }

    let customerCategoryPromotionsIds = [];
    let customerProductsPromotionsIds = [];

    customercategorypromotions.forEach(
      (cat) =>
        (customerCategoryPromotionsIds = [
          ...customerCategoryPromotionsIds,
          cat.categorypromotion.categoryId.toString(),
        ])
    );

    customerproductpromotions.forEach((promotion) =>
      promotion.productspromotion.forEach((product) => {
        customerProductsPromotionsIds = [
          ...customerProductsPromotionsIds,
          product.productId.toString(),
        ];
      })
    );

    products.forEach((product) => {
      if (
        customerCategoryPromotionsIds.includes(product.categoryId.toString())
      ) {
        let discountPercentage = customercategorypromotions.filter(
          (cat) =>
            cat.categorypromotion.categoryId.toString() ===
            product.categoryId.toString()
        )[0].categorypromotion.discountpercentage;

        product.promotionPrice =
          product.price * ((100 - discountPercentage) / 100);
      }
      if (customerProductsPromotionsIds.includes(product._id.toString())) {
        let newPrice = customerproductpromotions.filter(
          (prod) =>
            prod.productspromotion[0].productId.toString() ===
            product._id.toString()
        )[0]?.productspromotion[0]?.newprice;

        product.promotionPrice = newPrice;
      }
    });

    return res.status(200).json({
      success: true,
      message:
        "The products' new prices are computated as for the customer's promotions",
      data: products,
    });
  } catch (err) {
    console.log("sendCustomeIdToCreateOrder err", err);
    await log(err);
    res.status(500).json(err);
  }
};
exports.createOrder = async (req, res) => {
  console.clear();
  const createNewRun = async (orderDate, newOrder, customerRouteId) => {
    const newRun = new Run({
      date: orderDate,
      orders: [newOrder],
      route: customerRouteId,
    });
    const savedRun = await newRun.save();
    return res.status(200).json({ message: "New run is created", savedRun });
  };

  const updateCustomerOrdeCount = async (customer) => {
    await Customer.findByIdAndUpdate(
      customer,
      {
        $inc: { totalOrders: 1 },
      },
      { new: true }
    );
  };

  const updateUserOrdeCount = async (user) => {
    await User.findByIdAndUpdate(
      user,
      {
        $inc: { ordersCount: 1 },
      },
      { new: true }
    );
  };
  const { date, customer, products } = req.body;

  try {
    const newOrder = new Order(req.body);
    let amount = 0;
    for (let j = 0; j < products.length; j++) {
      let quantity = products[j].quantity;
      let pricePerUnit = products[j].pricePerUnit;
      amount = quantity * pricePerUnit + amount;
    }
    let ourCustomer = await getCostumerInternally(customer);
    newOrder.totalamount = amount + ourCustomer.deliveryfee;
    newOrder.initiateduser = req.user.id.toString();
    await newOrder.save();

    if (!ourCustomer)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    let customerRouteId = ourCustomer.routeId.toString();
    const comingRunsArray = await getComingRuns(customerRouteId);
    // we are getting the runs with status 0 and 1 so we have to terminate runs by end of day if the admin did not
    //wen badna nhetetla coda hayde ya Emile
    let orderDate = moment(date).format("L");

    if (!comingRunsArray.length) {
      updateCustomerOrdeCount(customer);
      updateUserOrdeCount(req.user.id.toString());
      createNewRun(orderDate, newOrder, customerRouteId);
    }

    for (let i = 0; i < comingRunsArray.length; i++) {
      let runDate = comingRunsArray[i].date;
      let formattedRunDate = moment(runDate).format("L");
      let runRouteId = comingRunsArray[i].route.toString();

      if (formattedRunDate == orderDate && customerRouteId == runRouteId) {
        let runId = comingRunsArray[i]._id.toString();

        const ourRun = await Run.findByIdAndUpdate(
          runId,
          { $push: { orders: newOrder } },
          { new: true }
        );
        updateCustomerOrdeCount(customer);
        updateUserOrdeCount(req.user.id.toString());
        return res.status(200).json({
          message: "Order is added to already created run at that date",
          ourRun,
        });
      } else {
        updateCustomerOrdeCount(customer);
        updateUserOrdeCount(req.user.id.toString());
        return createNewRun(orderDate, newOrder, customerRouteId);
      }
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      customer,
      {
        $inc: { totalOrders: 1 },
      },
      { new: true }
    );
    if (!updatedCustomer) await log("totalOrder could not be updated");
  } catch (err) {
    console.log("createOrder err", err);
    await log(err);
    res.status(500).json(err);
  }
};
exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (updatedOrder) {
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json("No order was found with this id !");
    }
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

      .populate({
        path: "products",
        populate: {
          path: "product",
          model: "Product",
        },
      })
      .exec();
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json("No order was found with this id !");
    }
  } catch (err) {
    console.log("err", err);
    await log(err);
    res.status(500).json(err);
  }
};
exports.getAllOrders = async (req, res) => {
  const { limit, page, done } = req.query;
  //all 0 1 2 3
  // done = true => 2
  // done = false => 0 1 2 3
  try {
    const orders =
      done === "all"
        ? await Order.find()
            .populate("customer")
            .populate({
              path: "products",
              populate: {
                path: "product",
                model: "Product",
              },
            })
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
        : done === "false"
        ? await Order.find({
            $or: [{ status: 0 }, { status: 1 }, { status: 3 }],
          })
            .populate("customer")
            .populate({
              path: "products",
              populate: {
                path: "product",
                model: "Product",
              },
            })
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
        : await Order.find({ status: 2 })
            .populate("customer")
            .populate({
              path: "products",
              populate: {
                path: "product",
                model: "Product",
              },
            })
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

    const orderCount = await Order.countDocuments();
    let objectTosend = {
      orderCount,
      orders,
    };
    if (orders) {
      res.status(200).json(objectTosend);
    } else {
      return res.status(200).json("No orders found");
    }
  } catch (err) {
    console.log("err", err);
    await log(err);
    res.status(500).json(err);
  }
};

// product name
// product assigned code
// csutomer name
// customer businessname
// date

exports.searchOrderByProduct = async (req, res) => {
  try {
  } catch (err) {
    console.log("searchOrderByProduct err", err);
  }
};
