const mongoose = require('mongoose');

const vendorDataSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  }
}, {
  timestamps: true // adds createdAt and updatedAt
});

module.exports = mongoose.model('VendorData', vendorDataSchema);
