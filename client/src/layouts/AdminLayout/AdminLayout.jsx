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
            <h1>Admin Panel</h1>
          </div>

          <div className="admin-actions">
            <div className="admin-user">
              <span>{user?.Username}</span>
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
