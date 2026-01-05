const Customer = require('../models/customerModel');
const Meter = require('../models/meterModel');
const Bill = require('../models/billModel');
const Payment = require('../models/paymentModel');
const PDFDocument = require('pdfkit');

const formatCurrency = (amt) => {
  return Number(amt || 0).toLocaleString(undefined, { style: 'currency', currency: 'LKR' });
};

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

// Get detailed customer info: meters, bills, payments
exports.getCustomerDetails = async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const meters = await Meter.findByCustomerId(customerId);
    const bills = await Bill.findByCustomerId(customerId);
    const payments = await Payment.findByCustomerId(customerId);

    res.json({ customer, meters, bills, payments });
  } catch (error) {
    console.error('Error in getCustomerDetails:', error);
    res.status(500).json({ error: 'Failed to fetch customer details' });
  }
};

// Generate PDF report for a customer. Query params: month=YYYY-MM (optional), type=payments|monthly (default monthly)
exports.generateCustomerReport = async (req, res) => {
  try {
    const customerId = req.params.id;
    const { month, type } = req.query; // month: YYYY-MM

    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const meters = await Meter.findByCustomerId(customerId);

    let payments = [];
    let bills = [];

    if (type === 'payments') {
      payments = await Payment.findByCustomerId(customerId);
    } else if (month) {
      const [year, mon] = month.split('-').map(Number);
      bills = await Bill.findByCustomerId(customerId);
      payments = await Payment.findByCustomerIdAndMonth(customerId, year, mon);
      // Filter bills to month as well (by bill date)
      bills = bills.filter(b => {
        if (!b.BillDate) return false;
        const d = new Date(b.BillDate);
        return d.getFullYear() === year && (d.getMonth() + 1) === mon;
      });
    } else {
      bills = await Bill.findByCustomerId(customerId);
      payments = await Payment.findByCustomerId(customerId);
    }

    // Create PDF with a cleaner, official layout
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    const filename = `customer_${customerId}_report${month ? '_' + month : ''}.pdf`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    doc.pipe(res);

    // Header block with company info / logo placeholder
    const companyName = 'Utility Management Co.';
    doc.rect(50, 50, 500, 60).fill('#f5f7fa').stroke();
    doc.fillColor('#0f172a').fontSize(20).text(companyName, 60, 60);
    doc.fontSize(10).fillColor('#475569').text('Official Customer Report', 60, 85);
    // logo placeholder (left)
    doc.rect(470, 58, 36, 36).stroke();

    // Customer info box
    const infoTop = 120;
    doc.roundedRect(50, infoTop, 500, 70, 6).stroke();
    doc.fontSize(11).fillColor('#0f172a').text(`Customer: ${customer.FullName}`, 60, infoTop + 8);
    doc.fontSize(10).fillColor('#334155').text(`Phone: ${customer.Phone || '-'}`, 60, infoTop + 26);
    doc.text(`Address: ${customer.Address || '-'}`, 60, infoTop + 42, { width: 420 });

    // Meters list (small)
    let y = infoTop + 90;
    if (meters && meters.length) {
      doc.moveTo(50, y).fontSize(12).fillColor('#0f172a').text('Meters', 50, y);
      y += 18;
      meters.forEach(m => {
        const text = `${m.SerialNumber} — ${m.TypeName || m.UtilityType || '-'}${m.InstallationDate ? ' | Installed: ' + new Date(m.InstallationDate).toLocaleDateString() : ''}`;
        doc.fontSize(10).fillColor('#334155').text(text, 60, y, { width: 480 });
        y += 14;
      });
      y += 8;
    }

    // Table for monthly or payments
    if (month) {
      const [year, mon] = month.split('-').map(Number);
      const monthlyRows = await Bill.findByCustomerIdAndMonth(customerId, year, mon);

      doc.moveDown();
      doc.fontSize(12).fillColor('#0f172a').text(`Monthly Report: ${month}`, 50, y);
      y += 18;

      // table columns
      const tableX = 50;
      const colWidths = [90, 100, 60, 90, 80, 80];
      const headers = ['Meter', 'Type', 'Units', 'Bill Date', 'Paid Date', 'Amount Paid'];

      // header background
      doc.rect(tableX, y, colWidths.reduce((a,b) => a+b, 0), 20).fill('#e6eef8').stroke();
      doc.fillColor('#0f172a').fontSize(10);
      let cx = tableX + 6;
      for (let i=0;i<headers.length;i++) {
        doc.text(headers[i], cx, y + 6, { width: colWidths[i] - 12 });
        cx += colWidths[i];
      }
      y += 24;

      let total = 0;
      monthlyRows.forEach((row, idx) => {
        if (y > 740) { doc.addPage(); y = 60; }
        const meter = row.SerialNumber || '-';
        const typeName = row.Utility || '-';
        const units = row.UnitsConsumed != null ? String(row.UnitsConsumed) : '-';
        const billDate = row.BillDate ? new Date(row.BillDate).toLocaleDateString() : '-';
        const paidDate = row.PaymentDay ? new Date(row.PaymentDay).toLocaleDateString() : '-';
        const amountPaid = row.AmountPaid != null ? Number(row.AmountPaid) : 0;
        total += amountPaid;

        cx = tableX + 6;
        doc.fillColor('#0f172a').fontSize(10).text(meter, cx, y, { width: colWidths[0] - 12 }); cx += colWidths[0];
        doc.text(typeName, cx, y, { width: colWidths[1] - 12 }); cx += colWidths[1];
        doc.text(units, cx, y, { width: colWidths[2] - 12 }); cx += colWidths[2];
        doc.text(billDate, cx, y, { width: colWidths[3] - 12 }); cx += colWidths[3];
        doc.text(paidDate, cx, y, { width: colWidths[4] - 12 }); cx += colWidths[4];
        doc.text(formatCurrency(amountPaid), cx, y, { width: colWidths[5] - 12 });
        y += 18;
      });

      // Total line - render as a single right-aligned value to avoid overlap
      if (y > 740) { doc.addPage(); y = 60; }
      const tableWidth = colWidths.reduce((a,b)=>a+b,0);
      doc.moveTo(tableX, y).lineWidth(1).strokeColor('#e2e8f0').lineTo(tableX + tableWidth, y).stroke();
      y += 6;
      doc.fontSize(11).fillColor('#0f172a').text(`Total: ${formatCurrency(total)}`, tableX, y, { width: tableWidth, align: 'right' });
      y += 30;

    } else if (type === 'payments') {
      // Render payments in a table with Meter and Type columns
      doc.moveDown();
      doc.fontSize(12).fillColor('#0f172a').text('Payments', 50, y);
      y += 18;

      const tableX = 50;
      const colWidths = [120, 120, 90, 80, 80]; // Meter, Type, Paid Date, Amount, Method
      const headers = ['Meter', 'Type', 'Paid Date', 'Amount', 'Method'];

      // header background
      doc.rect(tableX, y, colWidths.reduce((a,b)=>a+b,0), 20).fill('#e6eef8').stroke();
      doc.fillColor('#0f172a').fontSize(10);
      let cx = tableX + 6;
      for (let i=0;i<headers.length;i++) {
        doc.text(headers[i], cx, y + 6, { width: colWidths[i] - 12 });
        cx += colWidths[i];
      }
      y += 24;

      let paymentsTotal = 0;
      payments.forEach(p => {
        if (y > 740) { doc.addPage(); y = 60; }
        const meter = p.SerialNumber || '-';
        const typeName = p.Utility || '-';
        const paidDate = p.PaymentDay ? new Date(p.PaymentDay).toLocaleDateString() : (p.PaymentDate ? new Date(p.PaymentDate).toLocaleDateString() : '-');
        const amount = p.AmountPaid != null ? Number(p.AmountPaid) : 0;
        paymentsTotal += amount;

        cx = tableX + 6;
        doc.fillColor('#0f172a').fontSize(10).text(meter, cx, y, { width: colWidths[0] - 12 }); cx += colWidths[0];
        doc.text(typeName, cx, y, { width: colWidths[1] - 12 }); cx += colWidths[1];
        doc.text(paidDate, cx, y, { width: colWidths[2] - 12 }); cx += colWidths[2];
        doc.text(formatCurrency(amount), cx, y, { width: colWidths[3] - 12 }); cx += colWidths[3];
        doc.text(p.PaymentMethod || '-', cx, y, { width: colWidths[4] - 12 });
        y += 18;
      });

      // Total
      if (y > 740) { doc.addPage(); y = 60; }
      const tableWidth = colWidths.reduce((a,b)=>a+b,0);
      doc.moveTo(tableX, y).lineWidth(1).strokeColor('#e2e8f0').lineTo(tableX + tableWidth, y).stroke();
      y += 6;
      doc.fontSize(11).fillColor('#0f172a').text(`Total: ${formatCurrency(paymentsTotal)}`, tableX, y, { width: tableWidth, align: 'right' });
      y += 30;
    } else {
      doc.moveDown();
      doc.fontSize(12).fillColor('#0f172a').text('Bills', 50, y);
      y += 18;
      bills.forEach(b => {
        if (y > 740) { doc.addPage(); y = 60; }
        doc.fontSize(10).fillColor('#334155').text(`#${b.BillID} — Date: ${b.BillDate ? new Date(b.BillDate).toLocaleDateString() : '-'} — Units: ${b.UnitsConsumed || '-'} — Total: ${formatCurrency(b.TotalAmount)} — Status: ${b.Status}`, 60, y, { width: 480 });
        y += 14;
      });

      y += 8;
      doc.fontSize(12).fillColor('#0f172a').text('Payments', 50, y);
      y += 18;
      payments.forEach(p => {
        if (y > 740) { doc.addPage(); y = 60; }
        doc.fontSize(10).fillColor('#334155').text(`${p.PaymentDay || (p.PaymentDate ? new Date(p.PaymentDate).toLocaleDateString() : '-') } — ${formatCurrency(p.AmountPaid)} — ${p.PaymentMethod || '-'} — Bill #${p.BillID}`, 60, y, { width: 480 });
        y += 14;
      });
    }

    // Footer
    const genDate = new Date().toLocaleString();
    doc.fontSize(9).fillColor('#64748b').text(`Generated: ${genDate}`, 50, 780, { align: 'left' });

    doc.end();
  } catch (error) {
    console.error('Error generating customer report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};
