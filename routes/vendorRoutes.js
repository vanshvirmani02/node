const express = require('express');
const {
  registerVendor,
  loginVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
} = require('../controllers/vendorController');

const router = express.Router();

router.post('/register', registerVendor);
router.post('/login', loginVendor);
router.get('/', getAllVendors);
router.get('/:id', getVendorById);
router.put('/:id', updateVendor);
router.delete('/:id', deleteVendor);

module.exports = router;
