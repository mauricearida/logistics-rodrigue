const Customer = require("../models/Customer");
const Sharedrecords = require("../models/Sharedrecords");
const { log } = require("../helpers/Loger");

// {
//     "codeid": 12,
//     "businessname": "busine3ss name",
//     "to": 1233,
//     "abn":123,
//     "from": 1233,
//     "address": [
//         "This is an array"
//     ],
//     "suburb": "suburb 132",
//     "ispricingdefault": true,
//     "firstname": "first name",
//     "phonenumber": "123456679",
//     "deliveryoccur": "6364e4756a334d5fb98a79aa",
//     "paymentmethod": "6364e4756a334d5fb98a79aa",
//     "isconsolidatedbiller": true,
//     "postcode": 123,
//     "state": true
// }

exports.createCostumer = async (req, res) => {
  const newCustomer = new Customer(req.body);
  const codeSequence = await Sharedrecords.findById("63663fa59b531a420083d78f");
  let codeid = codeSequence.customercodeid;
  console.log("codeid", codeid);
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
    res.status(200).json("Customer has been deleted...");
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
    const { page, limit, isarchived } = req.query;
    if (!page || !limit || !isarchived)
      return res
        .status(400)
        .json(
          "the required query parameters are : page and limit and isarchived"
        );
    const customers = await Customer.find({ isarchived: isarchived })
      .populate("paymentmethod")
      .sort({ _id: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.status(200).json(customers);
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};
