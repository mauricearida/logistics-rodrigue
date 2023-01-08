const mongoose = require("mongoose");
const Run = require("./Run");

const DriverSchema = new mongoose.Schema(
  {
    name: { type: String },
    code: { type: String },
  },
  { timestamps: true }
);


DriverSchema.methods.isAvailable = async function () {
  try {
    const run = await Run.findOne({ driver: this._id, status: { $lte: 1 } })
    return !Boolean(run)
  } catch (e) {
    return true
  }
}


DriverSchema.statics.getAvailables = async function () {
  try {
    const drivers = await this.aggregate([
      {
        $lookup: {
          from: 'runs',
          foreignField: 'driver',
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
    return drivers
  } catch (e) {
    return null
  }
}

module.exports = mongoose.model("Driver", DriverSchema);
