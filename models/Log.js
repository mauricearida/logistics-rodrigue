const mongoose = require("mongoose");

const LoggerSchema = new mongoose.Schema(
  {
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Log", LoggerSchema);
