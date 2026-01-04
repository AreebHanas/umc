import { Outlet, Link, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Clear auth data (adjust based on your app)
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // 2. Redirect to login
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-logo">
            <h1>Admin Panel</h1>
          </div>

          <div className="admin-actions">
            <div className="admin-user">
              <span>Admin</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </header>

      <div className="admin-body">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <div className="nav-section">
              <h3>Main</h3>
              <Link to="/admin" className="admin-nav-item">Dashboard</Link>
              <Link to="/admin/users" className="admin-nav-item">Users</Link>
              <Link to="/admin/customers" className="admin-nav-item">Customers</Link>
              <Link to="/admin/meters" className="admin-nav-item">Meters</Link>
              <Link to="/admin/readings" className="admin-nav-item">Readings</Link>
              <Link to="/admin/bills" className="admin-nav-item">Bills</Link>
              <Link to="/admin/payments" className="admin-nav-item">Payments</Link>
            </div>

            <div className="nav-section">
              <h3>Settings</h3>
              <Link to="/admin/reports" className="admin-nav-item">Reports</Link>
              <Link to="/admin/settings" className="admin-nav-item">Settings</Link>
            </div>
          </nav>
        </aside>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
