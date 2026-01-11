import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { hasPermission } from '../../utils/permissions';
import './AdminLayout.css';

function AdminLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Permission-based menu items
  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '▸' },
    { path: '/admin/users', label: 'Users', icon: '▸', permission: 'MANAGE_USERS' },
    { path: '/admin/customers', label: 'Customers', icon: '▸', permission: 'VIEW_CUSTOMERS' },
    { path: '/admin/meters', label: 'Meters', icon: '▸', permission: 'VIEW_METERS' },
    { path: '/admin/readings', label: 'Readings', icon: '▸', permission: 'VIEW_READINGS' },
    { path: '/admin/bills', label: 'Bills', icon: '▸', permission: 'VIEW_BILLS' },
    { path: '/admin/payments', label: 'Payments', icon: '▸', permission: 'VIEW_PAYMENTS' },
  ];

  const visibleMenuItems = menuItems.filter(item => {
    if (!item.permission) return true;
    return hasPermission(user?.Role, item.permission);
  });

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-logo">
            <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="30" cy="30" r="28" fill="white" opacity="0.2"/>
              <path d="M30 10L35 20H25L30 10Z" fill="white"/>
              <path d="M20 25H40V35C40 38.866 36.866 42 33 42H27C23.134 42 20 38.866 20 35V25Z" fill="white"/>
              <path d="M22 28H38V32H22V28Z" fill="#1976d2"/>
              <circle cx="25" cy="38" r="2" fill="#42a5f5"/>
              <circle cx="35" cy="38" r="2" fill="#42a5f5"/>
              <path d="M28 45L32 45L31 50H29L28 45Z" fill="#42a5f5"/>
            </svg>
            <h1>Admin Panel</h1>
          </div>

          <div className="admin-actions">
            <div className="admin-user">
              <span className="role-badge">{user?.Role}</span>
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
              {visibleMenuItems.map(item => (
                <Link key={item.path} to={item.path} className="admin-nav-item">
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
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
