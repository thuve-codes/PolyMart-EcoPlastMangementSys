import React from 'react';
import polymartLogo from './images/polymart-logo.png';
import cart from './images/shopping-cart.png';

export default function Header() {  
    return (
            <nav className="navbar row">
                <div className="col-12 col-md-3">
                    <div className="navbar-brand">
                        <img src={polymartLogo} alt="Polymart Logo" width={"150px"} />
                    </div>
                </div>
                <div className="col-12 col-md-6 mt-2 mt-md-0">
                    <form>
                        <div className="input-group">
                            <input
                                type="text"
                                id="search_field"
                                className="form-control"
                                placeholder="Enter Product Name ..."
                            />
                            <div className="input-group-append">
                                <button id="search_btn" className="btn">
                                    <i className="fa fa-search" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    </form>
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
            </nav>
    )
}