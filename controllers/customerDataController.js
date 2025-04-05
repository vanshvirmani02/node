const CustomerData = require('../models/CustomerData');
const Cart = require('../models/Cart');

// Get all
const getAllCustomerData = async (req, res) => {
  try {
    const data = await CustomerData.find().populate('customerId', 'name userName');
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get by customerId
const getCustomerDataByCustomerId = async (req, res) => {
  const { customerId } = req.params;

  try {
    const data = await CustomerData.find({ customerId });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Optional: delete (not required in most use cases)
const deleteCustomerData = async (req, res) => {
    const { id } = req.params;
  
    try {
      const toDelete = await CustomerData.findById(id);
      if (!toDelete) return res.status(404).json({ message: 'Data not found' });
  
      await CustomerData.findByIdAndDelete(id);
  
      // Recalculate total price
      const remainingData = await CustomerData.find({ customerId: toDelete.customerId });
      const newTotal = remainingData.reduce((sum, item) => sum + (item.price || 0), 0);
      await Customer.findByIdAndUpdate(toDelete.customerId, { totalPrice: newTotal });
  
      res.status(200).json({ message: 'CustomerData deleted and totalPrice updated' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };

  const addToCart = async (req, res) => {
    const { customerId, productId, quantity } = req.body;
  
    try {
      // Check if product exists and has enough stock
      const product = await CustomerData.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      if (product.stock < quantity) {
        return res.status(400).json({ message: 'Not enough stock available' });
      }
  
      // Check if item already in cart
      const existingCartItem = await Cart.findOne({ customerId, productId });
      
      if (existingCartItem) {
        // Update quantity if already in cart
        existingCartItem.quantity += quantity;
        await existingCartItem.save();
      } else {
        // Add new item to cart
        await Cart.create({ customerId, productId, quantity });
      }
  
      res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
  // Buy items in cart
  const buyCartItems = async (req, res) => {
    const { customerId } = req.body;
  
    try {
      // Get all items in cart for this customer
      const cartItems = await Cart.find({ customerId }).populate('productId');
      
      if (cartItems.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }
  
      // Process each item
      for (const item of cartItems) {
        const product = item.productId;
        
        // Check if product still exists and has enough stock
        const currentProduct = await CustomerData.findById(product._id);
        if (!currentProduct) {
          continue; // Skip if product no longer exists
        }
  
        if (currentProduct.stock < item.quantity) {
          continue; // Skip if not enough stock (you might want to handle this differently)
        }
  
        // Update stock
        currentProduct.stock -= item.quantity;
        
        // Delete product if stock reaches 0
        if (currentProduct.stock <= 0) {
          await CustomerData.findByIdAndDelete(product._id);
          
          // Update totalPrice for customer (your existing hook will handle this)
        } else {
          await currentProduct.save();
        }
      }
  
      // Clear the cart after purchase
      await Cart.deleteMany({ customerId });
  
      res.status(200).json({ message: 'Purchase completed successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  const getCartItems = async (req, res) => {
    const { customerId } = req.params;
  
    try {
      const cartItems = await Cart.find({ customerId })
        .populate('productId', 'name price category');
      
      res.status(200).json(cartItems);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
  // Remove from cart
  const removeFromCart = async (req, res) => {
    const { cartItemId } = req.params;
  
    try {
      await Cart.findByIdAndDelete(cartItemId);
      res.status(200).json({ message: 'Item removed from cart' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = {
  getAllCustomerData,
  getCustomerDataByCustomerId,
  deleteCustomerData,
  addToCart,
  buyCartItems,
  getCartItems,
  removeFromCart
};
