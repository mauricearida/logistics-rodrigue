const Log = require("../models/Log");

const log = async (message) => {
  try {
    await Log.create({ message });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  log,
};
