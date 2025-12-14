import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBills,
  fetchUnpaidBills,
  fetchBillsByStatus,
  markOverdueBills
} from '../../redux/slices/billSlice';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './Bills.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Bills() {
  const dispatch = useDispatch();
  const { bills = [], unpaidBills = [], isLoading, error } = useSelector(state => state.bills);
  
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewMode, setViewMode] = useState('table');

  useEffect(() => {
    dispatch(fetchBills());
    dispatch(fetchUnpaidBills());
  }, [dispatch]);

  const handleMarkOverdue = () => {
    if (window.confirm('Mark all bills past due date as overdue?')) {
      dispatch(markOverdueBills());
    }
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    if (status === 'All') {
      dispatch(fetchBills());
    } else {
      dispatch(fetchBillsByStatus(status));
    }
  };

  const getTotalAmount = (billsList) => {
    return billsList.reduce((sum, bill) => sum + parseFloat(bill.TotalAmount || 0), 0);
  };

  const paidBills = bills.filter(b => b.Status === 'Paid');
  const overdueBills = bills.filter(b => b.Status === 'Overdue');

  // Chart data
  const chartData = {
    labels: bills.slice(0, 10).reverse().map(b => `Bill #${b.BillID}`),
    datasets: [
      {
        label: 'Bill Amount (LKR)',
        data: bills.slice(0, 10).reverse().map(b => parseFloat(b.TotalAmount)),
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Recent Bill Amounts'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="bills-page">
      <div className="page-header">
        <div>
          <h1>Bills Management</h1>
          <p>Track and manage utility bills</p>
        </div>
        <button className="btn-warning" onClick={handleMarkOverdue}>
          Mark Overdue Bills
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">Total</div>
          <div className="stat-info">
            <h3>{bills.length}</h3>
            <p>Total Bills</p>
          </div>
        </div>
        <div className="stat-card stat-unpaid">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{unpaidBills.length}</h3>
            <p>Unpaid Bills</p>
            <small>LKR {getTotalAmount(unpaidBills).toFixed(2)}</small>
          </div>
        </div>
        <div className="stat-card stat-paid">
          <div className="stat-icon">Paid</div>
          <div className="stat-info">
            <h3>{paidBills.length}</h3>
            <p>Paid Bills</p>
            <small>LKR {getTotalAmount(paidBills).toFixed(2)}</small>
          </div>
        </div>
        <div className="stat-card stat-overdue">
          <div className="stat-icon">Overdue</div>
          <div className="stat-info">
            <h3>{overdueBills.length}</h3>
            <p>Overdue Bills</p>
            <small>LKR {getTotalAmount(overdueBills).toFixed(2)}</small>
          </div>
        </div>
      </div>

      <div className="controls-bar">
        <div className="filter-buttons">
          <button 
            className={filterStatus === 'All' ? 'active' : ''} 
            onClick={() => handleStatusFilter('All')}
          >
            All Bills
          </button>
          <button 
            className={filterStatus === 'Unpaid' ? 'active' : ''} 
            onClick={() => handleStatusFilter('Unpaid')}
          >
            Unpaid
          </button>
          <button 
            className={filterStatus === 'Paid' ? 'active' : ''} 
            onClick={() => handleStatusFilter('Paid')}
          >
            Paid
          </button>
          <button 
            className={filterStatus === 'Overdue' ? 'active' : ''} 
            onClick={() => handleStatusFilter('Overdue')}
          >
            Overdue
          </button>
        </div>
        <div className="view-toggle">
          <button 
            className={viewMode === 'table' ? 'active' : ''}
            onClick={() => setViewMode('table')}
          >
            Table
          </button>
          <button 
            className={viewMode === 'chart' ? 'active' : ''}
            onClick={() => setViewMode('chart')}
          >
            Chart
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">Loading bills...</div>
      ) : viewMode === 'table' ? (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bill ID</th>
                <th>Customer</th>
                <th>Bill Date</th>
                <th>Units Consumed</th>
                <th>Amount (LKR)</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bills.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">No bills found</td>
                </tr>
              ) : (
                bills.slice().reverse().map(bill => {
                  const isOverdue = new Date(bill.DueDate) < new Date() && bill.Status === 'Unpaid';
                  return (
                    <tr key={bill.BillID} className={isOverdue ? 'overdue-row' : ''}>
                      <td className="bill-id">#{bill.BillID}</td>
                      <td>{bill.CustomerName || 'Unknown'}</td>
                      <td>{new Date(bill.BillDate).toLocaleDateString()}</td>
                      <td className="units-cell">{bill.UnitsConsumed}</td>
                      <td className="amount-cell">
                        LKR {parseFloat(bill.TotalAmount).toFixed(2)}
                      </td>
                      <td>
                        {new Date(bill.DueDate).toLocaleDateString()}
                        {isOverdue && <span className="overdue-badge">OVERDUE</span>}
                      </td>
                      <td>
                        <span className={`status-badge status-${bill.Status.toLowerCase()}`}>
                          {bill.Status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}

      {unpaidBills.length > 0 && (
        <div className="unpaid-section">
          <h2>Unpaid Bills Summary</h2>
          <div className="unpaid-grid">
            {unpaidBills.slice(0, 6).map(bill => (
              <div key={bill.BillID} className="unpaid-card">
                <div className="unpaid-header">
                  <span className="bill-number">Bill #{bill.BillID}</span>
                  <span className="bill-amount">LKR {parseFloat(bill.TotalAmount).toFixed(2)}</span>
                </div>
                <div className="unpaid-body">
                  <p><strong>{bill.CustomerName}</strong></p>
                  <p>Due: {new Date(bill.DueDate).toLocaleDateString()}</p>
                  <p>Units: {bill.UnitsConsumed}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Bills;
