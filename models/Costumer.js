const mongoose = require("mongoose");

const CostumerSchema = new mongoose.Schema(
  {
    isactive: { type: Boolean, required: true },
    businessname: { type: String, required: true },
    abn: { type: Number, required: true, unique: true },
    deliveryaddress: { type: String, required: true },
    deliveryaddress1: { type: String, required: true },
    deliveryaddress2: { type: String },
    suburb: { type: String, required: true },
    state: { type: String, required: true },
    postcode: { type: Number, required: true },
    notes: { type: String },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    phonenumber: { type: Number, required: true },
    mobilenumber: { type: Number, required: true },
    directdialnumber: { type: Number, required: true },
    howoftendeliveriesoccur: { type: Number, required: true },
    reminderorderconfirmationbydays: { type: Number },
    deliveryday: { type: String },
    deliverytime: { type: String },
    deliverytimerange: { type: String },
    defaultpaymentmethod: { type: Number, required: true },
    consolidatedbiller: { type: Boolean },
    billerforcostumer: { type: Number },
    haspromotion: { type: Boolean, required: true, default: false },
    promotionpercentage: { type: Number },
    ispricingdefault: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Costumer", CostumerSchema);