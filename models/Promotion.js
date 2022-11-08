const mongoose = require("mongoose");

const PromotionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    from: { type: Date },
    to: { type: Date },
    promotionallistprice: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        newprice: { type: Number },
      },
    ],
    promotionalcategorypercentage: [
      {
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
        },
        percentage: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Promotion", PromotionSchema);
