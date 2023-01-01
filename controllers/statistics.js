const Order = require("../models/Orders");
const Run = require("../models/Run");
const { log } = require("../helpers/Loger");
const dayjs = require("dayjs");

exports.getLastMonthSales = async (req, res) => {
  console.clear();
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  try {
    // const income = await Order.aggregate([
    //   { $match: { createdAt: { $gte: previousMonth } } },
    //   {
    //     $project: {
    //       month: { $month: "$createdAt" },
    //       sales: "$amount",
    //       status: 2,
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$month",
    //       total: { $sum: "$sales" },
    //     },
    //   },
    // ]);
    // const savedRun = await newRun.save();
    //  res.status(200).json(savedRun);
  } catch (err) {
    console.log("getSalesByDay err", err);
    await log(err);
    res.status(500).json(err);
  }
};

exports.getSalesByDay = async (req, res) => {
  console.clear();
  const { date } = req.query;
  try {
    let yesterday = dayjs(date).subtract(1, "days");
    const myDate = new Date(date);
    const myYesterday = new Date(yesterday);

    const orders = await Order.aggregate([
      { $match: { date: { $gte: myYesterday, $lte: myDate } } },
    ]);
    let totalIncome = 0;
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].status == 2)
        totalIncome = totalIncome + orders[i].totalamount;
    }
    res.status(200).json({ success: true, totalIncome });
  } catch (err) {
    console.log("getSalesByDay err", err);
    await log(err);
    res.status(500).json(err);
  }
};

exports.getOrdersByUserId = async (req, res) => {
  let userId = req.params.id;
  try {
    const orders = await Order.find({ status: 2, initiateduser: userId });

    let totalIncome = 0;
    for (let i = 0; i < orders.length; i++) {
      totalIncome = totalIncome + orders[i].totalamount;
    }

    res.status(200).json({ success: true, totalIncome, orders });
  } catch (err) {
    console.log("getSalesByDay err", err);
    await log(err);
    res.status(500).json(err);
  }
};

exports.getSalesMonth = async (req, res) => {
  console.clear();
  const { date } = req.query;
  try {
    let yesterday = dayjs(date).subtract(1, "days");
    const myDate = new Date(date);
    const myYesterday = new Date(yesterday);

    const orders = await Order.aggregate([
      { $match: { date: { $gte: myYesterday, $lte: myDate } } },
    ]);
    let totalIncome = 0;
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].status == 2)
        totalIncome = totalIncome + orders[i].totalamount;
    }
    res.status(200).json({ success: true, totalIncome });
  } catch (err) {
    console.log("getSalesByDay err", err);
    await log(err);
    res.status(500).json(err);
  }
};
