const Promotion = require("../models/Promotion");
const { log } = require("../helpers/Loger");

exports.createpromotion = async (req, res) => {
  const newPromotion = new Promotion(req.body);
  try {
    const savedPromotion = await newPromotion.save();
    res.status(200).json(savedPromotion);
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.updatePromotion = async (req, res) => {
  try {
    const updatedPromotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (updatedPromotion) {
      res.status(200).json(updatedPromotion);
    } else {
      res.status(404).json("No promotion was found with this id !");
    }
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.deletePromotion = async (req, res) => {
  try {
    await Promotion.findByIdAndDelete(req.params.id);
    res.status(200).json("Promotion has been deleted...");
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.getPromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (promotion) {
      res.status(200).json(promotion);
    } else {
      res.status(404).json("No promotion was found with this id !");
    }
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find();
    if (promotions) {
      res.status(200).json(promotions);
    } else {
      return res.status(200).json("No categories found");
    }
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};
