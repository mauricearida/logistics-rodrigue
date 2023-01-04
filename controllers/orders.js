const Order = require("../models/Orders");
const User = require("../models/User");
const Run = require("../models/Run");
const { log } = require("../helpers/Loger");
const { getComingRuns, getAllComingRuns } = require("./runs");
const { getCostumerInternally } = require("./costumer");
const Customer = require("../models/Customer");
const Products = require("../models/Products");
const Promotion = require("../models/Promotion");
const dayjs = require("dayjs");
const moment = require("moment");
const { default: mongoose } = require("mongoose");

exports.sendCustomeIdToCreateOrder = async (req, res) => {
  try {
    console.clear();
    const { page } = req.query;
    const limit = 30;

    if (!page)
      return res
        .status(400)
        .json(
          "the required query parameters are : page and limit and isarchived"
        );

    //===================
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "No customer is found by this Id!" });
    }
    const products = await Products.find({ visibility: true })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    if (!products) {
      return res
        .status(404)
        .json({ success: false, message: "Could not fetch products" });
    }
    if (!customer.promotions.length) {
      return res.status(200).json({
        success: true,
        message: "The customer doesn't have any promotions",
        data: products,
      });
    }

    let customerproductpromotions = [];
    let customercategorypromotions = [];

    let promotionsArray = customer.promotions;
    for (let i = 0; i < promotionsArray.length; i++) {
      const promotion = await Promotion.findById(promotionsArray[i].toString());

      if (!promotion) {
        continue;
      }

      let now = new Date();
      let fromDate = new Date(promotion.from);
      let toDate = new Date(promotion.to);

      if (fromDate > now || toDate < now) {
        continue;
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
    return savedRun;
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
    updateCustomerOrdeCount(customer);
    updateUserOrdeCount(req.user.id.toString());

    if (!ourCustomer)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    let customerRouteId = ourCustomer.routeId.toString();
    const comingRunsArray = await getComingRuns(customerRouteId);
    // we are getting the runs with status 0 and 1 so we have to terminate runs by end of day if the admin did not
    //wen badna nhetetla coda hayde ya Emile
    let orderDate = moment(date).format("L");

    const existComingRun = comingRunsArray.find((oneComingRun) => {
      let formattedRunDate = moment(oneComingRun.date).format("L");
      let runRouteId = oneComingRun.route.toString();
      return (formattedRunDate == orderDate && runRouteId == customerRouteId)
    })


    if (existComingRun) {
      let runId = existComingRun._id.toString();
      const ourRun = await Run.findByIdAndUpdate(
        runId,
        { $push: { orders: newOrder } },
        { new: true }
      );
      return res.status(200).json({
        message: "Order is added to already created run at that date",
        ourRun,
      });
    }
    const ourRun = await createNewRun(orderDate, newOrder, customerRouteId);
    return res.status(200).json({ message: "New run is created", ourRun });

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
    )
      .populate("customer")
      .populate({
        path: "products",
        populate: {
          path: "name",
          model: "Product",
        },
      });

    if (updatedOrder) {
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json("No order was found with this id !");
    }
  } catch (err) {
    console.log("updateOrder err", err);
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

exports.searchOrderByProductText = async (req, res) => {
  const { name } = req.query;
  const isDate = moment(name, "", true).isValid()
  try {
    let findQuery = {};
    if (!isDate) {
      const productsIDSQuery = Products.find({
        $or: [
          { name: { $regex: name, $options: "i" } },
          {
            assignedCode: { $regex: name, $options: "i" },
          },
        ],
      }).select('_id')
      const customersIDSQuery = Customer.find({
        $or: [
          { customername: { $regex: name, $options: "i" } },
          {
            businessname: { $regex: name, $options: "i" },
          },
        ],
      }).select('_id')

      const [productsIDS, customersIDS] = await Promise.all([productsIDSQuery, customersIDSQuery])
      const productsPureIDS = productsIDS.map(({ _id }) => _id.toString())
      const customersPureIDS = customersIDS.map(({ _id }) => _id.toString())
      findQuery = {
        $or: [
          {
            customer: { $in: customersPureIDS }
          },
          {
            'products._id': { $in: productsPureIDS }
          }
        ]
      }
    } else {
      findQuery = { date: moment(name).format('L') }
    }
    const orders = await Order.find(findQuery)
    res.status(200).json({ orders });
  } catch (err) {
    console.log("searchOrderByProductText err", err);
  }
};

//
exports.executeDeliveryOccur = async (req, res) => {
  try {
    const today = new Date();
    const myToday = new Date(today);
    const oneWeekAgo = moment(myToday).subtract(7, 'days').toDate()
    const twoWeeksAgo = moment(myToday).subtract(14, 'days').toDate()


    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customerObject",
        },
      },
      {
        $unwind: {
          path: '$customerObject'
        }
      },
      {
        $lookup: {
          from: "deliveriesoccurs",
          localField: "customerObject.deliveryoccur",
          foreignField: "_id",
          as: "customerObject.deliveryoccur",
        },
      },
      {
        $unwind: {
          path: '$customerObject.deliveryoccur'
        }
      },
      {
        $match: {
          $or: [
            { date: { $gte: twoWeeksAgo, $lte: new Date() }, 'customerObject.deliveryoccur.number': 2 },
            { date: { $gte: oneWeekAgo, $lte: new Date() }, 'customerObject.deliveryoccur.number': 1 }
          ],
          status: 2, // only done orders
          deliveryOccured: false ///
        }
      },
    ]);

    const ordersIDS = orders.map((order) => order._id.toString()) // get pure orders ids
    const updateOrdersDeliveryQuery = Order.updateMany( // update orders deliveryOccured to avoid duplication same order multiple times
      {
        _id: { $in: ordersIDS }
      },
      {
        $set: {
          deliveryOccured: true
        }
      }
    )

    const [allRuns] = await Promise.all([
      getAllComingRuns(), //get all Runs to check
      updateOrdersDeliveryQuery
    ])

    const bulkUpsertOps = []

    const ordersToCreate = ([...orders]).map((current) => {

      let order = { ...current } //clone current order
      order._id = new mongoose.Types.ObjectId(); //generate new Order Object Id

      if (!order?.customerObject) return order;
      if (order.customerObject?.deliveryoccur?.number == 2) {
        order.date = moment(order.date).add(14, 'days').toDate() // add 14 days to date if number is 2
      } else {
        order.date = moment(order.date).add(7, 'days').toDate() // add 7 days to date if number is 1
      }
      const formatedOrderDate = moment(order.date).format('L')
      const customerRouteId = order.customerObject?.routeId?.toString() // customer route id from order customer object
      const existComingRun = allRuns.find((oneComingRun) => { // check existing coming run based on date and route id then return it
        if (!oneComingRun?.route || !oneComingRun?.date) return false;
        let formattedRunDate = moment(oneComingRun.date).format("L");
        let runRouteId = oneComingRun.route.toString();
        return (formattedRunDate == formatedOrderDate && runRouteId == customerRouteId)
      })
      if (existComingRun) { // if coming Run, update and push the new order id
        let runId = existComingRun._id.toString();
        bulkUpsertOps.push({
          updateOne: {
            filter: { _id: runId },
            update: { $push: { orders: order._id } },
            upsert: true,
          }
        })
      } else {// if not comin run, create new one with the new order id
        bulkUpsertOps.push({
          insertOne: {
            document: {
              date: formatedOrderDate,
              orders: [order._id],
              route: customerRouteId,
            }
          }
        })
      }
      delete order.customerObject
      order.status = 0
      order.automaticallyGenerated = true
      order.deliveryOccured = false
      return order
    })
    let createdOrders = await Order.insertMany(ordersToCreate)
    res.status(200).json({ orders: createdOrders }); //send created order to the client

    await Run.bulkWrite(bulkUpsertOps) // create or update Runs
  } catch (err) {
    console.log("err", err);
  }
};

// 63a99a816eb39e4af4979102
// 63a99a696eb39e4af49790f8
// 63a99a796eb39e4af49790fd

// cusotmers :
// 63b525112bc60c984d0a74d5
// 63b5253b2bc60c984d0a74df
// 63b5254d2bc60c984d0a74e5

//Customer : 1 weekly

// order  1/1-2022 -> trigger
// set (same order) 8/1-2023

// customer : 2 weeks (delivery occur :2)
// order
