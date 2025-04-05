const VendorData = require('../models/VendorData');
const CustomerData = require('../models/CustomerData');
const Customer = require('../models/Customer');
const Vendor = require('../models/Vendor');

// Create
const createVendorData = async (req, res) => {
    const { name, price, stock, vendorId, category } = req.body;
  
    try {
      const vendor = await Vendor.findById(vendorId);
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
      }
  
      // Step 1: Create VendorData
      const vendorData = new VendorData({ name, price, stock, vendorId, category });
      await vendorData.save();
  
      // Step 2: Find all customers under this vendor's admin
      const customers = await Customer.find({ adminId: vendor.adminId });
  
      // Step 3: Create CustomerData for each customer
      const customerDataArray = customers.map(cust => ({
        customerId: cust._id,
        name,
        price,
        stock,
        category
      }));
  
      await CustomerData.insertMany(customerDataArray);
  
      res.status(201).json({
        message: 'VendorData created and copied to CustomerData',
        vendorData
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };

// Get all
const getAllVendorData = async (req, res) => {
  try {
    const data = await VendorData.find().populate('vendorId', 'name username');
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get by vendorId
const getVendorDataByVendorId = async (req, res) => {
  const { vendorId } = req.params;

  try {
    const data = await VendorData.find({ vendorId });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update
const updateVendorData = async (req, res) => {
    const { id } = req.params;
  
    try {
      const updated = await VendorData.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) {
        return res.status(404).json({ message: 'Vendor data not found' });
      }
  
      // Now update CustomerData entries that match
      await CustomerData.updateMany(
        { name: updated.name, category: updated.category },
        {
          $set: {
            name: updated.name,
            price: updated.price,
            stock: updated.stock,
            category: updated.category
          }
        }
      );
  
      res.status(200).json({ message: 'Updated successfully', data: updated });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  

// Delete
const deleteVendorData = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deleted = await VendorData.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Vendor data not found' });
      }
  
      // Delete related CustomerData
      await CustomerData.deleteMany({ name: deleted.name, category: deleted.category });
  
      res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  

module.exports = {
  createVendorData,
  getAllVendorData,
  getVendorDataByVendorId,
  updateVendorData,
  deleteVendorData
};
