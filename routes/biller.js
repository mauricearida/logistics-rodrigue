const Biller = require("../models/Biller");
const { verifyTokenAndAdmin } = require("./verifyToken");
const {
  validateMongoId,
  creatingBiller,
  validate,
} = require("../middlewares/validators");
const Sharedrecords = require("../models/Sharedrecords");
const router = require("express").Router();

//CREATE BILLER
router.post(
  "/",
  verifyTokenAndAdmin,
  creatingBiller,
  validate,
  async (req, res) => {
    const newBiller = new Biller(req.body);
    const codeSequence = await Sharedrecords.findById(
      "63663fa59b531a420083d78f"
    );
    let codeid = codeSequence.billercodeid;
    console.log("billercodeid", codeid);
    newBiller.number = codeid;
    try {
      const billerName = await Biller.findOne({ name: req.body.name });
      if (billerName) {
        return res
          .status(401)
          .json("A biller with this name has already been created");
      } else {
        const savedBiller = await newBiller.save();
        res.status(200).json(savedBiller);
        await Sharedrecords.findByIdAndUpdate(
          "63663fa59b531a420083d78f",
          {
            $inc: { billercodeid: 1 },
          },
          { new: true }
        );
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

//UPDATE BILLER
router.put(
  "/:id",
  verifyTokenAndAdmin,
  validateMongoId,
  creatingBiller,
  validate,
  async (req, res) => {
    try {
      const updatedBiller = await Biller.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedBiller);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

//DELETE BILLER
router.delete(
  "/:id",
  verifyTokenAndAdmin,
  validateMongoId,
  async (req, res) => {
    try {
      await Biller.findByIdAndDelete(req.params.id);
      res.status(200).json("Biller has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

//GET BILLER
router.get("/:id", validateMongoId, async (req, res) => {
  try {
    const product = await Biller.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL BILLERS
router.get("/", async (req, res) => {
  try {
    const billers = await Biller.find();
    res.status(200).json(billers);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
