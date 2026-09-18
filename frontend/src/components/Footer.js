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
          AutoCheckr is not affiliated => (
  <div className="card" style={{ textAlign: 'center' }}>
    <div style={{ 
      fontSize: '3rem', 
      color: 'var(--primary-color)', 
      marginBottom: '1rem' 
    }}>
      {icon}
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const StepCard = ({ number, title, description }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ 
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: 'var(--primary-color)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      fontWeight: '700',
      margin: '0 auto 1rem'
    }}>
      {number}
    
