import { Link } from "react-router-dom";
import polymartLogo from "./images/polymart-logo.png";


export default function Header2({cartItems}) {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary custom-navbar navbar" id="navbar">
        {/* Container for Navbar */}
        <div className="container-fluid">
          {/* Brand Logo */}
          
          <div className="navbar-brand navname" href="#">
           <Link to={'/'}><img src={polymartLogo} alt="Polymart Logo" className="logo" /> Poly EStore </Link>
          
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
            
          <div className="col-12 col-md-6 mt-2 mt-md-0">
               
           </div>            

            {/* Navbar Menu (Right Aligned) */}
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0" id="navbar">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle navname"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Home
                </a>
                <ul className="dropdown-menu dropdown-menu-end"> {/* Aligns to the right */}
                  <li><a className="dropdown-item navname" href="#" >Dashboard</a></li>
                  <li><a className="dropdown-item navname" href="#">Profile</a></li>
                  <li><hr className="dropdown-divider navname" /></li>
                  <li><a className="dropdown-item navname" href="#">Settings</a></li>
                </ul>
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
                    <Link to={"/cart"}>
                    
                    <span id="cart" className="ml-3 navname">Cart
                    {
                   //<img src={cart} alt="Polymart Logo" width={"35px"}/> 
                    }
                   </span>
                    <span className="ml-1 navname" id="cart_count">{cartItems.length}</span>
                    </Link>
                </div>
        </div>
      </nav>
    </>
  );
}
