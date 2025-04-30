import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          {/* About/Company Section - Left aligned */}
          <div className="col-lg-5 mb-4 mb-lg-0">
            <h5 className="text-uppercase mb-4">PolyMart</h5>
            <p className="text-muted mb-4">
              Your one-stop shop for all your needs. Quality products, exceptional service.
            </p>
            <div className="social-links">
              <a href="#" className="text-white mx-3" aria-label="Facebook">
                <i className="bi bi-facebook fs-4"></i>
              </a>
              
              <a href="#" className="text-white mx-3" aria-label="Instagram">
                <i className="bi bi-instagram fs-4"></i>
              </a>
              <a href="#" className="text-white mx-3" aria-label="LinkedIn">
                <i className="bi bi-linkedin fs-4"></i>
              </a>
            </div>
          </div>
          
          {/* Quick Links Section - Center aligned */}
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h6 className="text-uppercase mb-4">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="/" className="text-white-50">Home</a></li>
              <li className="mb-2"><a href="/orders" className="text-white-50">My Orders</a></li>
              <li className="mb-2"><a href="/aboutus" className="text-white-50">About Us</a></li>
              <li className="mb-2"><a href="#" className="text-white-50">EcoUser</a></li>
            </ul>
          </div>
          
          {/* Contact Info Section */}
          <div className="col-lg-4 col-md-6">
            <h6 className="text-uppercase mb-4">Contact Us</h6>
            <ul className="list-unstyled text-white-50">
              <li className="mb-2">
                <i className="bi bi-geo-alt me-2"></i> Malabe, Western Province, Sri Lanka
              </li>
              <li className="mb-2">
                <i className="bi bi-envelope me-2"></i> info@polymart.com
              </li>
              <li className="mb-2">
                <i className="bi bi-phone me-2"></i> +94 123 456 789
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="my-4 bg-secondary opacity-50" />
        
        {/* Footer Bottom */}
        <div className="row align-items-center">
        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
          <p className="fs-5 text-white mb-0">
            &copy; {currentYear} PolyMart. All rights reserved.
          </p>
        </div>
        <div className="col-md-6 text-center text-md-end">
          <div className="d-flex justify-content-center justify-content-md-end">
            <p className="text-white mb-0">  
              Developed with ❤️ by WD 5.2 - G115
            </p>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}