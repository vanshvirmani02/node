const Customer = require('../models/Customer');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// Register Customer
const registerCustomer = async (req, res) => {
  const { name, userName, password, adminId } = req.body;

  try {
    const existing = await Customer.findOne({ userName });
    if (existing) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const customer = new Customer({ name, userName, password, adminId });
    await customer.save(); // triggers finalPrice update

    res.status(201).json({
      message: 'Customer registered successfully',
      customer: {
        id: customer._id,
        name: customer.name,
        userName: customer.userName,
        adminId: customer.adminId,
        createdAt: customer.createdAt,
        token: generateToken(customer._id)
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login Customer
const loginCustomer = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const customer = await Customer.findOne({ userName });
    if (!customer) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      customer: {
        id: customer._id,
        name: customer.name,
        userName: customer.userName,
        adminId: customer.adminId,
        createdAt: customer.createdAt,
        token: generateToken(customer._id)
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get All Customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().select("-password"); // Exclude password
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { registerCustomer, loginCustomer, getAllCustomers };
