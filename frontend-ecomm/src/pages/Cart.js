import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPlus, FaMinus, FaTrash, FaArrowLeft, FaCreditCard, FaMapMarkerAlt, FaUser } from "react-icons/fa";


export default function Cart({ cartItems, setCartItems }) {
  const [activeStep, setActiveStep] = useState("cart"); // 'cart', 'checkout', 'complete'
  const API_URL = "http://localhost:5001";

  // Example for your Product component
function addToCartHandler(product) {
  if (product.stock <= 0) {
    toast.error('This product is out of stock');
    return;
  }

  setCartItems(prevItems => {
    const existingItem = prevItems.find(item => item.product._id === product._id);
    
    if (existingItem) {
      if (existingItem.qty >= product.stock) {
        toast.error(`Only ${product.stock} available in stock`);
        return prevItems;
      }
      return prevItems.map(item =>
        item.product._id === product._id
          ? { ...item, qty: item.qty + 1 }
          : item
      );
    } else {
      return [...prevItems, { product, qty: 1 }];
    }
  });
  
  toast.success(`${product.name} added to cart`);
}

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  function increaseQty(item) {
    if (item.product.stock <= item.qty) {
      toast.warning(`Only ${item.product.stock} available in stock`);
      return;
    }
    const updatedItems = cartItems.map((i) =>
      i.product._id === item.product._id ? { ...i, qty: i.qty + 1 } : i
    );
    setCartItems(updatedItems);
  }
  
  function decreaseQty(item) {
    if (item.qty > 1) {
      const updatedItems = cartItems.map((i) =>
        i.product._id === item.product._id ? { ...i, qty: i.qty - 1 } : i
      );
      setCartItems(updatedItems);
    }
  }
  
  function removeItem(item) {
    const updatedItems = cartItems.filter((i) => i.product._id !== item.product._id);
    setCartItems(updatedItems);
    toast.success(`${item.product.name} removed from cart`);
  }

  async function placeOrderHandler(e) {
    e.preventDefault();
    
    // Validate all form fields
    const emptyFields = Object.entries(formData).some(([key, value]) => {
      // Skip CVV validation here if you have separate validation
      if (key === 'cvv') return false;
      return value.trim() === "";
    });
  
    if (emptyFields) {
      toast.error("All fields are required!");
      return;
    }
  
    // Validate card details
    if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      toast.error("Please enter a valid 16-digit card number");
      return;
    }
  
    if (!/^\d{3,4}$/.test(formData.cvv)) {
      toast.error("Please enter a valid CVV (3 or 4 digits)");
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/api/v1/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems,
          formData,
          subtotal,
          shipping,
          tax,
          total
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to plac0e order2121131161');
      }
  
      if (data.success) {
        setCartItems([]);
        setActiveStep("complete");
        toast.success("Order Confirmed!");
      } else {
        if (data.stockIssues) {
          // Handle stock issues
          data.stockIssues.forEach(issue => {
            toast.error(`${issue.name}: ${issue.error}${issue.available ? ` (Available: ${issue.available})` : ''}`);
          });
          
          // Remove problematic items from cart
          const updatedCart = cartItems.filter(item => 
            !data.stockIssues.some(issue => issue.productId === item.product._id)
          );
          setCartItems(updatedCart);
        } else {
          toast.error(data.error || "Failed to placepjkk order");
        }
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error(error.message || "Failed to place order. Please try again.");
    }
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.qty, 0);
  const shipping = subtotal > 5000 ? 0 : 250;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  if (activeStep === "complete") {
    return (
      <div className="order-complete">
        <div className="complete-card">
          <div className="checkmark">✓</div>
          <h2>Order Confirmed!</h2>
          <p>Thank you for your purchase. Your order has been received.</p>
          <Link to="/" className="btn continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return cartItems.length > 0 ? (
    <Fragment>
      <div className="cart-container">
        {activeStep === "checkout" && (
          <button className="back-to-cart" onClick={() => setActiveStep("cart")}>
            <FaArrowLeft /> Back to Cart
          </button>
        )}
        
        <div className="cart-content">
          {activeStep === "cart" ? (
            <>
              <div className="cart-items-section">
                <h2 className="cart-title">
                  Your Shopping Cart <span>({totalItems} items)</span>
                </h2>
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div key={item.product._id} className="cart-item">
                      <div className="item-image-container">
                        <img
                          src={item.product.images[0].image}
                          alt={item.product.name}
                          className="cart-item-image"
                        />
                      </div>
                      <div className="cart-item-details">
                        <div className="item-info">
                          <Link to={`/product/${item.product._id}`} className="cart-item-name">
                            {item.product.name}
                          </Link>
                          <p className="cart-item-price">Rs {item.product.price.toLocaleString()}</p>
                        </div>
                        <div className="item-controls">
                        <div className="quantity-control">
  <button
    className="qty-btn"
    onClick={() => decreaseQty(item)}
    disabled={item.qty <= 1}
    data-tooltip="Decrease quantity"
  >
    <FaMinus />
  </button>
  <span className="quantity">{item.qty}</span>
  <button
    className="qty-btn"
    onClick={() => increaseQty(item)}
    disabled={item.qty >= item.product.stock}
    data-tooltip="Increase quantity"
  >
    <FaPlus />
  </button>
</div>
<button 
  className="remove-btn" 
  onClick={() => removeItem(item)}
  data-tooltip="Remove item"
>
  <FaTrash /> Remove
</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-summary-section">
  <div className="order-summary">
    <h3>Order Summary</h3>
    <div className="summary-row">
      <span>Subtotal</span>
      <span>Rs {subtotal.toLocaleString()}</span>
    </div>
    <div className="summary-row">
      <span>Shipping</span>
      <span>{shipping === 0 ? "FREE" : `Rs ${shipping}`}</span>
    </div>
    <div className="summary-row">
      <span>Tax (5%)</span>
      <span>Rs {tax.toFixed(2)}</span>
    </div>
    <div className="summary-row total">
      <span>Total</span>
      <span>Rs {total.toFixed(2)}</span>
    </div>
    <button
      className="checkout-btn"
      onClick={() => setActiveStep("checkout")}
    >
      Proceed to Checkout
    </button>
  </div>
</div>
            </>
          ) : (
            <div className="checkout-section">
              <div className="checkout-form-container">
                <h2>Checkout</h2>
                <div className="checkout-steps">
                  <div className={`step ${activeStep === "cart" ? "active" : ""}`}>
                    <span>1</span> Cart
                  </div>
                  <div className={`step ${activeStep === "checkout" ? "active" : ""}`}>
                    <span>2</span> Checkout
                  </div>
                  <div className={`step ${activeStep === "complete" ? "active" : ""}`}>
                    <span>3</span> Confirmation<br/>
                  </div>
                </div>
                
                <form onSubmit={placeOrderHandler} className="checkout-form">
                  <div className="form-section">
                    <br/>
                    <h3><FaUser /> Personal Information</h3>
                    <div className="form-group">
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Name"
                        required
                      />
                      

<input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        required
                      />
                      <input
                        type="number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        required
                      />

                    </div>
                  </div>
                  
                  <div className="form-section">
                    <h3><FaMapMarkerAlt /> Shipping Address</h3>
                    <div className="form-group">
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Street Address"
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="City"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          placeholder="Zip Code"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="Country"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-section">
                    <h3><FaCreditCard /> Payment Details</h3>
                    <div className="form-group">
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="Card Number"
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleChange}
                          placeholder="CVV"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="order-summary-checkout">
                    <h3>Order Summary</h3>
                    {cartItems.map((item) => (
                      <div key={item.product._id} className="checkout-item">
                        <span>
                          {item.product.name} × {item.qty}
                        </span>
                        <span>Rs {(item.product.price * item.qty).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>Rs {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? "FREE" : `Rs ${shipping}`}</span>
                    </div>
                    <div className="summary-row">
                      <span>Tax (5%)</span>
                      <span>Rs {tax.toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total</span>
                      <span>Rs {total.toFixed(2)}</span>
                    </div>
                    <button type="submit" className="place-order-btn">
                      Place Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  ) : (
    <div className="empty-cart">
      <div className="empty-cart-content">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet</p>
        <Link to="/" className="btn continue-shopping">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}