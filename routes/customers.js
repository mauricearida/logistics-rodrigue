const { verifyTokenAndAdmin, verifyToken } = require("./verifyToken");
const {
  validateMongoId,
  validateCreateCustomer,
  validate,
} = require("../middlewares/validators");
const Customer = require("../models/Customer");
const Sharedrecords = require("../models/Sharedrecords");
const router = require("express").Router();

// category id:
// 6364e4756a334d5fb98a79aa

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

//const dateStr = "2023-07-21T12:24:24";
const dateStr = "2023-07-21T09:24:24";
const dateStrr = "2023-07-21T08:24:24";
// 2022-07-21T00:00:00.000Z

//CREATE
router.post(
  "/",
  verifyToken,
  validateCreateCustomer,
  validate,
  async (req, res) => {
    // let abn = req.body.abn;
    // if (abn) {
    //   const isThisAbnInUse = await Customer.isThisAbnInUse(abn);
    //   if (!isThisAbnInUse)
    //     return res.status(400).json({
    //       success: false,
    //       message: "This abn is already in use, try enter a different one",
    //     });
    // }

    //===============================

    // let toDate = "2023-07-21T09:24:24";
    // let fromDate = "2023-07-21T08:24:24";
    // const isTimeSequence =
    // new Date(toDate).getTime() < new Date(fromDate).getTime();
    // console.log(`isTimeSequence`, isTimeSequence);
    const newCustomer = new Customer(req.body);
    const codeSequence = await Sharedrecords.findById(
      "63663fa59b531a420083d78f"
    );
    let codeid = codeSequence.customercodeid;
    console.log("codeid", codeid);
    newCustomer.codeid = codeid;
    try {
      const savedCustomer = await newCustomer.save();
      res.status(200).json(savedCustomer);

      const updatedOcdeSequence = await Sharedrecords.findByIdAndUpdate(
        "63663fa59b531a420083d78f",
        {
          $inc: { customercodeid: 1 },
        },
        { new: true }
      );
      console.log("updatedOcdeSequence", updatedOcdeSequence);
    } catch (err) {
      console.log(`err`, err);
      res.status(400).json(err);
    }
  }
);

//UPDATE
router.put("/:id", verifyTokenAndAdmin, validateMongoId, async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCustomer);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete(
  "/:id",
  verifyTokenAndAdmin,
  validateMongoId,
  async (req, res) => {
    try {
      await Customer.findByIdAndDelete(req.params.id);
      res.status(200).json("Customer has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

//GET Customer
router.get("/:id", validateMongoId, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json(err);
  }
});

// api/customer?page=1&limit=9&isarchived=false
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const { page, limit, isarchived } = req.query;
    if (!page || !limit || !isarchived)
      return res
        .status(400)
        .json(
          "the required query parameters are : page and limit and isarchived"
        );
    const customers = await Customer.find({ isarchived: isarchived })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
