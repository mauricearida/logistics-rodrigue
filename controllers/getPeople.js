const User = require("../models/User");
const { log } = require("../helpers/Loger");

exports.getAllAdmins = async (req, res) => {
  try {
    const users = await User.find({ role: 0 });
    //=====================

    //=======================
    if (!users)
      return res
        .status(404)
        .json({ success: "false", message: "There are no admins yet" });
    else return res.status(200).json(users);
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 1 });
    if (!users)
      return res
        .status(404)
        .json({ success: "false", message: "There are no users yet" });
    else return res.status(200).json(users);
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.getAllDrivers = async (req, res) => {
  try {
    const users = await User.find({ role: 2 });
    if (!users)
      return res
        .status(404)
        .json({ success: "false", message: "There are no drivers yet" });
    else return res.status(200).json(users);
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};
