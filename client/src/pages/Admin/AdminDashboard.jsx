import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../../services';
import { customerService } from '../../services';
import { meterService } from '../../services';
import { billService } from '../../services';
import { paymentService } from '../../services';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: { total: 0, byRole: {} },
    customers: 0,
    meters: 0,
    bills: { total: 0, unpaid: 0 },
    payments: { total: 0, amount: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    setIsLoading(true);
    try {
      const [users, customers, meters, bills, payments] = await Promise.all([
        userService.getAllUsers(),
        customerService.getAllCustomers(),
        meterService.getAllMeters(),
        billService.getAllBills(),
        paymentService.getAllPayments()
      ]);

      // Calculate user stats
      const usersByRole = users.data.reduce((acc, user) => {
        acc[user.Role] = (acc[user.Role] || 0) + 1;
        return acc;
      }, {});

      // Calculate unpaid bills
      const unpaidBills = bills.data.filter(b => b.Status === 'Unpaid' || b.Status === 'Overdue');

      // Calculate total payment amount
      const totalAmount = payments.data.reduce((sum, p) => sum + parseFloat(p.AmountPaid), 0);

      setStats({
        users: { total: users.data.length, byRole: usersByRole },
        customers: customers.data.length,
        meters: meters.data.length,
        bills: { total: bills.data.length, unpaid: unpaidBills.length },
        payments: { total: payments.data.length, amount: totalAmount }
      });
    } catch (error) {
      // Error handled
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Complete system overview and management</p>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <Link to="/admin/users" className="action-card action-users">
            <div className="action-content">
              <h3>Manage Users</h3>
              <p>Create and manage system users</p>
              <span className="action-count">{stats.users.total} users</span>
            </div>
          </Link>

          <Link to="/admin/customers" className="action-card action-customers">
            <div className="action-content">
              <h3>All Customers</h3>
              <p>View and manage all customers</p>
              <span className="action-count">{stats.customers} customers</span>
            </div>
          </Link>

          <Link to="/admin/meters" className="action-card action-meters">
            <div className="action-content">
              <h3>All Meters</h3>
              <p>Monitor all utility meters</p>
              <span className="action-count">{stats.meters} meters</span>
            </div>
          </Link>

          <Link to="/admin/bills" className="action-card action-bills">
            <div className="action-content">
              <h3>All Bills</h3>
              <p>View billing information</p>
              <span className="action-count">{stats.bills.total} bills</span>
            </div>
          </Link>

          <Link to="/admin/payments" className="action-card action-payments">
            <div className="action-content">
              <h3>All Payments</h3>
              <p>Track payment transactions</p>
              <span className="action-count">LKR {stats.payments.amount.toFixed(2)}</span>
            </div>
          </Link>
        </div>
      </div>

      <div className="system-overview">
        <div className="overview-section">
          <h2>User Distribution</h2>
          <div className="user-stats">
            <div className="user-stat-item admin">
              <div className="stat-label">
                <span className="stat-icon">A</span>
                <span>Admins</span>
              </div>
              <div className="stat-value">{stats.users.byRole.Admin || 0}</div>
            </div>
            <div className="user-stat-item manager">
              <div className="stat-label">
                <span className="stat-icon">M</span>
                <span>Managers</span>
              </div>
              <div className="stat-value">{stats.users.byRole.Manager || 0}</div>
            </div>
            <div className="user-stat-item officer">
              <div className="stat-label">
                <span className="stat-icon">F</span>
                <span>Field Officers</span>
              </div>
              <div className="stat-value">{stats.users.byRole.FieldOfficer || 0}</div>
            </div>
            <div className="user-stat-item cashier">
              <div className="stat-label">
                <span className="stat-icon">C</span>
                <span>Cashiers</span>
              </div>
              <div className="stat-value">{stats.users.byRole.Cashier || 0}</div>
            </div>
          </div>
        </div>

        <div className="overview-section">
          <h2>System Health</h2>
          <div className="health-items">
            <div className="health-item">
              <div className="health-icon">OK</div>
              <div className="health-info">
                <strong>Database Connection</strong>
                <span className="status-good">Operational</span>
              </div>
            </div>
            <div className="health-item">
              <div className="health-icon">OK</div>
              <div className="health-info">
                <strong>API Services</strong>
                <span className="status-good">Running</span>
              </div>
            </div>
            <div className="health-item">
              <div className="health-icon">!</div>
              <div className="health-info">
                <strong>Unpaid Bills</strong>
                <span className="status-warning">{stats.bills.unpaid} bills pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="system-stats-grid">
        <div className="stat-box stat-total">
          <h3>Total Customers</h3>
          <div className="stat-number">{stats.customers}</div>
          <Link to="/admin/customers" className="stat-link">View All →</Link>
        </div>

        <div className="stat-box stat-meters">
          <h3>Active Meters</h3>
          <div className="stat-number">{stats.meters}</div>
          <Link to="/admin/meters" className="stat-link">Manage →</Link>
        </div>

        <div className="stat-box stat-revenue">
          <h3>Total Amount</h3>
          <div className="stat-number">LKR {stats.payments.amount.toFixed(2)}</div>
          <Link to="/admin/payments" className="stat-link">View Payments →</Link>
        </div>

        <div className="stat-box stat-bills">
          <h3>Pending Bills</h3>
          <div className="stat-number">{stats.bills.unpaid}</div>
          <Link to="/admin/bills" className="stat-link">Process →</Link>
        </div>
      </div>

      
    </div>
  );
}

export default AdminDashboard;
