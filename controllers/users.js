const User = require("../models/User");
const { log } = require("../helpers/Loger");

exports.updateUser = async (req, res) => {
  const { name, username, email, password, phonenumber } = req.body;
  if (!name && !username && !email && !password && !phonenumber) {
    return res.status(400).json("Please enter at least one valid parameter !");
  }
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.deteleUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(200).json("No User was found by this id");
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page, limit } = req.query;
    if (!page || !limit)
      return res
        .status(400)
        .json("the required query parameters are : page and limit");
    const users = await User.find()
      .sort({ _id: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.status(200).json(users);
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};
