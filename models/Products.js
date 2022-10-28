const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: { type: Number, required: true },
    unitesperbox: { type: Number, required: true },
    prioritynumber: { type: Number, required: true },
    visibility: { type: Boolean, required: true },
    // false = not available
    // true = visible
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
