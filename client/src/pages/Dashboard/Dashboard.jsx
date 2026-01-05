import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { hasPermission } from '../../utils/permissions';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { fetchCustomers } from '../../redux/slices/customerSlice';
import { fetchMeters } from '../../redux/slices/meterSlice';
import { fetchReadings } from '../../redux/slices/readingSlice';
import { fetchUnpaidBills } from '../../redux/slices/billSlice';
import { fetchPayments } from '../../redux/slices/paymentSlice';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { customers = [] } = useSelector(state => state.customers);
  const { meters = [] } = useSelector(state => state.meters);
  const { readings = [] } = useSelector(state => state.readings);
  const { unpaidBills = [] } = useSelector(state => state.bills);
  const { payments = [] } = useSelector(state => state.payments);

  // Check permissions for each data type
  const canViewCustomers = hasPermission(user?.Role, 'VIEW_CUSTOMERS');
  const canViewMeters = hasPermission(user?.Role, 'VIEW_METERS');
  const canViewReadings = hasPermission(user?.Role, 'VIEW_READINGS');
  const canViewBills = hasPermission(user?.Role, 'VIEW_BILLS');
  const canViewPayments = hasPermission(user?.Role, 'VIEW_PAYMENTS');

  useEffect(() => {
    if (canViewCustomers) dispatch(fetchCustomers());
    if (canViewMeters) dispatch(fetchMeters());
    if (canViewReadings) dispatch(fetchReadings());
    if (canViewBills) dispatch(fetchUnpaidBills());
    if (canViewPayments) dispatch(fetchPayments());
  }, [dispatch, canViewCustomers, canViewMeters, canViewReadings, canViewBills, canViewPayments]);

  // Calculate stats
  const activeMeters = meters.filter(m => m.Status === 'Active').length;
  const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.AmountPaid), 0);
  const pendingAmount = unpaidBills.reduce((sum, b) => sum + parseFloat(b.TotalAmount), 0);
  const recentReadings = readings.slice(-7);

  // Customer type distribution
  const customerTypes = customers.reduce((acc, c) => {
    acc[c.CustomerType] = (acc[c.CustomerType] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(customerTypes),
    datasets: [{
      data: Object.values(customerTypes),
      backgroundColor: ['#4caf50', '#2196f3', '#ff9800'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  // Monthly consumption trend
  const consumptionByMonth = readings.reduce((acc, r) => {
    const month = new Date(r.ReadingDate).toLocaleDateString('en-US', { month: 'short' });
    acc[month] = (acc[month] || 0) + r.UnitsConsumed;
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(consumptionByMonth),
    datasets: [{
      label: 'Units Consumed',
      data: Object.values(consumptionByMonth),
      backgroundColor: 'rgba(33, 150, 243, 0.7)',
      borderColor: '#2196f3',
      borderWidth: 2
    }]
  };

  // Revenue trend (last 7 days)
  const revenueByDay = payments.slice(-7).map(p => ({
    date: new Date(p.PaymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    amount: parseFloat(p.AmountPaid)
  }));

  const lineData = {
    labels: revenueByDay.map(d => d.date),
    datasets: [{
      label: 'Revenue (LKR)',
      data: revenueByDay.map(d => d.amount),
      borderColor: '#4caf50',
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 5,
      pointBackgroundColor: '#4caf50'
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of utility management system</p>
        </div>
      </div>

      <div className="quick-stats">
        {canViewCustomers && (
          <div className="stat-widget stat-customers">
            <div className="stat-icon">Customers</div>
            <div className="stat-details">
              <h3>{customers.length}</h3>
              <p>Total Customers</p>
              <Link to="/customers" className="stat-link">View all →</Link>
            </div>
          </div>
        )}

        {canViewMeters && (
          <div className="stat-widget stat-meters">
            <div className="stat-icon">Meters</div>
            <div className="stat-details">
              <h3>{activeMeters}</h3>
              <p>Active Meters</p>
              <small>{meters.length} total</small>
              <Link to="/meters" className="stat-link">Manage →</Link>
            </div>
          </div>
        )}

        {canViewPayments && (
          <div className="stat-widget stat-revenue">
            <div className="stat-icon">Revenue</div>
            <div className="stat-details">
              <h3>LKR {totalRevenue.toFixed(2)}</h3>
              <p>Total Revenue</p>
              <small>{payments.length} payments</small>
              <Link to="/payments" className="stat-link">View →</Link>
            </div>
          </div>
        )}

        {canViewBills && (
          <div className="stat-widget stat-pending">
            <div className="stat-icon">Pending</div>
            <div className="stat-details">
              <h3>LKR {pendingAmount.toFixed(2)}</h3>
              <p>Pending Bills</p>
              <small>{unpaidBills.length} unpaid</small>
              <Link to="/bills" className="stat-link">View →</Link>
            </div>
          </div>
        )}
      </div>

      <div className="dashboard-grid">
        {canViewCustomers && (
          <div className="chart-card">
            <h3>Customer Distribution</h3>
            <div className="chart-wrapper">
              {customers.length > 0 ? (
                <Pie data={pieData} options={chartOptions} />
              ) : (
                <div className="no-data">No customer data available</div>
              )}
            </div>
          </div>
        )}

        {canViewReadings && (
          <div className="chart-card">
            <h3>Monthly Consumption</h3>
            <div className="chart-wrapper">
              {readings.length > 0 ? (
                <Bar data={barData} options={chartOptions} />
              ) : (
                <div className="no-data">No consumption data available</div>
              )}
            </div>
          </div>
        )}

        {canViewPayments && (
          <div className="chart-card chart-wide">
            <h3>Revenue Trend (Last 7 Days)</h3>
            <div className="chart-wrapper">
              {payments.length > 0 ? (
                <Line data={lineData} options={chartOptions} />
              ) : (
                <div className="no-data">No revenue data available</div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="activity-section">
        {canViewReadings && (
          <div className="activity-card">
            <h3>Recent Readings</h3>
            <div className="activity-list">
              {recentReadings.length === 0 ? (
                <div className="no-activity">No recent readings</div>
              ) : (
                recentReadings.slice(-5).reverse().map(reading => (
                  <div key={reading.ReadingID} className="activity-item">
                    <div className="activity-icon">R</div>
                    <div className="activity-info">
                      <strong>M-{String(reading.MeterID).padStart(4, '0')}</strong>
                      <p>{reading.UnitsConsumed} units consumed</p>
                      <small>{new Date(reading.ReadingDate).toLocaleDateString()}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link to="/readings" className="view-all-link">View all readings →</Link>
          </div>
        )}

        {canViewPayments && (
          <div className="activity-card">
            <h3>Recent Payments</h3>
            <div className="activity-list">
              {payments.length === 0 ? (
                <div className="no-activity">No recent payments</div>
              ) : (
                payments.slice(-5).reverse().map(payment => (
                  <div key={payment.PaymentID} className="activity-item">
                    <div className="activity-icon">P</div>
                    <div className="activity-info">
                      <strong>B-{String(payment.BillID).padStart(4, '0')}</strong>
                      <p>LKR {parseFloat(payment.AmountPaid).toFixed(2)} - {payment.PaymentMethod}</p>
                      <small>{new Date(payment.PaymentDate).toLocaleString()}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link to="/payments" className="view-all-link">View all payments →</Link>
          </div>
        )}
      </div>

      {canViewBills && unpaidBills.length > 0 && (
        <div className="alerts-section">
          <div className="alert-card alert-warning">
            <div className="alert-icon">!</div>
            <div className="alert-content">
              <h4>Pending Bills Alert</h4>
              <p>{unpaidBills.length} bills are awaiting payment totaling LKR {pendingAmount.toFixed(2)}</p>
              <Link to="/bills" className="alert-action">Process payments →</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
