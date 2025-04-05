const mongoose = require('mongoose');
const Customer = require('./Customer');

const customerDataSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  name: String,
  price: Number,
  stock: Number,
  category: String
}, {
  timestamps: true
});

// Recalculate totalPrice after a single document is saved
customerDataSchema.post('save', async function (doc) {
  try {
    const allData = await mongoose.model('CustomerData').find({ customerId: doc.customerId });
    const total = allData.reduce((sum, item) => sum + (item.price * (item.stock || 0)), 0);

    await Customer.findByIdAndUpdate(doc.customerId, { totalPrice: total });
  } catch (err) {
    console.error('Error updating totalPrice after save:', err.message);
  }
});

// Recalculate totalPrice after multiple documents are inserted
customerDataSchema.post('insertMany', async function (docs) {
  try {
    if (!docs.length) return;

    // Assuming all docs belong to the same customerId (adjust if not)
    const customerId = docs[0].customerId;

    const allData = await mongoose.model('CustomerData').find({ customerId });
    const total = allData.reduce((sum, item) => sum + (item.price * (item.stock || 0)), 0);

    await Customer.findByIdAndUpdate(customerId, { totalPrice: total });
  } catch (err) {
    console.error('Error updating totalPrice after insertMany:', err.message);
  }
});

module.exports = mongoose.model('CustomerData', customerDataSchema);