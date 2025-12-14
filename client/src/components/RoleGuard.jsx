import { useSelector } from 'react-redux';
import { hasPermission } from '../utils/permissions';

/**
 * Component to conditionally render children based on user permissions
 * Usage: <RoleGuard permission="CREATE_CUSTOMERS">...</RoleGuard>
 */
function RoleGuard({ children, permission, fallback = null }) {
  const { user } = useSelector(state => state.auth);
  
  if (!user) {
    return fallback;
  }

  if (hasPermission(user.Role, permission)) {
    return children;
  }

  return fallback;
}

export default RoleGuard;
