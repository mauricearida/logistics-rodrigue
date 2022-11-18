const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
    places: [{ type: String }],
    customers: [
      {
        customer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Customer",
        },
      },
    ],
    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Route", RouteSchema);
