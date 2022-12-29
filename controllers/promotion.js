const Promotion = require("../models/Promotion");
const { log } = require("../helpers/Loger");
const Products = require("../models/Products");
const Category = require("../models/Category");

exports.createpromotion = async (req, res) => {
  const { productspromotion, categorypromotion, from, to } = req.body;
  try {
    console.clear();
    let now = new Date();
    let fromDate = new Date(from);
    let toDate = new Date(to);

    console.log("fromDate < now ", fromDate < now);
    console.log("toDate < now ", toDate < now);
    if (fromDate < now || toDate < now) {
      return res.status(400).json({
        success: false,
        message: "Please enter dates in the future",
      });
    }
    const newPromotion = new Promotion(req.body);

    let isProductPromotion = productspromotion.length != 0;
    let isCategoryPromotion = Object.keys(categorypromotion).length != 0;

    let isValidPromotion = isProductPromotion != isCategoryPromotion;

    if (!isValidPromotion) {
      return res.status(400).json({
        success: false,
        message: "Please fill in with only one type of promotion",
      });
    }

    if (isProductPromotion) {
      for (let i = 0; i < productspromotion.length; i++) {
        const product = await Products.findById(productspromotion[i].productId);

        if (!product) {
          return res.status(404).json({
            success: false,
            message: "Could not find product by this id",
          });
        }

        let originalproductprice = product.price;

        if (originalproductprice <= productspromotion[i].newprice)
          return res.status(400).json({
            success: false,
            message:
              "Please enter a lower price than the ususal one to create a promotion",
          });
      }
    } else {
      const category = await Category.findById(categorypromotion.categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Could not find category by this id",
        });
      }
    }

    const savedPromotion = await newPromotion.save();
    return res.status(200).json({ success: true, data: savedPromotion });
  } catch (err) {
    console.log("createpromotion err", err);
    await log(err);
    res.status(500).json(err);
  }
};

exports.updatePromotion = async (req, res) => {
  const { productspromotion, categorypromotion } = req.body;

  try {
    let objectsAreSamelyFullfilled =
      Object.keys(productspromotion).length ===
      Object.keys(categorypromotion).length;

    if (objectsAreSamelyFullfilled) {
      return res.status(400).json({
        success: false,
        message: "Please fill in with only one type of promotion",
      });
    }

    if (!(Object.keys(productspromotion).length === 0)) {
      const promotionproduct = await Products.findById(
        productspromotion.productId
      );

      if (!promotionproduct)
        return res.status(404).json({
          success: false,
          message: "Could not find product by this id",
        });

      let originalproductprice = promotionproduct.price;

      if (originalproductprice <= productspromotion.newprice)
        return res.status(400).json({
          success: false,
          message:
            "Please enter a lower price than the ususal one to create a promotion",
        });
    } else {
      const promotioncategoryId = await Category.findById(
        categorypromotion.categoryId
      );
      if (!promotioncategoryId)
        return res.status(404).json({
          success: false,
          message: "Could not find category by this id",
        });
    }
    const updatedPromotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (updatedPromotion) {
      return res.status(200).json(updatedPromotion);
    } else {
      return res.status(404).json("No promotion was found with this id !");
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
    const promotions = await Promotion.find().sort({ _id: -1 });
    const promotionCount = await Promotion.countDocuments();

    let objectTosend = {
      promotionCount,
      promotions,
    };

    if (promotions) {
      res.status(200).json(objectTosend);
    } else {
      return res.status(200).json("No categories found");
    }
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};
