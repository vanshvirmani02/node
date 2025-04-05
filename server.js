const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require("./routes/auth"); // ✅ Ensure correct path
const userRoutes = require("./routes/user");
const vendorRoutes = require('./routes/vendorRoutes');
const vendorDataRoutes = require('./routes/vendorDataRoutes');
const customerDataRoutes = require('./routes/customerDataRoutes');
const customerRoutes = require('./routes/customerRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Mounting routes
app.use("/api/auth", authRoutes); // ✅ Prefixes all auth routes with "/auth"
app.use("/api/users", userRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/vendordata', vendorDataRoutes);
app.use('/api/customerdata', customerDataRoutes);
app.use('/api/customers', customerRoutes)
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
