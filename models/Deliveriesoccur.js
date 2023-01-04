const mongoose = require("mongoose");

const DeliveriesOccur = new mongoose.Schema(
  {
    number: { type: Number }, // fi ykoon 0 aw 1 aw 2
    name: { type: String },
  },
  { timestamps: true }
);
// 0 = Manually
// 1 = Weekly
// 2 = 2 weeks
module.exports = mongoose.model("Deliveriesoccur", DeliveriesOccur);
