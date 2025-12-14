import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../redux/slices/authSlice';
import { userService } from '../../services';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);
  
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('\n=== FORM LOGIN SUBMIT ===');
    console.log('Credentials:', credentials);
    
    dispatch(loginStart());
    
    try {
      console.log('📡 Calling login API...');
      const response = await userService.login(credentials);
      console.log('✅ Login API response:', response);
      console.log('✅ Login API response:', response);
      
      // Store token and user data
      console.log('💾 Dispatching loginSuccess with:', { token: response.data.token, user: response.data.user });
      dispatch(loginSuccess({
        token: response.data.token,
        user: response.data.user
      }));
      
      // Redirect based on role
      const role = response.data.user.Role;
      console.log('🔀 Redirecting based on role:', role);
      
      if (role === 'Admin') {
        console.log('➡️ Navigating to /admin');
        navigate('/admin');
      } else {
        console.log('➡️ Navigating to /dashboard');
        navigate('/dashboard');
      }
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || 'Login failed'));
    }
  };

  const handleDemoLogin = async (role, username, password) => {
    console.log('\n=== DEMO LOGIN ===');
    console.log('Role:', role, 'Username:', username);
    dispatch(loginStart());
    
    try {
      console.log('📡 Calling login API for demo user...');
      const response = await userService.login({ username, password });
      console.log('✅ Demo login response:', response);
      console.log('✅ Demo login response:', response);
      
      console.log('💾 Dispatching loginSuccess');
      dispatch(loginSuccess({
        token: response.data.token,
        user: response.data.user
      }));
      
      // Redirect based on role
      const userRole = response.data.user.Role;
      console.log('🔀 Redirecting demo user, role:', userRole);
      
      if (userRole === 'Admin') {
        console.log('➡️ Navigating to /admin');
        navigate('/admin');
      } else {
        console.log('➡️ Navigating to /dashboard');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('❌ Demo login error:', err);
      console.error('Error response:', err.response);
      dispatch(loginFailure(err.response?.data?.message || 'Login failed'));
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>Utility Management System</h1>
          <p>Sign in to your account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              required
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn-login" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-section">
          <p className="demo-title">Quick Demo Login:</p>
          <div className="demo-buttons">
            <button type="button" onClick={() => handleDemoLogin('admin', 'admin', 'admin123')} className="demo-btn admin">
              Admin
            </button>
            <button type="button" onClick={() => handleDemoLogin('manager', 'manager', 'manager123')} className="demo-btn manager">
              Manager
            </button>
            <button type="button" onClick={() => handleDemoLogin('officer', 'officer', 'officer123')} className="demo-btn officer">
              Field Officer
            </button>
            <button type="button" onClick={() => handleDemoLogin('cashier', 'cashier', 'cashier123')} className="demo-btn cashier">
              Cashier
            </button>
          </div>
        </div>

        <div className="login-footer">
          <Link to="/" className="back-home">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
