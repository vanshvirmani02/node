const express = require('express');
const router = express.Router();
const { registerAdmin,loginAdmin ,getAllAdmins  } = require('../controllers/adminController');

router.post('/registerAdmin', registerAdmin);
router.post('/loginAdmin', loginAdmin);
router.get("/", getAllAdmins); // <-- Get all admins here
module.exports = router;
