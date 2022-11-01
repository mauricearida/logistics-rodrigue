const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Costumer",
      required: true,
    },
    status: { type: Number, required: true, default: 0 },
    deliveryfee: { type: Number, required: true },
    notes: { type: String },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        // productId: {
        //   type: String,
        // },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    date: { type: Date },
    howoftenshoulddeliveriesoccur: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
