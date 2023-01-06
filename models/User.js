const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phonenumber: { type: String, unique: true },
    lastlogin: { type: Date, default: null },
    role: { type: Number, default: 0 },
    ordersCount: { type: Number, default: 0 },
    theme: { type: Number, default: 0 },

    // 0 = user
    // 1 = admin
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
    console.error(`error inside isThisEmailInUse method`, error.message);
    return false;
  }
};

UserSchema.statics.isThisUsernameInUse = async function (name) {
  if (!name) throw new Error("Please enter your username");
  try {
    const user = await this.findOne({ name });
    if (user) return false;
    return true;
  } catch (error) {
    console.error(`error inside isThisUsernameInUse method`, error.message);
    return false;
  }
};

UserSchema.statics.isThisPhoneInUse = async function (phone) {
  if (!phone) throw new Error("Please enter your phone number");
  try {
    const user = await this.findOne({ phone });
    console.log("user", user);
    console.log("phone", phone);
    if (user) return false;
    return true;
  } catch (error) {
    console.error(`error inside isThisUsernameInUse method`, error.message);
    return false;
  }
};

module.exports = mongoose.model("User", UserSchema);
