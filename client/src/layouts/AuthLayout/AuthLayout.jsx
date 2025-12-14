import { Outlet, Link } from 'react-router-dom';
import './AuthLayout.css';

function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-sidebar">
          <div className="auth-brand">
            <h1>MyApp</h1>
            <p>Welcome to our platform</p>
          </div>
          <div className="auth-illustration">
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
            <div className="circle circle-3"></div>
          </div>
        </div>

        <div className="auth-content">
          <div className="auth-form-container">
            <Outlet />
            <div className="auth-footer">
              <Link to="/">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
