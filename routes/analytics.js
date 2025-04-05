const express = require("express");
const { Order, SubOrder } = require("../models/Order");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth");
const checkRole = require("../middleware/role");

const router = express.Router();

// 📈 Admin: Revenue Per Vendor (Past 30 Days)
router.get("/admin/revenue", authMiddleware, checkRole(["admin"]), async (req, res) => {
  try {
    const past30Days = new Date();
    past30Days.setDate(past30Days.getDate() - 30);

    const revenue = await SubOrder.aggregate([
      { $match: { createdAt: { $gte: past30Days } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$vendorId",
          totalRevenue: { $sum: "$items.price" },
        },
      },
    ]);

    res.json(revenue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Top 5 Selling Products
router.get("/admin/top-products", authMiddleware, checkRole(["admin"]), async (req, res) => {
  try {
    const topProducts = await SubOrder.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
    ]);

    res.json(topProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📊 Admin: Average Order Value (AOV)
router.get("/admin/average-order-value", authMiddleware, checkRole(["admin"]), async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const avgOrderValue = totalOrders > 0 ? totalRevenue[0].totalRevenue / totalOrders : 0;

    res.json({ averageOrderValue: avgOrderValue.toFixed(2) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📉 Vendor: Low Stock Items
router.get("/vendor/low-stock", authMiddleware, checkRole(["vendor"]), async (req, res) => {
  try {
    const lowStockProducts = await Product.find({
      vendorId: req.user.id,
      stock: { $lte: 5 }, // Items with stock <= 5
    }).select("name stock");

    res.json(lowStockProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📈 Vendor: Daily Sales (Last 7 Days)
router.get("/vendor/daily-sales", authMiddleware, checkRole(["vendor"]), async (req, res) => {
  try {
    const past7Days = new Date();
    past7Days.setDate(past7Days.getDate() - 7);

    const sales = await SubOrder.aggregate([
      { $match: { vendorId: req.user.id, createdAt: { $gte: past7Days } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$items.price" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
