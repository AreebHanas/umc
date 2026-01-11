import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="hero-section">
        <h1>Utility Management System</h1>
        <p className="subtitle">Efficient management of electricity, water, and gas utilities</p>
        <div className="hero-buttons">
          <Link to="/login" className="cta-button primary">Sign In</Link>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">○</div>
          <h3>Customer Management</h3>
          <p>Manage household, business, and government customers</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">○</div>
          <h3>Meter Tracking</h3>
          <p>Monitor meters for electricity, water, and gas utilities</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">○</div>
          <h3>Reading Records</h3>
          <p>Record meter readings and auto-generate bills</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">○</div>
          <h3>Billing System</h3>
          <p>Automated billing with tariff calculations</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">○</div>
          <h3>Payment Processing</h3>
          <p>Track payments via cash, card, or online methods</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">○</div>
          <h3>Reports & Analytics</h3>
          <p>View unpaid bills, payment stats, and more</p>
        </div>
      </div>

      <div className="cta-section">
        <h2>Get Started</h2>
        <p>Navigate to the dashboard to manage your utility operations</p>
        <Link to="/login" className="cta-link">Sign In to Continue →</Link>
      </div>
    </div>
  );
}

export default Home;
