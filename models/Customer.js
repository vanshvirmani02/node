const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./Admin'); // Import Admin model to update finalPrice

const customerSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  totalPrice: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hash password if modified
customerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Function to update Admin.finalPrice
async function updateFinalPrice(adminId) {
  const customers = await mongoose.model('Customer').find({ adminId });
  const total = customers.reduce((sum, c) => sum + c.totalPrice, 0);
  await Admin.findByIdAndUpdate(adminId, { finalPrice: total });
}

// Trigger after save (create/update)
customerSchema.post('save', async function () {
  await updateFinalPrice(this.adminId);
});

// Trigger after findOneAndUpdate
customerSchema.post('findOneAndUpdate', async function (doc) {
  if (doc) {
    await updateFinalPrice(doc.adminId);
  }
});

// Trigger after findOneAndDelete
customerSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await updateFinalPrice(doc.adminId);
  }
});

module.exports = mongoose.model('Customer', customerSchema);
