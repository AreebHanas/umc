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



  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <h1 className="login-title">Utility Management System</h1>
        <p className="login-subtitle">Sign in to your account</p>

        {error && (
          <div className="alert alert-error" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        <label htmlFor="username" className="input-label">Username</label>
        <input
          id="username"
          className="input-field"
          type="text"
          required
          value={credentials.username}
          onChange={(e) => setCredentials({...credentials, username: e.target.value})}
          placeholder="Enter your username"
          autoComplete="username"
          aria-required="true"
        />

        <label htmlFor="password" className="input-label">Password</label>
        <input
          id="password"
          className="input-field"
          type="password"
          required
          value={credentials.password}
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          placeholder="Enter your password"
          autoComplete="current-password"
          aria-required="true"
        />

        <button className="btn-primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

export default Login;
