const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
    places: [{ type: String }],
    costumers: [
      {
        costumer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Costumer",
        },
      },
    ],
    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Route", RouteSchema);
