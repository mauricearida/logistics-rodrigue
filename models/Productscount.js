const mongoose = require("mongoose");

const ProductCountSchema = new mongoose.Schema(
  {
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Productcount", ProductCountSchema);
