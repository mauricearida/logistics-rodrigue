const mongoose = require("mongoose");

const SharedRecordsSchema = new mongoose.Schema(
  {
    customercodeid: { type: Number, required: true },
    billercodeid: { type: Number, required: true },
    paymentmethodcodeid: { type: Number, required: true },
    deliveryoccurcodeid: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sharedrecords", SharedRecordsSchema);
// 63663fa59b531a420083d78f
