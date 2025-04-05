const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "vendor", "admin"], required: true },
});

module.exports = mongoose.model("User", UserSchema);
