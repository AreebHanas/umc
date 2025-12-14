import { useSelector, useDispatch } from 'react-redux';
import { logout, selectUser, selectIsAuthenticated } from '../../redux';

// Custom hook for authentication
export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    isAuthenticated,
    logout: handleLogout,
  };
};
