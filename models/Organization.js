const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema(
  {
    name: { type: String },
    customers: [
      {
        customerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Customer",
        },
      },
    ],
  },
  { timestamps: true }
);

OrganizationSchema.statics.isThisOrganizationNameInUse = async function (name) {
  if (!name) throw new Error("Please a name to the organization");
  try {
    const organization = await this.findOne({ name });
    if (organization) return false;
    return true;
  } catch (error) {
    console.error(`error inside isThisNameInUse method`, error.message);
    return false;
  }
};

module.exports = mongoose.model("Organization", OrganizationSchema);
