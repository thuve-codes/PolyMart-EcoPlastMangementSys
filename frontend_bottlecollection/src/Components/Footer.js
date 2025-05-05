import React from 'react';
import './Footer.css'; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faMapMarkerAlt, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Section 1: About */}
        <div className="footer-section about">
          <h2 className="footer-title">POLYMART</h2>
          <p>
            Your one-stop shop for all your needs. Quality products, exceptional service.
          </p>
          <div className="social-icons">
            <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
            <a href="#"><FontAwesomeIcon icon={faLinkedinIn} /></a>
          </div>
        </div>

        {/* Section 2: Quick Links */}
        <div className="footer-section links">
          <h2 className="footer-title">QUICK LINKS</h2>
          <ul>
            <li><a href="http://localhost:3000/">Home</a></li>
            <li><a href="http://localhost:3000/orders">My Orders</a></li>
            <li><a href="http://localhost:3002/Home">EcoStar</a></li>
            <li><a href="http://localhost:3004/">Reward and Cashback</a></li>
            <li><a href="http://localhost:3000/aboutus">About Us</a></li>
            {/* Add more links as needed */}
          </ul>
        </div>

        {/* Section 3: Contact Us */}
        <div className="footer-section contact">
          <h2 className="footer-title">CONTACT US</h2>
          <div className="contact-item">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            <span>Malabe, Western Province, Sri Lanka</span>
          </div>
          <div className="contact-item">
            <FontAwesomeIcon icon={faEnvelope} />
            <span>info@polymart.com</span>
          </div>
          <div className="contact-item">
            <FontAwesomeIcon icon={faPhone} />
            <span>+94 123 456 789</span>
          </div>
        </div>
      </div>

      {/* Footer Divider */}
      <hr className="footer-divider" />

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <span>© 2025 Polymart. All rights reserved.</span>
        <span>Developed with <span style={{ color: 'red' }}>❤</span> by WD 3.2 - G115</span>
      </div>
    </footer>
  );
};

export default Footer;