const Vendor = require('../models/Vendor');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// Vendor Registration
const registerVendor = async (req, res) => {
  const { name, username, password, adminId } = req.body;

  try {
    const existing = await Vendor.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const adminExists = await Admin.findById(adminId);
    if (!adminExists) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const vendor = new Vendor({ name, username, password, adminId });
    await vendor.save();

    res.status(201).json({
      message: 'Vendor registered successfully',
      vendor: {
        id: vendor._id,
        name: vendor.name,
        username: vendor.username,
        adminId: vendor.adminId,
        createdAt: vendor.createdAt,
        token: generateToken(vendor._id)
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Vendor Login
const loginVendor = async (req, res) => {
  const { username, password } = req.body;

  try {
    const vendor = await Vendor.findOne({ username });
    if (!vendor) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      vendor: {
        id: vendor._id,
        name: vendor.name,
        username: vendor.username,
        adminId: vendor.adminId,
        createdAt: vendor.createdAt,
        token: generateToken(vendor._id)
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Get All Vendors
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().select('-password');
    res.status(200).json(vendors);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Get Vendor by ID
const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).select('-password');
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.status(200).json(vendor);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Update Vendor
const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select('-password');

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.status(200).json({ message: 'Vendor updated', vendor });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Delete Vendor
const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.status(200).json({ message: 'Vendor deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  registerVendor,
  loginVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
};
