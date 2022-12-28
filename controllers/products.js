const Products = require("../models/Products");
const { log } = require("../helpers/Loger");
const Sharedrecords = require("../models/Sharedrecords");

exports.updateCount = async (req, res) => {
  try {
    let currentProductCount = await Productcount.findById(
      "636103a47fdf2224276ae65d"
    );

    let updatedProductCount = await Productcount.findByIdAndUpdate(
      "636103a47fdf2224276ae65d",
      {
        $set: { count: currentProductCount.count + 1 },
      },
      { new: true }
    );
    console.log(`updatedProductCount`, updatedProductCount);
    res.status(200).json(updatedProductCount);
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.createproduct = async (req, res) => {
  const {
    name,
    categoryId,
    unitesperbox,
    prioritynumber,
    price,
    assignedcode,
  } = req.body;

  if (
    !name ||
    !categoryId ||
    !unitesperbox ||
    !prioritynumber ||
    !price ||
    !assignedcode
  ) {
    return res.status(400).json("Please fill in all the fields");
  } else {
    const newProduct = new Products(req.body);

    const isNewProductCode = await Products.isThisCodeInUse(assignedcode);
    if (!isNewProductCode)
      return res.status(400).json({
        success: false,
        message:
          "This product assigned code is already in use, please enter a different one",
      });

    try {
      const productName = await Products.findOne({ name: req.body.name });
      if (productName) {
        return res
          .status(403)
          .json("a product with this name has already been created");
      } else {
        const codeSequence = await Sharedrecords.findById(
          "63663fa59b531a420083d78f"
        );

        let codeid = codeSequence.productcodeid;
        codeid = codeid.toString();

        while (codeid.length < 4) {
          codeid = "0" + codeid;
        }
        newProduct.generatedCode = codeid;

        let savedProduct = await newProduct.save();

        res.status(200).json(savedProduct);
      }
    } catch (err) {
      console.log(err);
      await log(err);
      res.status(500).json(err);
    }
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Products.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (updatedProduct) {
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json("No product was found with this id !");
    }
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Products.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id).populate(
      "categoryId"
    );
    if (product) {
      return res.status(200).json(product);
    } else {
      return res.status(404).json("No product was found with this id !");
    }
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.getproductsPaginated = async (req, res) => {
  try {
    let productsCount = await Products.countDocuments();
    let hiddenProducts = await Products.countDocuments({ visibility: false });
    let visibleProducts = productsCount - hiddenProducts;
    const { page = 1, limit = 5 } = req.query;
    const products = await Products.find()
      .populate("categoryId")
      .sort("name")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res
      .status(200)
      .json({ productsCount, hiddenProducts, visibleProducts, products });
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.findProductsByTextSearch = async (req, res) => {
  const { find } = req.query;
  try {
    const found = await Products.find({
      $or: [
        { name: { $regex: find, $options: "i" } },
        { assignedCode: { $regex: find, $options: "i" } },
        { categoryId: { $regex: find, $options: "i" } },
      ],
    });

    if (!found) return res.status(404).json("No Products were found");
    return res.status(200).json(found);
  } catch (err) {
    console.log("err", err);
    await log(err);
    res.status(500).json(err);
  }
};
