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


VehicleSchema.methods.isAvailable = async function () {
  try {
    const run = await Run.exists({ vehicle: this._id, status: { $lte: 1 } })
    return !Boolean(run)
  } catch (e) {
    return true
  }
}

VehicleSchema.statics.getAvailables = async function () {
  try {
    const vehicles = await mongoose.model("Vehicle", VehicleSchema).aggregate([
      {
        $lookup: {
          from: 'runs',
          foreignField: 'vehicle',
          localField: '_id',
          as: 'run'
        },
      },
      {
        $unwind: {
          path: "$run",
          preserveNullAndEmptyArrays: true
        },
      },
      {
        $match: {
          $or: [
            {
              run: { $exists: false }
            },
            {
              'run.status': { $lte: 0 }
            }
          ]
        }
      }
    ])
    return vehicles
  } catch (e) {
    return null
  }
}

module.exports = mongoose.model("Vehicle", VehicleSchema);
