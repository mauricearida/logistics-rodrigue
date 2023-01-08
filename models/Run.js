const mongoose = require("mongoose");
const driver = require("./driver");
const Vehicle = require("./Vehicle");

const RunSchema = new mongoose.Schema(
  {
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
    },
    date: { type: Date },
    note: { type: String },
    status: { type: Number, default: 0 },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
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

RunSchema.pre("insertMany", async function (done, docs) {
  const [availableDrivers, availableVehicles] = await Promise.all([
    driver.getAvailables(),
    Vehicle.getAvailables(),
  ]);
  const usedDrivers = [];
  const usedVehicles = [];
  docs = docs.map((doc) => {
    if (!doc.driver) {
      const driver = availableDrivers.filter(
        (ava) => !usedDrivers.includes(ava._id)
      );
      const id = driver?.[0]?._id;
      doc.driver = id;
      usedDrivers.push(id);
    }
    if (!doc.vehicle) {
      let vehicle = availableVehicles.filter(
        (ava) => !usedVehicles.includes(ava._id)
      );
      const id = vehicle?.[0]?._id;
      doc.vehicle = id;
      usedVehicles.push(id);
    }
    return doc;
  });
  return done();
});

RunSchema.pre("save", async function (done) {
  if (!this.isNew) return done();
  if (!this.vehicle) {
    let availables = await Vehicle.getAvailables();
    this.vehicle = availables?.[0]?._id;
  }
  if (!this.driver) {
    let availables = await driver.getAvailables();
    this.driver = availables?.[0]?._id;
  }
  return done();
});

module.exports = mongoose.model("Run", RunSchema);
