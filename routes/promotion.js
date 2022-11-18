const { verifyTokenAndAdmin } = require("./verifyToken");
const {
  validateMongoId,
  validateCreatingPromotion,
} = require("../middlewares/validators");
const Promotion = require("../models/Promotion");
const router = require("express").Router();

// {
//     "name": "promotion name",
//     "description": "description name",
//     "from": "2022-07-21T00:00:00.000Z",
//     "to": "2021-07-21T00:00:00.000Z"
// }

//CREATE
router.post(
  "/",
  verifyTokenAndAdmin,
  validateCreatingPromotion,
  async (req, res) => {
    const newPromotion = new Promotion(req.body);
    try {
      const savedPromotion = await newPromotion.save();
      res.status(200).json(savedPromotion);
    } catch (err) {
      console.log(`err`, err);
      res.status(500).json(err);
    }
  }
);

//UPDATE
router.put("/:id", verifyTokenAndAdmin, validateMongoId, async (req, res) => {
  try {
    const updatedPromotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedPromotion);
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
      await Promotion.findByIdAndDelete(req.params.id);
      res.status(200).json("Promotion has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

//GET Category
router.get("/:id", validateMongoId, async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    res.status(200).json(promotion);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL Promotion
router.get("/", async (req, res) => {
  try {
    const promotions = await Promotion.find();
    if (promotions) {
      res.status(200).json(promotions);
    } else {
      return res.status(200).json("No categories found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
