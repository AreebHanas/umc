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
        <div className="login-logo">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="28" fill="#1976d2" opacity="0.1"/>
            <path d="M30 10L35 20H25L30 10Z" fill="#1976d2"/>
            <path d="M20 25H40V35C40 38.866 36.866 42 33 42H27C23.134 42 20 38.866 20 35V25Z" fill="#1976d2"/>
            <path d="M22 28H38V32H22V28Z" fill="white"/>
            <circle cx="25" cy="38" r="2" fill="#1565c0"/>
            <circle cx="35" cy="38" r="2" fill="#1565c0"/>
            <path d="M28 45L32 45L31 50H29L28 45Z" fill="#1565c0"/>
          </svg>
        </div>
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
