const Log = require("../models/Log");

exports.log = async (message) => {
  try {
    await Log.create({ message });
  } catch (err) {
    console.log(err);
  }
};
