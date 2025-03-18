import polymartLogo from "./images/polymart-logo.png";

export default function Header2() {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary custom-navbar navbar" id="navbar">
        {/* Container for Navbar */}
        <div className="container-fluid">
          {/* Brand Logo */}
          <a className="navbar-brand" href="#">
            <img src={polymartLogo} alt="Polymart Logo" className="logo" /> Polymart EStore
          </a>

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
            
            {/* Search Bar (Centered) */}
            <form className="d-flex search-form mx-auto">
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-success" type="submit">Search</button>
            </form>

            {/* Navbar Menu (Right Aligned) */}
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0" id="navbar">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Home
                </a>
                <ul className="dropdown-menu dropdown-menu-end"> {/* Aligns to the right */}
                  <li><a className="dropdown-item" href="#">Dashboard</a></li>
                  <li><a className="dropdown-item" href="#">Profile</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#">Settings</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Link</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Contact</a>
              </li>
            </ul>
          </div>
          <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
                    <button className="btn" id="login_btn">Login</button>
                    
                    <span id="cart" className="ml-3">Cart
                    {
                   //<img src={cart} alt="Polymart Logo" width={"35px"}/> 
                    }
                   </span>
                    <span className="ml-1" id="cart_count">2</span>
                </div>
        </div>
      </nav>
    </>
  );
}
