const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema(
  {
    plate: { type: String },
    model: { type: String },
    make: { type: String },
    color: { type: String },
    expiresIn: { type: Date },
    lastUsed: { type: Date },
    status: { type: Number, default: 0 },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

VehicleSchema.statics.isThisPlateInUse = async function (plate) {
  if (!plate) throw new Error("Invalid Plate");
  try {
    const vehicle = await this.findOne({ plate });
    if (vehicle) return false;
    return true;
  } catch (error) {
    console.error(`error inside isThisPlateInUse method`, error.message);
    return false;
  }
};

module.exports = mongoose.model("Vehicle", VehicleSchema);
