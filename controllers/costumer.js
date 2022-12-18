const Customer = require("../models/Customer");
const Sharedrecords = require("../models/Sharedrecords");
const { log } = require("../helpers/Loger");

exports.createCostumer = async (req, res) => {
  const newCustomer = new Customer(req.body);
  const codeSequence = await Sharedrecords.findById("63663fa59b531a420083d78f");
  let codeid = codeSequence.customercodeid;
  codeid = codeid.toString();

  while (codeid.length < 4) {
    codeid = "0" + codeid;
  }
  newCustomer.codeid = codeid;

  const isNewBusinessName = await Customer.isThisBusinessNameInUse(
    req.body.businessname
  );
  if (!isNewBusinessName)
    return res.status(400).json({
      success: false,
      message:
        "This business name is already in use, try register with a different one",
    });

  const isNewEmail = await Customer.isThisEmailInUse(req.body.email);
  if (!isNewEmail)
    return res.status(400).json({
      success: false,
      message:
        "This email is already in use, try register with a different one",
    });
  try {
    const savedCustomer = await newCustomer.save();
    res.status(200).json(savedCustomer);
    console.log("1111");
    const updatedOcdeSequence = await Sharedrecords.findByIdAndUpdate(
      "63663fa59b531a420083d78f",
      {
        $inc: { customercodeid: 1 },
      },
      { new: true }
    );
    console.log("updatedOcdeSequence", updatedOcdeSequence);
  } catch (err) {
    console.log("err", err);
    await log(err);
    res.status(500).json(err);
  }
};

exports.updateCostumer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (updatedCustomer) {
      res.status(200).json(updatedCustomer);
    } else {
      res.status(404).json("no costumer was found with this id");
    }
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.deleteCostumer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    const customerCount = await Customer.find().count();
    let objectTosend = {
      customerCount,
      message: "Customer has been deleted...",
    };
    res.status(200).json(objectTosend);
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.getCostumer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate(
      "paymentmethod"
    );
    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(404).json("no costumer was found with this id");
    }
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.getCostumerPaginatedArchived = async (req, res) => {
  try {
    const customerCount = await Customer.find().count();
    const { page, limit, isarchived } = req.query;
    if (!page || !limit || !isarchived)
      return res
        .status(400)
        .json(
          "the required query parameters are : page and limit and isarchived"
        );
    let customers = await Customer.find({ isarchived: isarchived })
      .populate("paymentmethod")
      .sort({ _id: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    customers = { customerCount, customers };
    res.status(200).json(customers);
  } catch (err) {
    console.log("err", err);
    await log(err);
    res.status(500).json(err);
  }
};
