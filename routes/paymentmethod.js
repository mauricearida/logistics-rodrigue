const Paymentmethod = require("../models/Paymentmethod");
const { verifyTokenAndAdmin } = require("./verifyToken");
const { validateMongoId } = require("../middlewares/validators");
const Sharedrecords = require("../models/Sharedrecords");
const router = require("express").Router();

//CREATE PAYMENTMETHOD
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newPaymentmethod = new Paymentmethod(req.body);
  const codeSequence = await Sharedrecords.findById("63663fa59b531a420083d78f");
  let codeid = codeSequence.paymentmethodcodeid;
  console.log("paymentmethodcodeid", codeid);
  newPaymentmethod.number = codeid;
  try {
    const paymentMethodName = await Paymentmethod.findOne({
      name: req.body.name,
    });
    if (paymentMethodName) {
      return res
        .status(401)
        .json("A payment method with this name has already been created");
    } else {
      const savedPaymentmethod = await newPaymentmethod.save();
      res.status(200).json(savedPaymentmethod);
      await Sharedrecords.findByIdAndUpdate(
        "63663fa59b531a420083d78f",
        {
          $inc: { paymentmethodcodeid: 1 },
        },
        { new: true }
      );
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE PAYMENTMETHOD
router.put("/:id", verifyTokenAndAdmin, validateMongoId, async (req, res) => {
  try {
    const updatedPaymentMethod = await Paymentmethod.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (updatedPaymentMethod) {
      return res.status(200).json(updatedPaymentMethod);
    } else {
      return res.status(404).json("Payment Method not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//DELETE PAYMENTMETHOD
router.delete(
  "/:id",
  verifyTokenAndAdmin,
  validateMongoId,
  async (req, res) => {
    try {
      await Paymentmethod.findByIdAndDelete(req.params.id);
      res.status(200).json("Payment method has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

//GET PAYMENTMETHOD
router.get("/:id", validateMongoId, async (req, res) => {
  try {
    const paymentMethod = await Paymentmethod.findById(req.params.id);
    if (!paymentMethod)
      return res.status(404).json("Payment method is not found");
    res.status(200).json(paymentMethod);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL PAYMENTMETHODS
router.get("/", async (req, res) => {
  try {
    const paymentMethods = await Paymentmethod.find();
    res.status(200).json(paymentMethods);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
