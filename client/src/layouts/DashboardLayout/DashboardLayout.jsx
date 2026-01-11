import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { logout } from '../../redux/slices/authSlice';
import { hasPermission } from '../../utils/permissions';
import './DashboardLayout.css';

function DashboardLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Permission-based menu items (menu visibility follows `permissions.js`)
  const menuItems = [
    { path: '/dashboard', icon: 'D', label: 'Dashboard' },
    { path: '/customers', icon: 'C', label: 'Customers', permission: 'VIEW_CUSTOMERS' },
    { path: '/meters', icon: 'M', label: 'Meters', permission: 'VIEW_METERS' },
    { path: '/readings', icon: 'R', label: 'Readings', permission: 'VIEW_READINGS' },
    { path: '/bills', icon: 'B', label: 'Bills', permission: 'VIEW_BILLS' },
    { path: '/payments', icon: 'P', label: 'Payments', permission: 'VIEW_PAYMENTS' },
  ];

  const visibleMenuItems = menuItems.filter(item => {
    if (!item.permission) return true; // always show
    return hasPermission(user?.Role, item.permission);
  });

  const getRoleBadgeClass = (role) => {
    const roleClasses = {
      Admin: 'admin',
      Manager: 'manager',
      FieldOfficer: 'officer',
      Cashier: 'cashier'
    };
    return roleClasses[role] || 'default';
  };

  return (
    <div className="dashboard-layout">
      <button 
        className="mobile-menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>
      
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="30" cy="30" r="28" fill="white" opacity="0.1"/>
              <path d="M30 10L35 20H25L30 10Z" fill="white"/>
              <path d="M20 25H40V35C40 38.866 36.866 42 33 42H27C23.134 42 20 38.866 20 35V25Z" fill="white"/>
              <path d="M22 28H38V32H22V28Z" fill="#1976d2"/>
              <circle cx="25" cy="38" r="2" fill="#42a5f5"/>
              <circle cx="35" cy="38" r="2" fill="#42a5f5"/>
              <path d="M28 45L32 45L31 50H29L28 45Z" fill="#42a5f5"/>
            </svg>
            <h2>Utility System</h2>
          </div>
          <p className="user-name">{user?.Username || 'User'}</p>
          <span className={`role-badge ${getRoleBadgeClass(user?.Role)}`}>
            {user?.Role || 'User'}
          </span>
        </div>
        <nav className="sidebar-nav">
          {visibleMenuItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className="nav-item"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Welcome Back, {user?.Username}</h1>
            <div className="user-menu">
              <span className={`role-badge ${getRoleBadgeClass(user?.Role)}`}>
                {user?.Role}
              </span>
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
