const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: { type: Number, required: true },
    unitesperbox: { type: Number, required: true },
    prioritynumber: { type: Number, required: true },
    visibility: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.statics.isThisCodeInUse = async function (code) {
  if (!code) throw new Error("Please a code for the product");
  try {
    const product = await this.findOne({ code });
    if (product) return false;
    return true;
  } catch (error) {
    console.error(`error inside isThisCodeInUse method`, error.message);
    return false;
  }
};

module.exports = mongoose.model("Product", ProductSchema);
