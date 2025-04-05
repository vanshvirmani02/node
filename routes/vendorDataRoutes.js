const express = require('express');
const router = express.Router();
const {
  createVendorData,
  getAllVendorData,
  getVendorDataByVendorId,
  updateVendorData,
  deleteVendorData
} = require('../controllers/vendorDataController');

router.post('/', createVendorData); // Create
router.get('/', getAllVendorData); // Get all
router.get('/vendor/:vendorId', getVendorDataByVendorId); // Get by vendor
router.put('/:id', updateVendorData); // Update
router.delete('/:id', deleteVendorData); // Delete

module.exports = router;
