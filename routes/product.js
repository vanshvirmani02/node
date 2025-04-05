const express = require("express");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth");
const checkRole = require("../middleware/role");

const router = express.Router();

// Create Product (Vendor Only)
router.post("/", authMiddleware, checkRole(["vendor"]), async (req, res) => {
  const { name, price, stock, category } = req.body;
  const product = new Product({ ...req.body, vendorId: req.user.id });

  await product.save();
  res.status(201).json({ msg: "Product added" });
});

// Get All Products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Update Product (Vendor Only)
router.put("/:id", authMiddleware, checkRole(["vendor"]), async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, vendorId: req.user.id },
    req.body,
    { new: true }
  );

  if (!product) return res.status(404).json({ msg: "Product not found" });
  res.json(product);
});

// Delete Product (Vendor Only)
router.delete("/:id", authMiddleware, checkRole(["vendor"]), async (req, res) => {
  const product = await Product.findOneAndDelete({ _id: req.params.id, vendorId: req.user.id });

  if (!product) return res.status(404).json({ msg: "Product not found" });
  res.json({ msg: "Product deleted" });
});

module.exports = router;
