const Order = require("../models/Orders");
const { log } = require("../helpers/Loger");
import moment from "moment";

exports.createOrder = async (req, res) => {
  const {} = req.body;
  try {
    const newOrder = new Order(req.body);

    console.log("req.body", req.body);
    let date = new Date();

    console.log("date", date.getDate());

    const savedOrder = await newOrder.save();

    res.status(200).json(savedOrder);
  } catch (err) {
    console.log("err", err);
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
  try {
    const orders = await Order.find()
      .populate("customer")
      .populate({
        path: "products",
        populate: {
          path: "product",
          model: "Product",
        },
      })
      .exec();
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
