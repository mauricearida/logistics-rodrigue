const Product = require("../models/Products");

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
    console.log(`err`, err);
    res.status(500).json(err);
  }
};

exports.createproduct = async (req, res) => {
  const { name, categoryId, unitesperbox, prioritynumber, price, code } =
    req.body;
  if (
    !name ||
    !categoryId ||
    !unitesperbox ||
    !prioritynumber ||
    !price ||
    !code
  ) {
    return res.status(400).json("Please fill in all the fields");
  } else {
    const newProduct = new Product(req.body);

    const isNewProductCode = await User.isThisCodeInUse(email);
    if (!isNewProductCode)
      return res.status(400).json({
        success: false,
        message:
          "This product code is already in use, please enter a different one",
      });

    try {
      const productName = await Product.findOne({ name: req.body.name });
      if (productName) {
        return res
          .status(401)
          .json("a product with this name has already been created");
      } else {
        const savedProduct = await newProduct.save();
        if (savedProduct) {
          changeProductCount("increase");
        }
        res.status(200).json(savedProduct);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getproductsPaginated = async (req, res) => {
  try {
    let productsCount = await Product.count({}).exec();
    const { page = 1, limit = 5 } = req.query;
    const products = await Product.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.status(200).json({ productsCount, products });
  } catch (err) {
    res.status(500).json(err);
  }
};
