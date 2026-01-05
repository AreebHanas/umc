import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { customerService, paymentService, billService } from '../../services';
import './CustomerDetail.css';

function CustomerDetail() {
  const { id } = useParams();
  const [data, setData] = useState({ customer: null, meters: [], bills: [], payments: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [paying, setPaying] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  useEffect(() => {
    loadDetails();
  }, [id]);

  const loadDetails = async () => {
    setLoading(true);
    try {
      const resp = await customerService.getCustomerDetails(id);
      setData(resp.data);
      setError(null);
      setSuccess(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load customer details');
    } finally {
      setLoading(false);
    }
  };

  const openPaymentModal = (bill) => {
    setSelectedBill(bill);
    setPaymentAmount(bill.TotalAmount ?? '');
    setPaymentMethod('Cash');
    setPaymentModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  const closePaymentModal = () => {
    setPaymentModalOpen(false);
    setSelectedBill(null);
  };

  const submitPayment = async (e) => {
    e.preventDefault();
    if (!selectedBill) return;
    setPaying(true);
    try {
      await paymentService.createPayment({ BillID: selectedBill.BillID, AmountPaid: Number(paymentAmount), PaymentMethod: paymentMethod });
      setSuccess(`Payment recorded for bill #${selectedBill.BillID}`);
      closePaymentModal();
      await loadDetails();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process payment');
    } finally {
      setPaying(false);
    }
  };

  const downloadBillReport = async (billId) => {
    try {
      const resp = await billService.getBillReport(billId);
      const blob = new Blob([resp.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bill_${billId}_report.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to download bill report');
    }
  };

  const downloadReport = async (opts) => {
    try {
      setSuccess('Report download started');
      const resp = await customerService.getCustomerReport(id, opts);
      const blob = new Blob([resp.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = resp.headers['content-disposition']?.split('filename=')[1]?.replace(/"/g, '') || `customer_${id}_report.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to download report');
    }
  };

  if (loading) return <div className="loading">Loading customer details...</div>;

  const { customer, meters, bills, payments } = data;

  return (
    <div className="customer-detail-page">
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="header">
        <div className="header-left">
          <h1>{customer.FullName}</h1>
          <div className="meta">{customer.Address} • {customer.Phone}</div>
        </div>
        <div className="header-actions">
          <div className="month-picker">
            <label style={{marginRight:6}}>Month:</label>
            <input type="month" defaultValue={new Date().toISOString().slice(0,7)} id="reportMonth" />
            <button onClick={() => {
              const m = document.getElementById('reportMonth').value || new Date().toISOString().slice(0,7);
              downloadReport({ month: m });
            }} className="btn-primary">Monthly Report</button>
          </div>
          <button onClick={() => downloadReport({ type: 'payments' })} className="btn-secondary">All Payments</button>
        </div>
      </div>

      <section className="customer-info">
        <h2>Details</h2>
        <p><strong>Phone:</strong> {customer.Phone}</p>
        <p><strong>Address:</strong> {customer.Address}</p>
        <p><strong>Type:</strong> {customer.CustomerType}</p>
      </section>

      <section className="meters">
        <h2>Meters</h2>
        {meters.length === 0 ? <p>No meters</p> : (
          <ul>{meters.map(m => <li key={m.MeterID}>{m.SerialNumber} — {m.TypeName || m.UtilityType}</li>)}</ul>
        )}
      </section>

      <section className="bills">
        <h2>Bills</h2>
        {bills.length === 0 ? <p>No bills</p> : (
          <table>
            <thead>
              <tr><th>BillID</th><th>Date</th><th>Total</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {bills.map(b => (
                <tr key={b.BillID}>
                  <td>#{b.BillID}</td>
                  <td>{b.BillDate ? new Date(b.BillDate).toLocaleDateString() : '-'}</td>
                  <td>{b.TotalAmount}</td>
                  <td>{b.Status}</td>
                  <td>
                    {b.Status !== 'Paid' && <button disabled={paying} className="btn-pay" onClick={() => openPaymentModal(b)}>Mark Paid</button>}
                    {b.Status === 'Paid' && <button className="btn-report" onClick={() => downloadBillReport(b.BillID)}>Report</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="payments">
        <h2>Payments</h2>
        {payments.length === 0 ? <p>No payments</p> : (
          <table>
            <thead>
              <tr><th>PaymentID</th><th>Date</th><th>Amount</th><th>Method</th><th>Bill</th></tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.PaymentID}>
                  <td>#{p.PaymentID}</td>
                  <td>{p.PaymentDay || (p.PaymentDate ? new Date(p.PaymentDate).toLocaleDateString() : '-')}</td>
                  <td>{p.AmountPaid}</td>
                  <td>{p.PaymentMethod}</td>
                  <td>#{p.BillID}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      {paymentModalOpen && selectedBill && (
        <div className="modal-overlay" onClick={closePaymentModal}>
          <div className="modal" role="dialog" onClick={(e) => e.stopPropagation()}>
            <h4>Payment for Bill #{selectedBill.BillID}</h4>
            <form onSubmit={submitPayment}>
              <label>Amount</label>
              <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} min="0" step="0.01" />
              <label>Method</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option>Cash</option>
                <option>Card</option>
                <option>Bank Transfer</option>
              </select>
              <div className="modal-actions">
                <button type="button" className="btn cancel" onClick={closePaymentModal}>Cancel</button>
                <button type="submit" className="btn primary" disabled={paying}>{paying ? 'Processing...' : 'Pay'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerDetail;
