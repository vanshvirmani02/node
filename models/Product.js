const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", ProductSchema);
