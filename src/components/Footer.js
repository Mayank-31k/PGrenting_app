import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>PG RENTER</h3>
            <p>Find your perfect PG accommodation near college with verified listings and trusted reviews.</p>
          </div>
          
          <div className="footer-section">
            <h4>QUICK LINKS</h4>
            <ul>
              <li><a href="#search">Search PGs</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#help">Help</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>SUPPORT</h4>
            <ul>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#feedback">Feedback</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>CONNECT</h4>
            <div className="social-links">
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">Instagram</a>
              <a href="#" className="social-link">LinkedIn</a>
            </div>
            <div className="contact-info">
              <p>📧 info@pgrenter.com</p>
              <p>📞 +91 98765 43210</p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-copyright">
            <p>&copy; 2024 PG Renter. All rights reserved.</p>
            <p>Made with ❤️ for students</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;