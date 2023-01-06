const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema(
  {
    name: { type: String },
    code: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", DriverSchema);
