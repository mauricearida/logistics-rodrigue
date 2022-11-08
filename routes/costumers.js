const { verifyTokenAndAdmin, verifyToken } = require("./verifyToken");
const {
  validateMongoId,
  validateCreateCostumer,
  validate,
} = require("../middlewares/validators");
const Costumer = require("../models/Costumer");
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
  validateCreateCostumer,
  validate,
  async (req, res) => {
    // let abn = req.body.abn;
    // if (abn) {
    //   const isThisAbnInUse = await Costumer.isThisAbnInUse(abn);
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
    const newCostumer = new Costumer(req.body);
    const codeSequence = await Sharedrecords.findById(
      "63663fa59b531a420083d78f"
    );
    let codeid = codeSequence.costumercodeid;
    console.log("codeid", codeid);
    newCostumer.codeid = codeid;
    try {
      const savedCostumer = await newCostumer.save();
      res.status(200).json(savedCostumer);

      const updatedOcdeSequence = await Sharedrecords.findByIdAndUpdate(
        "63663fa59b531a420083d78f",
        {
          $inc: { costumercodeid: 1 },
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
    const updatedCostumer = await Costumer.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCostumer);
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
      await Costumer.findByIdAndDelete(req.params.id);
      res.status(200).json("Costumer has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

//GET Costumer
router.get("/:id", validateMongoId, async (req, res) => {
  try {
    const costumer = await Costumer.findById(req.params.id);
    res.status(200).json(costumer);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const { page, limit, isarchived } = req.query;
    if (!page || !limit)
      return res
        .status(400)
        .json(
          "the required query parameters are : page and limit, and archived is optional"
        );

    const costumers = await Costumer.find({ isarchived: isarchived })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.status(200).json(costumers);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
