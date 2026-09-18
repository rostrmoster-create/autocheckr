import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { FaCar, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FaCar style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
          AutoCheckr
        </Link>
        
        <ul className="navbar-menu">
          <li><Link to="/" className="navbar-link">Home</Link></li>
          <li><Link to="/vin-check" className="navbar-link">VIN Check</Link></li>
          <li><Link to="/sample-report" className="navbar-link">Sample Report</Link></li>
          <li><Link to="/pricing" className="navbar-link">Pricing</Link></li>
          <li><Link to="/about" className="navbar-link">About</Link></li>
          
          {user ? (
            <>
              <li>
                <Link to="/dashboard" className="navbar-link">
                  <FaUser style={{ marginRight: '0.25rem' }} />
                  Dashboard
                </Link>
              </li>
              {user.isAdmin && (
                <li>
                  <Link to="/admin" className="navbar-link">Admin</Link>
                </li>
              )}
              <li>
                <button onClick={handleLogout} className="btn btn-small btn-outline">
                  <FaSignOutAlt style={{ marginRight: '0.25rem' }} />
                  Logout
                </button>
              </li>
              <li>
                <span className="badge badge-info">
                  {user.reportCredits} Credits
                </span>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="btn btn-small btn-outline">Login</Link></li>
              <li><Link to="/register" className="btn btn-small btn-primary">Sign Up</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
