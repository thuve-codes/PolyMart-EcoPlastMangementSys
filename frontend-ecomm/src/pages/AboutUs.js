import React from 'react';
import { Link } from 'react-router-dom';
import { FaRecycle, FaShoppingCart, FaCreditCard, FaLeaf, FaChartLine, FaTruck, FaCoins, FaLaptopCode } from 'react-icons/fa';
import image from '../components/images/aboutus.jpg'; // Adjust the path as necessary

import '../App.css'; // Import your CSS file here
const AboutUs = () => {
  return (
    <div className="about-us container py-5">
      {/* Hero Section */}
      <header className="hero-section text-center mb-5 py-5 rounded-3">
        <div className="hero-overlay">
          <h1 className="display-4 fw-bold text-white mb-4">Welcome to PolyMart</h1>
          <p className="lead text-light">Where Shopping Meets Sustainability</p>
          <div className="mt-4">
            <Link to='/' className="btn btn-success btn-lg me-3" >Shop NoW</Link>
            </div>
        </div>
      </header>

      {/* About Section */}
      <section className="row align-items-center mb-5">
        <div className="col-lg-6 mb-4 mb-lg-0">
          <div className="ratio ratio-16x9">
          <img
            src={image}
            alt="About PolyMart"
            className="img-fluid rounded-3"
            width={1600}
            height={900}
          />
          </div>
        </div>
        <div className="col-lg-6">
          <h2 className="mb-4">Redefining E-commerce with Purpose</h2>
          <p className="lead">
            PolyMart is revolutionizing online shopping by integrating environmental responsibility with consumer convenience.
          </p>
          <p>
            Our innovative platform allows you to shop for high-quality products while actively participating in plastic waste reduction. Every plastic bottle you recycle through our system earns you reward points that can be redeemed for discounts on future purchases.
          </p>
          <div className="d-flex align-items-center mt-4">
            <div className="me-4 text-center">
              <div className="display-6 text-success">10,000+</div>
              <div>Bottles Recycled</div>
            </div>
            <div className="me-4 text-center">
              <div className="display-6 text-success">5,000+</div>
              <div>Satisfied Customers</div>
            </div>
            <div className="text-center">
              <div className="display-6 text-success">50+</div>
              <div>Eco-friendly Products</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mb-5 py-4 bg-light rounded-3">
        <div className="container">
          <h2 className="text-center mb-5">Our Core Values</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <FaLeaf className="display-4 text-success mb-3" />
                  <h4>Sustainability</h4>
                  <p>We're committed to reducing plastic waste and promoting a circular economy through innovative solutions.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <FaRecycle className="display-4 text-success mb-3" />
                  <h4>Innovation</h4>
                  <p>We constantly develop new ways to make recycling rewarding and shopping environmentally conscious.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <FaChartLine className="display-4 text-success mb-3" />
                  <h4>Transparency</h4>
                  <p>We provide clear tracking of your environmental impact and how your recycling contributes to change.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-5">
        <h2 className="text-center mb-5">Why Choose PolyMart?</h2>
        <div className="row g-4">
          <div className="col-md-6 col-lg-3">
            <div className="feature-card p-4 rounded shadow-sm h-100">
              <div className="feature-icon mb-3">
                <FaRecycle className="text-success" size={32} />
              </div>
              <h5>Recycling Rewards</h5>
              <p>Earn points for every plastic bottle you recycle and redeem them for discounts on eco-friendly products.</p>
              <a href="#" className="text-success text-decoration-none">Learn more →</a>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="feature-card p-4 rounded shadow-sm h-100">
              <div className="feature-icon mb-3">
                <FaShoppingCart className="text-success" size={32} />
              </div>
              <h5>Curated Products</h5>
              <p>Discover sustainable alternatives to everyday items, carefully selected for their environmental benefits.</p>
              <a href="#" className="text-success text-decoration-none">Browse products →</a>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="feature-card p-4 rounded shadow-sm h-100">
              <div className="feature-icon mb-3">
                <FaCreditCard className="text-success" size={32} />
              </div>
              <h5>Flexible Payments</h5>
              <p>Pay with credit cards, UPI, or use your earned reward points - we offer payment options for everyone.</p>
              <a href="#" className="text-success text-decoration-none">See options →</a>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="feature-card p-4 rounded shadow-sm h-100">
              <div className="feature-icon mb-3">
                <FaTruck className="text-success" size={32} />
              </div>
              <h5>Eco-friendly Delivery</h5>
              <p>Our carbon-neutral shipping ensures your purchases arrive with minimal environmental impact.</p>
              <a href="#" className="text-success text-decoration-none">Our process →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
<section className="py-5 bg-light">
  <div className="container">
    <div className="text-center mb-5">
      <span className="badge bg-success bg-opacity-10 text-success mb-3">Our Team</span>
      <h2 className="display-5 fw-bold">Our Green Warriors</h2>
      <p className="lead text-muted">Meet the passionate team driving the sustainability revolution forward</p>
    </div>
    
    <div className="row g-4 justify-content-center">
      {/* Team Member 1 */}
      <div className="col-md-6 col-lg-4 col-xl-3">
        <div className="card team-card h-100 border-0 shadow-sm">
          <div className="card-body text-center px-4 py-4">
            <h5 className="card-title mb-1">Sajeemthan S</h5>
            <div className="d-flex justify-content-center align-items-center mb-3">
              <span className="text-muted me-2">ID:</span>
              <span className="text-dark fw-bold">IT23327962</span>
            </div>
            <p className="card-text text-success small mb-2">Admin & Analytics Dashboard</p>
            <p className="text-muted small">Data wizard turning numbers into actionable sustainability insights</p>
          </div>
        </div>
      </div>

      {/* Team Member 2 */}
      <div className="col-md-6 col-lg-4 col-xl-3">
        <div className="card team-card h-100 border-0 shadow-sm">
          <div className="card-body text-center px-4 py-4">
            <h5 className="card-title mb-1">D.B. Jagapathy Dhanushkar</h5>
            <div className="d-flex justify-content-center align-items-center mb-3">
              <span className="text-muted me-2">ID:</span>
              <span className="text-dark fw-bold">IT23284098</span>
            </div>
            <p className="card-text text-success small mb-2">Bottle Collection & Logistics</p>
            <p className="text-muted small">Optimizing routes to make recycling as efficient as possible</p>
          </div>
        </div>
      </div>

      {/* Team Member 3 */}
      <div className="col-md-6 col-lg-4 col-xl-3">
        <div className="card team-card h-100 border-0 shadow-sm">
          <div className="card-body text-center px-4 py-4">
            <h5 className="card-title mb-1">Clerin B</h5>
            <div className="d-flex justify-content-center align-items-center mb-3">
              <span className="text-muted me-2">ID:</span>
              <span className="text-dark fw-bold">IT23402584</span>
            </div>
            <p className="card-text text-success small mb-2">Reward System & Customer Benefits</p>
            <p className="text-muted small">Making sustainability rewarding with creative incentive programs</p>
          </div>
        </div>
      </div>

      {/* Team Member 4 */}
      <div className="col-md-6 col-lg-4 col-xl-3">
        <div className="card team-card h-100 border-0 shadow-sm">
          <div className="card-body text-center px-4 py-4">
            <h5 className="card-title mb-1">Thuverakan T</h5>
            <div className="d-flex justify-content-center align-items-center mb-3">
              <span className="text-muted me-2">ID:</span>
              <span className="text-dark fw-bold">IT23281332</span>
            </div>
            <p className="card-text text-success small mb-2">E-commerce Platform Development</p>
            <p className="text-muted small">Building the digital marketplace for sustainable products</p>
          </div>
        </div>
      </div>

      {/* Team Member 5 */}
      <div className="col-md-6 col-lg-4 col-xl-3">
        <div className="card team-card h-100 border-0 shadow-sm">
          <div className="card-body text-center px-4 py-4">
            <h5 className="card-title mb-1">Kethushan M</h5>
            <div className="d-flex justify-content-center align-items-center mb-3">
              <span className="text-muted me-2">ID:</span>
              <span className="text-dark fw-bold">IT23290006</span>
            </div>
            <p className="card-text text-success small mb-2">Login & User Profile Management</p>
            <p className="text-muted small">Creating seamless user experiences for our community</p>
          </div>
        </div>
      </div>
    </div>

    {/* Stats Section */}
    <div className="row mt-5 pt-4 g-4">
      <div className="col-6 col-md-3 text-center">
        <div className="counter display-5 fw-bold text-success mb-2">2500+</div>
        <p className="text-muted mb-0">Bottles Recycled</p>
      </div>
      <div className="col-6 col-md-3 text-center">
        <div className="counter display-5 fw-bold text-success mb-2">500+</div>
        <p className="text-muted mb-0">Happy Users</p>
      </div>
      <div className="col-6 col-md-3 text-center">
        <div className="counter display-5 fw-bold text-success mb-2">15+</div>
        <p className="text-muted mb-0">Community Partners</p>
      </div>
      <div className="col-6 col-md-3 text-center">
        <div className="counter display-5 fw-bold text-success mb-2">24/7</div>
        <p className="text-muted mb-0">Dedicated Support</p>
      </div>
    </div>
  </div>
</section>


    </div>
  );
};

export default AboutUs;