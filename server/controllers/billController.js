const Bill = require('../models/billModel');

// Get all bills
exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.findAll();
    res.json(bills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
};

// Get bill by ID
exports.getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    res.json(bill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch bill' });
  }
};

// Get bills by customer ID
exports.getBillsByCustomerId = async (req, res) => {
  try {
    const bills = await Bill.findByCustomerId(req.params.customerId);
    res.json(bills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
};

// Get unpaid bills
exports.getUnpaidBills = async (req, res) => {
  try {
    const bills = await Bill.findUnpaid();
    res.json(bills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch unpaid bills' });
  }
};

// Get bills by status
exports.getBillsByStatus = async (req, res) => {
  try {
    const bills = await Bill.findByStatus(req.params.status);
    res.json(bills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
};

// Update bill status
exports.updateBillStatus = async (req, res) => {
  try {
    const { Status } = req.body;
    
    if (!Status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const affectedRows = await Bill.updateStatus(req.params.id, Status);
    
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.json({ 
      BillID: req.params.id, 
      Status,
      message: 'Bill status updated successfully' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update bill status' });
  }
};

// Delete bill
exports.deleteBill = async (req, res) => {
  try {
    const affectedRows = await Bill.delete(req.params.id);
    
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete bill' });
  }
};

// Mark overdue bills
exports.markOverdueBills = async (req, res) => {
  try {
    const affectedRows = await Bill.markOverdue();
    res.json({ 
      count: affectedRows,
      message: `${affectedRows} bill(s) marked as overdue` 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to mark overdue bills' });
  }
};
