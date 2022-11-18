const mongoose = require("mongoose");

const PromotionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    from: { type: Date },
    to: { type: Date },
    listprice: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        newprice: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Promotion", PromotionSchema);
