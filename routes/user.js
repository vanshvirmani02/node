const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// ✅ Get all users (Only Admins)
router.get("/user", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get a single user by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update User (Admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ msg: "Unauthorized access" });

    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ msg: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete User (Admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ msg: "Unauthorized access" });

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
