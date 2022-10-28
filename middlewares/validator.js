const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");

exports.validateUserSignup = [
  check("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name is missing")
    .isLength({ min: 3, max: 20 })
    .withMessage("Invalid name, name must be 3 to 20 characaters long"),
  check("email").isEmail().withMessage("Email is Invalid"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 8, max: 20 })
    .withMessage("Invalid password, password must be 8 to 20 characaters long"),
  check("phonenumber")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Phone Number is missing"),
];

exports.validateUserLogin = [
  check("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name is missing")
    .isLength({ min: 3, max: 20 })
    .withMessage("Invalid name, name must be 3 to 20 characaters long"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password cannot be empty"),
];

exports.validateMongoId = (req, res, next) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) {
    return res.status(400).json("Please enter a valid ID");
  } else {
    next();
  }
};
exports.validateMongoCategoryId = (req, res, next) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.body.categoryId);
  if (!isValid) {
    return res.status(400).json("Please enter a valid ID");
  } else {
    next();
  }
};

exports.validate = (req, res, next) => {
  const error = validationResult(req).array();
  if (!error.length) return next();

  res.status(400).json({ success: false, error: error[0].msg });
};
