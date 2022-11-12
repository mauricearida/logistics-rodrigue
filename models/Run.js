const mongoose = require("mongoose");

const RunSchema = new mongoose.Schema(
  {
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
    },
    note: { type: String },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // date: { type: Date, required: true },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Run", RunSchema);
