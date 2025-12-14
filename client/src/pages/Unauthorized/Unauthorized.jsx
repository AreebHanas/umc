import { Link } from 'react-router-dom';
import './Unauthorized.css';

function Unauthorized() {
  return (
    <div className="unauthorized-page">
      <div className="unauthorized-card">
        <div className="error-icon">403</div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this resource.</p>
        <div className="actions">
          <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
          <Link to="/" className="btn-secondary">Go to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
