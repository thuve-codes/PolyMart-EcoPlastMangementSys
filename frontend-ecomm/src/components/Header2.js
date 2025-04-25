import { Link, useLocation } from "react-router-dom";
import polymartLogo from "./images/polymart-logo.png";
import { FaShoppingCart } from "react-icons/fa";  // Importing a cart icon and search icon

export default function Header2({ cartItems }) {
  const location = useLocation();  // Get the current route

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark custom-navbar" id="navbar">
      <div className="container-fluid">
        {/* Brand Logo */}
        <div className="navbar-brand navname" href="#">
          <Link to="/">
            <img
              src={polymartLogo}
              alt="Polymart Logo"
              className="logo"
              style={{ maxHeight: '50px', objectFit: 'contain' }} // Resize the logo
            />{" "}
            Poly EStore
          </Link>
        </div>

        {/* Navbar Toggle Button for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div className="col-12 col-md-6 mt-2 mt-md-0"></div>

          

          {/* Navbar Menu (Right Aligned) */}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0" id="navbar">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-link navname ${location.pathname === '/' ? 'active' : ''}`}
              >
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link 
                to="/orders" 
                className={`nav-link navname ${location.pathname === '/orders' ? 'active' : ''}`}
              >
                My Orders
              </Link>
            </li>

            <li className="nav-item">
              <a className="nav-link navname" href="#">Link</a>
            </li>

            <li className="nav-item">
              <a className="nav-link navname" href="#">Contact</a>
            </li>
          </ul>
        </div>

        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
          <button className="btn navname" id="login_btn">Login</button>
          <Link to="/cart">
            <span id="cart" className="ml-3 navname">
              <FaShoppingCart size={20} /> {/* Cart Icon */}
            </span>
            <span className="ml-1 navname" id="cart_count">{cartItems.length}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
