const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    assignedCode: { type: String },
    generatedCode: { type: String },
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

ProductSchema.statics.isThisCodeInUse = async function (assignedCode) {
  if (!assignedCode) throw new Error("Please an assigned Code for the product");
  try {
    const product = await this.findOne({ assignedCode });
    if (product) return false;
    return true;
  } catch (error) {
    console.error(`error inside isThisCodeInUse method`, error.message);
    return false;
  }
};

module.exports = mongoose.model("Product", ProductSchema);
