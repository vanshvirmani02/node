const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  totalAmount: Number,
  status: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
  subOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubOrder" }],
});

const SubOrderSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: Number,
      price: Number,
    },
  ],
  status: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", OrderSchema);
const SubOrder = mongoose.model("SubOrder", SubOrderSchema);

module.exports = { Order, SubOrder };
