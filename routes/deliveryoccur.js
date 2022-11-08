const DeliveryOccur = require("../models/Deliveriesoccur");
const { verifyTokenAndAdmin } = require("./verifyToken");
const { validateMongoId } = require("../middlewares/validators");
const Sharedrecords = require("../models/Sharedrecords");
const router = require("express").Router();

//CREATE DELIVERYOCCUR
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newDeliveryOccur = new DeliveryOccur(req.body);
  const codeSequence = await Sharedrecords.findById("63663fa59b531a420083d78f");
  let codeid = codeSequence.deliveryoccurcodeid;
  console.log("deliveryoccurcodeid", codeid);
  newDeliveryOccur.number = codeid;
  try {
    const deliveryOccurName = await DeliveryOccur.findOne({
      name: req.body.name,
    });
    if (deliveryOccurName) {
      return res
        .status(401)
        .json("A delivery occur with this name has already been created");
    } else {
      const savedDeliveryOccur = await newDeliveryOccur.save();
      res.status(200).json(savedDeliveryOccur);
      await Sharedrecords.findByIdAndUpdate(
        "63663fa59b531a420083d78f",
        {
          $inc: { deliveryoccurcodeid: 1 },
        },
        { new: true }
      );
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE DELIVERYOCCUR
router.put("/:id", verifyTokenAndAdmin, validateMongoId, async (req, res) => {
  try {
    const updatedDeliveryOccur = await DeliveryOccur.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (updatedDeliveryOccur) {
      return res.status(200).json(updatedDeliveryOccur);
    } else {
      return res.status(404).json("Delivery occur method not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//DELETE DELIVERYOCCUR
router.delete(
  "/:id",
  verifyTokenAndAdmin,
  validateMongoId,
  async (req, res) => {
    try {
      await DeliveryOccur.findByIdAndDelete(req.params.id);
      res.status(200).json("Delivery occur method has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

//GET DELIVERYOCCUR
router.get("/:id", validateMongoId, async (req, res) => {
  try {
    const deliveryOccur = await DeliveryOccur.findById(req.params.id);
    if (!deliveryOccur)
      return res.status(404).json("Delivery occur method is not found");
    res.status(200).json(deliveryOccur);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL DELIVERYOCCURS
router.get("/", async (req, res) => {
  try {
    const deliveryOccur = await DeliveryOccur.find();
    res.status(200).json(deliveryOccur);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
