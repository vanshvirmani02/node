// models/Cart.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomerData',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cart', cartItemSchema);