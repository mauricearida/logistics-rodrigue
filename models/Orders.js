const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    deliveryfee: { type: Number },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        pricePerUnit: { type: Number, default: 0 },
      },
    ],
    totalamount: { type: Number },
    deliveriesoccur: { type: Number, required: true, default: 0 },
    date: { type: Date },
    notes: { type: String },
    status: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
