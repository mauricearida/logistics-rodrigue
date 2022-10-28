const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phonenumber: { type: String, required: true, unique: true },
    lastlogin: { type: Date, default: null },
    role: { type: Number, default: 0 },
    // 0 = user
    // 1 = admin
    // 2 = driver (does not user the website)
  },
  { timestamps: true }
);

UserSchema.statics.isThisEmailInUse = async function (email) {
  if (!email) throw new Error("Invalid Email");
  try {
    const user = await this.findOne({ email });
    if (user) return false;
    return true;
  } catch (error) {
    console.error(`error inside isThisEmailInUse method`, error.emssage);
    return false;
  }
};

UserSchema.statics.isThisNameInUse = async function (name) {
  if (!name) throw new Error("Please enter your name");
  try {
    const user = await this.findOne({ name });
    if (user) return false;
    return true;
  } catch (error) {
    console.error(`error inside isThisNameInUse method`, error.emssage);
    return false;
  }
};

module.exports = mongoose.model("User", UserSchema);
