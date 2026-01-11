const Bill = require('../models/billModel');
const Payment = require('../models/paymentModel');
const PDFDocument = require('pdfkit');

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

// Pay a bill: create a payment and update bill status (uses Payment.create which updates bill)
exports.payBill = async (req, res) => {
  try {
    const billId = req.params.id;
    const { AmountPaid, PaymentMethod, ProcessedBy } = req.body;

    if (!AmountPaid || !PaymentMethod) {
      return res.status(400).json({ error: 'AmountPaid and PaymentMethod are required' });
    }

    const paymentId = await Payment.create({ BillID: billId, AmountPaid, PaymentMethod, ProcessedBy });

    res.status(201).json({ PaymentID: paymentId, BillID: billId, AmountPaid, PaymentMethod, message: 'Payment recorded and bill marked as paid' });
  } catch (error) {
    console.error('Error in payBill:', error);
    res.status(500).json({ error: 'Failed to process payment for bill' });
  }
};

// Generate PDF report for a single bill
exports.generateBillReport = async (req, res) => {
  try {
    const billId = req.params.id;
    const bill = await Bill.findById(billId);
    if (!bill) return res.status(404).json({ error: 'Bill not found' });

    const payments = await Payment.findByBillId(billId);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    const filename = `bill_${billId}_report.pdf`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    doc.pipe(res);

    // Company header with logo
    doc.rect(50, 50, 500, 80).fill('#1976d2').stroke();
    
    // Draw logo (simplified meter icon)
    const logoX = 70;
    const logoY = 65;
    doc.circle(logoX + 25, logoY + 25, 24).fill('#42a5f5');
    doc.polygon([logoX + 25, logoY + 10], [logoX + 30, logoY + 20], [logoX + 20, logoY + 20]).fill('white');
    doc.rect(logoX + 15, logoY + 25, 20, 15).fill('white');
    doc.rect(logoX + 17, logoY + 28, 16, 6).fill('#1976d2');
    
    // Company name and title
    doc.fillColor('white').fontSize(20).text('Utility Management System', 130, 68);
    doc.fontSize(11).text('Official Bill Report', 130, 92);
    doc.fontSize(9).text(`Generated: ${new Date().toLocaleDateString()}`, 130, 108);
    
    doc.fillColor('#0f172a').fontSize(12).text(`Bill #${bill.BillID}`, 460, 68);

    let y = 150;
    doc.roundedRect(50, y - 10, 500, 80, 6).stroke();
    doc.fontSize(11).fillColor('#0f172a').text(`Customer: ${bill.FullName || '-'}`, 60, y);
    doc.fontSize(10).fillColor('#334155').text(`Address: ${bill.Address || '-'}`, 60, y + 18, { width: 420 });
    doc.fontSize(10).text(`Meter: ${bill.SerialNumber || '-'} (${bill.Utility || '-'})`, 60, y + 36);
    y += 100;

    // Bill summary table
    doc.fontSize(12).fillColor('#0f172a').text('Summary', 50, y);
    y += 18;
    doc.fontSize(10).fillColor('#334155').text(`Bill Date: ${bill.BillDate ? new Date(bill.BillDate).toLocaleDateString() : '-'}`, 60, y);
    doc.fontSize(10).text(`Units: ${bill.UnitsConsumed || '-'}`, 240, y);
    doc.fontSize(10).text(`Total: ${Number(bill.TotalAmount || 0).toLocaleString(undefined, { style: 'currency', currency: 'LKR' })}`, 420, y, { align: 'right' });
    y += 24;

    // Payments section
    doc.fontSize(12).fillColor('#0f172a').text('Payments', 50, y);
    y += 18;
    if (!payments || payments.length === 0) {
      doc.fontSize(10).fillColor('#334155').text('No payments recorded for this bill', 60, y);
    } else {
      payments.forEach(p => {
        if (y > 740) { doc.addPage(); y = 60; }
        doc.fontSize(10).fillColor('#334155').text(`${p.PaymentDate ? new Date(p.PaymentDate).toLocaleDateString() : '-'} — ${Number(p.AmountPaid).toLocaleString(undefined, { style: 'currency', currency: 'LKR' })} — ${p.PaymentMethod}`, 60, y, { width: 420 });
        y += 14;
      });
    }

    // Footer
    const genDate = new Date().toLocaleString();
    doc.fontSize(9).fillColor('#64748b').text(`Generated: ${genDate}`, 50, 780, { align: 'left' });

    doc.end();
  } catch (error) {
    console.error('Error generating bill report:', error);
    res.status(500).json({ error: 'Failed to generate bill report' });
  }
};
