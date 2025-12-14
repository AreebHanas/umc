import { Outlet, Link } from 'react-router-dom';
import './MainLayout.css';

function MainLayout() {
  return (
    <div className="main-layout">
      <header className="header">
        <div className="container">
          <div className="logo">
            <Link to="/">MyApp</Link>
          </div>
          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 MyApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
