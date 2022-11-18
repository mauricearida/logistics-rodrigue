const Order = require("../models/Orders");

exports.createOrder = async (req, res) => {
  console.log("1");
  //let userPromotion = req.body.Customer;
  //  console.log("userPromotion", userPromotion);
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    console.log(`err`, err);
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
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    if (orders) {
      res.status(200).json(orders);
    } else {
      return res.status(200).json("No orders found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
