const express = require('express');
const router = express.Router();
const { registerCustomer, loginCustomer , getAllCustomers} = require('../controllers/customerController');

router.post('/registerCustomer', registerCustomer);
router.post('/loginCustomer', loginCustomer);
router.get("/", getAllCustomers); // <-- Get all admins here

module.exports = router;
