import React from 'react';
import { Link } from 'react-router-dom';
import { FaCar } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <h4>
            <FaCar style={{ marginRight: '0.5rem' }} />
            AutoCheckr
          </h4>
          <p>
            Comprehensive vehicle history reports to help you make informed decisions.
          </p>
        </div>
        
        <div>
          <h4>Quick Links</h4>
          <Link to="/vin-check">VIN Check</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/sample-report">Sample Report</Link>
          <Link to="/about">About Us</Link>
        </div>
        
        <div>
          <h4>Legal</h4>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/data-sources">Data Sources</Link>
        </div>
        
        <div>
          <h4>Support</h4>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact Us</Link>
          <a href="mailto:support@autocheckr.com">support@autocheckr.com</a>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AutoCheckr. All rights reserved.</p>
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
          AutoCheckr is not affiliated with CARFAX, AutoCheck, or any other vehicle history service.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
