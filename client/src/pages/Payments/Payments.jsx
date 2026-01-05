import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPayments,
  createPayment,
  fetchPaymentStats
} from '../../redux/slices/paymentSlice';
import { fetchUnpaidBills } from '../../redux/slices/billSlice';
import './Payments.css';

function Payments() {
  const dispatch = useDispatch();
  const { payments = [], stats, isLoading, error, success } = useSelector(state => state.payments);
  const { unpaidBills = [] } = useSelector(state => state.bills);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentData, setPaymentData] = useState({
    BillID: '',
    AmountPaid: '',
    PaymentMethod: 'Cash',
    ProcessedBy: 1 // TODO: Get from auth
  });

  useEffect(() => {
    dispatch(fetchPayments());
    dispatch(fetchUnpaidBills());
    
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setShowModal(false);
      setPaymentData({
        BillID: '',
        AmountPaid: '',
        PaymentMethod: 'Cash',
        ProcessedBy: 1
      });
      setSelectedBill(null);
      dispatch(fetchUnpaidBills());
      alert('Payment processed successfully! Bill marked as paid.');
    }
  }, [success, dispatch]);
  

  const handlePayBill = (bill) => {
    setSelectedBill(bill);
    setPaymentData({
      ...paymentData,
      BillID: bill.BillID,
      AmountPaid: bill.TotalAmount
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseFloat(paymentData.AmountPaid) <= 0) {
      alert('Payment amount must be greater than 0');
      return;
    }
    dispatch(createPayment(paymentData));
  };

  const getTodayPayments = () => {
    const today = new Date().toDateString();
    return payments.filter(p => new Date(p.PaymentDate).toDateString() === today);
  };

  const getTodayTotal = () => {
    return getTodayPayments().reduce((sum, p) => sum + parseFloat(p.AmountPaid), 0);
  };

  const paymentMethodIcons = {
    Cash: '$',
    Card: 'CARD',
    Online: 'WEB'
  };

  return (
    <div className="payments-page">
      <div className="page-header">
        <div>
          <h1>Payment Processing</h1>
          <p>Process and track customer payments</p>
        </div>
      </div>

      {success && <div className="alert alert-success">Payment processed successfully!</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">$</div>
          <div className="stat-info">
            <h3>{payments.length}</h3>
            <p>Total Payments</p>
          </div>
        </div>
        <div className="stat-card stat-today">
          <div className="stat-icon">Today</div>
          <div className="stat-info">
            <h3>{getTodayPayments().length}</h3>
            <p>Today's Payments</p>
            <small>LKR {getTodayTotal().toFixed(2)}</small>
          </div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{unpaidBills.length}</h3>
            <p>Pending Bills</p>
          </div>
        </div>
      </div>

      {unpaidBills.length > 0 && (
        <div className="unpaid-bills-section">
          <h2>Bills Awaiting Payment</h2>
          <div className="bills-grid">
            {unpaidBills.map(bill => (
              <div key={bill.BillID} className="bill-payment-card">
                <div className="bill-card-header">
                  <span className="bill-id">Bill #{bill.BillID}</span>
                  <span className="bill-amount">LKR {parseFloat(bill.TotalAmount).toFixed(2)}</span>
                </div>
                <div className="bill-card-body">
                  <div className="info-row">
                    <span>Customer:</span>
                    <strong>{bill.FullName}</strong>
                  </div>
                  <div className="info-row">
                    <span>Due Date:</span>
                    <strong>{new Date(bill.DueDate).toLocaleDateString()}</strong>
                  </div>
                  <div className="info-row">
                    <span>Units:</span>
                    <strong>{bill.UnitsConsumed}</strong>
                  </div>
                  {new Date(bill.DueDate) < new Date() && (
                    <div className="overdue-warning">OVERDUE</div>
                  )}
                </div>
                <button className="btn-pay" onClick={() => handlePayBill(bill)}>
                  Process Payment
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="payments-history">
        <h2>Payment History</h2>
        {isLoading ? (
          <div className="loading">Loading payments...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Bill ID</th>
                  <th>Date & Time</th>
                  <th>Amount (LKR)</th>
                  <th>Method</th>
                  <th>Processed By</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">No payments found</td>
                  </tr>
                ) : (
                  payments.slice().reverse().map(payment => (
                    <tr key={payment.PaymentID}>
                      <td className="payment-id">#{payment.PaymentID}</td>
                      <td className="bill-reference">Bill #{payment.BillID}</td>
                      <td>{new Date(payment.PaymentDate).toLocaleString()}</td>
                      <td className="amount-cell">
                        LKR {parseFloat(payment.AmountPaid).toFixed(2)}
                      </td>
                      <td>
                        <span className="payment-method">
                          {paymentMethodIcons[payment.PaymentMethod]} {payment.PaymentMethod}
                        </span>
                      </td>
                      <td>User #{payment.ProcessedBy}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && selectedBill && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Process Payment</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div className="bill-summary">
              <h3>Bill Summary</h3>
              <div className="summary-grid">
                <div>
                  <span>Bill ID:</span>
                  <strong>#{selectedBill.BillID}</strong>
                </div>
                <div>
                  <span>Customer:</span>
                  <strong>{selectedBill.FullName}</strong>
                </div>
                <div>
                  <span>Units:</span>
                  <strong>{selectedBill.UnitsConsumed}</strong>
                </div>
                <div>
                  <span>Due Date:</span>
                  <strong>{new Date(selectedBill.DueDate).toLocaleDateString()}</strong>
                </div>
              </div>
              <div className="total-amount">
                <span>Total Amount:</span>
                <strong>LKR {parseFloat(selectedBill.TotalAmount).toFixed(2)}</strong>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Amount to Pay *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={paymentData.AmountPaid}
                  onChange={(e) => setPaymentData({...paymentData, AmountPaid: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Payment Method *</label>
                <div className="payment-methods">
                  <label className="method-option">
                    <input
                      type="radio"
                      name="method"
                      value="Cash"
                      checked={paymentData.PaymentMethod === 'Cash'}
                      onChange={(e) => setPaymentData({...paymentData, PaymentMethod: e.target.value})}
                    />
                    <span>Cash</span>
                  </label>
                  <label className="method-option">
                    <input
                      type="radio"
                      name="method"
                      value="Card"
                      checked={paymentData.PaymentMethod === 'Card'}
                      onChange={(e) => setPaymentData({...paymentData, PaymentMethod: e.target.value})}
                    />
                    <span>Card</span>
                  </label>
                  <label className="method-option">
                    <input
                      type="radio"
                      name="method"
                      value="Online"
                      checked={paymentData.PaymentMethod === 'Online'}
                      onChange={(e) => setPaymentData({...paymentData, PaymentMethod: e.target.value})}
                    />
                    <span>Online</span>
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payments;
