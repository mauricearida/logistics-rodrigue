const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema(
  {
    message: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", LogSchema);
