const express = require('express');
const router = express.Router();
const {
  getAllCustomerData,
  getCustomerDataByCustomerId,
  deleteCustomerData,
  addToCart,
  buyCartItems,
  removeFromCart,
  getCartItems

} = require('../controllers/customerDataController');

router.get('/', getAllCustomerData);
router.get('/customer/:customerId', getCustomerDataByCustomerId);
router.delete('/:id', deleteCustomerData);

router.post('/cart', addToCart);
router.post('/cart/buy', buyCartItems);
router.get('/cart/:customerId', getCartItems);
router.delete('/cart/:cartItemId', removeFromCart);

module.exports = router;
