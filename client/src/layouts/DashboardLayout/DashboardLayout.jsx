import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { logout } from '../../redux/slices/authSlice';
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

  // Role-based menu items
  const menuItems = [
    { path: '/dashboard', icon: 'D', label: 'Dashboard', roles: ['Admin', 'Manager', 'FieldOfficer', 'Cashier'] },
    { path: '/customers', icon: 'C', label: 'Customers', roles: ['Admin', 'Manager', 'FieldOfficer'] },
    { path: '/meters', icon: 'M', label: 'Meters', roles: ['Admin', 'Manager', 'FieldOfficer'] },
    { path: '/readings', icon: 'R', label: 'Readings', roles: ['Admin', 'Manager', 'FieldOfficer'] },
    { path: '/bills', icon: 'B', label: 'Bills', roles: ['Admin', 'Manager', 'Cashier'] },
    { path: '/payments', icon: 'P', label: 'Payments', roles: ['Admin', 'Manager', 'Cashier'] },
  ];

  const visibleMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.Role)
  );

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
          <h2>Utility System</h2>
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
