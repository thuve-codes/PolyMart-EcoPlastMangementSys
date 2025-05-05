// Example structure for your components/Footer.js
import React from 'react';
// Optional: Import Font Awesome if using it for icons
// import '@fortawesome/fontawesome-free/css/all.min.css';
import './Footer.css'; // Import the CSS file

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
            {/* Replace # with your actual social media links */}
            {/* Add appropriate icons (e.g., using Font Awesome) */}
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
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
             {/* Add appropriate icons */}
            <i className="fas fa-map-marker-alt"></i>
            <span>Malabe, Western Province, Sri Lanka</span>
          </div>
          <div className="contact-item">
            <i className="fas fa-envelope"></i>
            <span>info@polymart.com</span>
          </div>
          <div className="contact-item">
            <i className="fas fa-phone"></i>
            <span>+94 123 456 789</span>
          </div>
        </div>
      </div>

      {/* Footer Divider */}
      <hr className="footer-divider" />

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <span>© 2025 Polymart. All rights reserved.</span>
        {/* You might need to adjust the heart symbol/styling */}
        <span>Developed with <span style={{color: 'red'}}>❤</span> by WD 5.2 - G115</span>
      </div>
    </footer>
  );
};

export default Footer;