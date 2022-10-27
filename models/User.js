const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // staffid: { type: Number, required: true, unique: true },
    phonenumber: { type: String, required: true, unique: true },
    lastlogin: { type: String, default: null },
    role: { type: Number, default: 0 },
    // 0 = user
    // 1 = admin
    // 2 = driver (does not user the website)
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
