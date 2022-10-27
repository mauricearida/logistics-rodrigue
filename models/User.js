const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    staffid: { type: Number, required: true, unique: true },
    phonenumber: { type: String, required: true, unique: true },
    lastlogin: { type: Date },
    role: { type: Number, required: true, default: 0 },
    // 0 = admin
    // 1 = user
    // 2 = driver (does not user the website)
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
