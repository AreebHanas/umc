const Customer = require('../models/customerModel');

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

// Get customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
};

// Create new customer
exports.createCustomer = async (req, res) => {
  try {
    const { FullName, Address, Phone, CustomerType } = req.body;
    
    if (!FullName || !Address || !CustomerType) {
      return res.status(400).json({ error: 'FullName, Address, and CustomerType are required' });
    }

    const customerId = await Customer.create({ FullName, Address, Phone, CustomerType });
    res.status(201).json({ 
      CustomerID: customerId, 
      FullName, 
      Address, 
      Phone, 
      CustomerType,
      message: 'Customer created successfully' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

// Update customer
exports.updateCustomer = async (req, res) => {
  try {
    const { FullName, Address, Phone, CustomerType } = req.body;
    
    if (!FullName || !Address || !CustomerType) {
      return res.status(400).json({ error: 'FullName, Address, and CustomerType are required' });
    }

    const affectedRows = await Customer.update(req.params.id, { FullName, Address, Phone, CustomerType });
    
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ 
      CustomerID: req.params.id, 
      FullName, 
      Address, 
      Phone, 
      CustomerType,
      message: 'Customer updated successfully' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
};

// Delete customer
exports.deleteCustomer = async (req, res) => {
  try {
    const affectedRows = await Customer.delete(req.params.id);
    
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
};

// Get customers by type
exports.getCustomersByType = async (req, res) => {
  try {
    const customers = await Customer.findByType(req.params.type);
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

// Search customers
exports.searchCustomers = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.status(400).json({ error: 'Search term is required' });
    }
    const customers = await Customer.search(search);
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to search customers' });
  }
};
