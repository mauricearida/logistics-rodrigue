const mongoose = require("mongoose");
const Run = require("./Run");

const VehicleSchema = new mongoose.Schema(
  {
    plate: { type: String },
    model: { type: String },
    make: { type: String },
    color: { type: String },
    expiresIn: { type: Date },
    lastUsed: { type: Date },
    manufactureyear: { type: Number },
    status: { type: Number, default: 0 },
  },
  { timestamps: true }
);

VehicleSchema.methods.isAvailable = async function () {
  try {
    const run = await Run.exists({ vehicle: this._id });
    return !Boolean(run);
  } catch (e) {
    return true;
  }
};

VehicleSchema.statics.getAvailables = async function () {
  try {
    const vehicles = await this.aggregate([
      {
        $lookup: {
          from: "runs",
          foreignField: "vehicle",
          localField: "_id",
          as: "runs",
        },
      },
      {
        $match: {
          runs: { $size: 0 },
        },
      },
    ]);
    return vehicles;
  } catch (e) {
    return null;
  }
};

module.exports = mongoose.model("Vehicle", VehicleSchema);
