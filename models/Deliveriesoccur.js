const mongoose = require("mongoose");

const DeliveriesOccur = new mongoose.Schema(
  {
    number: { type: Number },
    name: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deliveriesoccur", DeliveriesOccur);
