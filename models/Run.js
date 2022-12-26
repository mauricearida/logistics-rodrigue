const mongoose = require("mongoose");

const RunSchema = new mongoose.Schema(
  {
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
    },
    date: { type: Date },
    note: { type: String },
    status: { type: Number, default: 0 },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
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
