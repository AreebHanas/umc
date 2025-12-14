import { Outlet, Link } from 'react-router-dom';
import './AdminLayout.css';

function AdminLayout() {
  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-logo">
            <h1>Admin Panel</h1>
          </div>
          <div className="admin-actions">
            <button className="notification-btn">
              Notifications <span className="badge">3</span>
            </button>
            <div className="admin-user">
              <span>Admin</span>
              <button>Logout</button>
            </div>
          </div>
        </div>
      </header>

      <div className="admin-body">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <div className="nav-section">
              <h3>Main</h3>
              <Link to="/admin" className="admin-nav-item">
                <span className="icon">H</span>
                Dashboard
              </Link>
              <Link to="/admin/users" className="admin-nav-item">
                <span className="icon">U</span>
                Users
              </Link>
              <Link to="/admin/customers" className="admin-nav-item">
                <span className="icon">C</span>
                Customers
              </Link>
              <Link to="/admin/meters" className="admin-nav-item">
                <span className="icon">M</span>
                Meters
              </Link>
              <Link to="/admin/readings" className="admin-nav-item">
                <span className="icon">R</span>
                Readings
              </Link>
              <Link to="/admin/bills" className="admin-nav-item">
                <span className="icon">B</span>
                Bills
              </Link>
              <Link to="/admin/payments" className="admin-nav-item">
                <span className="icon">P</span>
                Payments
              </Link>
            </div>
            <div className="nav-section">
              <h3>Settings</h3>
              <Link to="/admin/reports" className="admin-nav-item">
                <span className="icon">R</span>
                Reports
              </Link>
              <Link to="/admin/settings" className="admin-nav-item">
                <span className="icon">S</span>
                Settings
              </Link>
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
