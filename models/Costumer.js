const mongoose = require("mongoose");

const CostumerSchema = new mongoose.Schema(
  {
    codeid: { type: Number, required: true },
    businessname: { type: String, required: true },
    address: { type: [String], required: true },
    isarchived: { type: Boolean, default: false },
    suburb: { type: String, required: true },
    notes: { type: String },
    pendingorders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        default: null,
      },
    ],
    ispricingdefault: { type: Boolean, required: true, default: false },
    firstname: { type: String, required: true },
    lastname: { type: String },
    email: { type: String },
    phonenumber: { type: String, required: true },
    mobilenumber: { type: String },
    directdialnumber: { type: String },
    state: { type: String, required: true },
    // status: { type: Boolean, required: true, default: false },
    postcode: { type: Number, required: true },
    deliveryoccur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deliveriesoccur",
      required: true,
    },
    delivery: {
      daystoremind: { type: Number },
      day: { type: String },
      time: { type: Date },
      //the costumer here has to choose
      //between the 2 lines above or the one line below
      preferredtimes: [
        {
          day: { type: String },
          starttime: { type: Date },
          endtime: { type: Date },
        },
      ],
    },
    paymentmethod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paymentmethod",
      required: true,
    },
    isconsolidatedbiller: { type: Boolean, required: true },
    billerforcostumer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Biller",
    },
    promotions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Promotion",
      },
    ],
    ispricingdefault: { type: Boolean, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Costumer", CostumerSchema);
