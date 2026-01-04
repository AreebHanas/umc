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
  const { bills = [], unpaidBills = [], isLoading, error } =
    useSelector(state => state.bills);

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

  // ✅ FIX: Centralized customer name resolver
  const getCustomerName = (bill) => {
    return (
      bill.CustomerName ||
      bill.customer_name ||
      bill.customer?.name ||
      bill.Customer?.Name ||
      'N/A'
    );
  };

  const getTotalAmount = (list) =>
    list.reduce((sum, bill) => sum + Number(bill.TotalAmount || 0), 0);

  const paidBills = bills.filter(b => b.Status === 'Paid');
  const overdueBills = bills.filter(b => b.Status === 'Overdue');

  const chartData = {
    labels: bills.slice(0, 10).reverse().map(b => `Bill #${b.BillID}`),
    datasets: [
      {
        label: 'Bill Amount (LKR)',
        data: bills.slice(0, 10).reverse().map(b => Number(b.TotalAmount)),
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Recent Bill Amounts' }
    },
    scales: { y: { beginAtZero: true } }
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
          <h3>{bills.length}</h3>
          <p>Total Bills</p>
        </div>

        <div className="stat-card stat-unpaid">
          <h3>{unpaidBills.length}</h3>
          <p>Unpaid Bills</p>
          <small>LKR {getTotalAmount(unpaidBills).toFixed(2)}</small>
        </div>

        <div className="stat-card stat-paid">
          <h3>{paidBills.length}</h3>
          <p>Paid Bills</p>
          <small>LKR {getTotalAmount(paidBills).toFixed(2)}</small>
        </div>

        <div className="stat-card stat-overdue">
          <h3>{overdueBills.length}</h3>
          <p>Overdue Bills</p>
          <small>LKR {getTotalAmount(overdueBills).toFixed(2)}</small>
        </div>
      </div>

      <div className="controls-bar">
        <div className="filter-buttons">
          {['All', 'Unpaid', 'Paid', 'Overdue'].map(status => (
            <button
              key={status}
              className={filterStatus === status ? 'active' : ''}
              onClick={() => handleStatusFilter(status)}
            >
              {status}
            </button>
          ))}
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
                <th>Units</th>
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
                  const isOverdue =
                    new Date(bill.DueDate) < new Date() &&
                    bill.Status === 'Unpaid';

                  return (
                    <tr key={bill.BillID} className={isOverdue ? 'overdue-row' : ''}>
                      <td>#{bill.BillID}</td>
                      <td>{bill.FullName || 'N/A'}</td>
                      <td>{new Date(bill.BillDate).toLocaleDateString()}</td>
                      <td>{bill.UnitsConsumed}</td>
                      <td>LKR {Number(bill.TotalAmount).toFixed(2)}</td>
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
    </div>
  );
}

export default Bills;
