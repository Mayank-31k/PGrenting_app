import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>PG Renter</h3>
          </div>
          
          <div className="footer-links">
            <a href="#" className="footer-link">About</a>
            <a href="#" className="footer-link">Products</a>
            <a href="#" className="footer-link">Blogs</a>
            <a href="#" className="footer-link">Support</a>
          </div>
          
          <div className="footer-social">
            <a href="#" className="social-icon">📘</a>
            <a href="#" className="social-icon">📷</a>
            <a href="#" className="social-icon">🐦</a>
            <a href="#" className="social-icon">💼</a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 PG Renter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;