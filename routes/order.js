const express = require("express");
const { Order, SubOrder } = require("../models/Order");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Place Order (Customer)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items } = req.body; // Items = [{productId, quantity}, ...]
    if (!items || items.length === 0) return res.status(400).json({ msg: "No items in order" });

    const groupedByVendor = {}; // To split orders per vendor
    let totalAmount = 0;

    // Check stock and prepare vendor-wise order data
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ msg: `Insufficient stock for ${product.name}` });
      }

      product.stock -= item.quantity; // Deduct stock
      await product.save();

      if (!groupedByVendor[product.vendorId]) {
        groupedByVendor[product.vendorId] = [];
      }

      groupedByVendor[product.vendorId].push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price * item.quantity,
      });

      totalAmount += product.price * item.quantity;
    }

    // Create Master Order
    const order = new Order({ customerId: req.user.id, totalAmount });
    await order.save();

    // Create Sub Orders per Vendor
    const subOrders = await Promise.all(
      Object.keys(groupedByVendor).map(async (vendorId) => {
        const subOrder = new SubOrder({
          orderId: order._id,
          vendorId,
          items: groupedByVendor[vendorId],
        });
        await subOrder.save();
        return subOrder._id;
      })
    );

    // Update Order with SubOrder IDs
    order.subOrders = subOrders;
    await order.save();

    res.status(201).json({ msg: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Customer Orders
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id }).populate("subOrders");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
