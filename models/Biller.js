const mongoose = require("mongoose");

const BillerSchema = new mongoose.Schema(
  {
    number: { type: Number },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Biller", BillerSchema);
