const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = new Admin({ name, email, password });
    await admin.save();

    res.status(201).json({
      message: 'Admin registered successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        token: generateToken(admin._id),
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      admin: {
        id: admin._id, // This is your adminId
        name: admin.name,
        email: admin.email,
        token: generateToken(admin._id),
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
const getAllAdmins = async (req, res) => {
    try {
      const admins = await Admin.find().select("-password"); // Exclude password
      res.status(200).json(admins);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
module.exports = {
  registerAdmin,
  loginAdmin,
  getAllAdmins,
};
