import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPlus, FaMinus, FaTrash, FaArrowLeft, FaCreditCard, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function Cart({ cartItems, setCartItems }) {
  const stripe = useStripe();
  const elements = useElements();
  const [activeStep, setActiveStep] = useState("cart"); // 'cart', 'checkout', 'complete'
  const API_URL = "http://localhost:5001";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "LK",
  });

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.qty, 0);
  const shipping = subtotal > 2500 ? 0 : 250;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Functions for cart manipulation
  const decreaseQty = (item) => {
    const updatedCart = cartItems.map((cartItem) =>
      cartItem.product._id === item.product._id && cartItem.qty > 1
        ? { ...cartItem, qty: cartItem.qty - 1 }
        : cartItem
    );
    setCartItems(updatedCart);
  };

  const increaseQty = (item) => {
    const updatedCart = cartItems.map((cartItem) =>
      cartItem.product._id === item.product._id && cartItem.qty < item.product.stock
        ? { ...cartItem, qty: cartItem.qty + 1 }
        : cartItem
    );
    setCartItems(updatedCart);
  };

  const removeItem = (item) => {
    const updatedCart = cartItems.filter((cartItem) => cartItem.product._id !== item.product._id);
    setCartItems(updatedCart);
  };

  // Stripe payment integration
  async function placeOrderHandler(e) {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe not loaded yet");
      return;
    }

    try {
      // Fetch payment intent client secret from backend first
      const paymentIntentRes = await fetch(`${API_URL}/api/v1/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: total * 100 // Stripe expects amount in cents
        }),
      });

      const { clientSecret } = await paymentIntentRes.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: {
              line1: formData.address,
              city: formData.city,
              postal_code: formData.zipCode,
              country: formData.country,
            },
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        // Now create the order in backend
        const orderResponse = await fetch(`${API_URL}/api/v1/order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartItems,
            formData,
            subtotal,
            shipping,
            tax,
            total,
            paymentIntentId: result.paymentIntent.id,
          }),
        });

        const orderData = await orderResponse.json();

        if (!orderResponse.ok) {
          throw new Error(orderData.error || "Failed to place order");
        }

        setCartItems([]);
        setActiveStep("complete");
        toast.success("Order placed successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Order placement failed");
    }
  }

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
                  <br/><h5>Buy morethan 2500 and get free shipping</h5>
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
                <form onSubmit={placeOrderHandler} className="checkout-form">
                  <div className="form-section">
                    <h3><FaUser /> Personal Information</h3>
                    <div className="form-group">
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Full Name"
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
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        required
                      />
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        placeholder="Zip Code"
                        required
                      />
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
                    <CardElement options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#424770',
                          '::placeholder': {
                            color: '#aab7c4',
                          },
                        },
                        invalid: {
                          color: '#9e2146',
                        },
                      },
                    }} />
                  </div>
                  <div className="order-summary-checkout">
                    <h3>Order Summary</h3>
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
      <h2>Your cart is empty!</h2>
      <Link to="/" className="btn continue-shopping">
        Continue Shopping
      </Link>
    </div>
  );
}


// import { Fragment, useState } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import { FaPlus, FaMinus, FaTrash, FaArrowLeft, FaCreditCard, FaMapMarkerAlt, FaUser } from "react-icons/fa";
// import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";


// const stripe = useStripe();
// const elements = useElements();


// export default function Cart({ cartItems, setCartItems }) {
//   const [activeStep, setActiveStep] = useState("cart"); // 'cart', 'checkout', 'complete'
//   const API_URL = "http://localhost:5001";

//   // Example for your Product component
//   async function placeOrderHandler(e) {
//     e.preventDefault();
    
//     // Validate all required fields
//     const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'zipCode', 'country'];
//     const missingFields = requiredFields.filter(field => !formData[field].trim());
  
//     if (missingFields.length > 0) {
//       toast.error(`Missing required fields: ${missingFields.join(', ')}`);
//       return;
//     }
  
//     // Validate payment details
//     const cardNum = formData.cardNumber.replace(/\s/g, '');
//     if (!/^\d{16}$/.test(cardNum)) {
//       toast.error('Invalid card number (must be 16 digits)');
//       return;
//     }
  
//     try {
//       const orderData = {
//         cartItems: cartItems.map(item => ({
//           product: {
//             _id: item.product._id,
//             name: item.product.name,
//             price: item.product.price
//           },
//           qty: item.qty
//         })),
//         formData: {
//           ...formData,
//           // Ensure phone is string (some validations expect string)
//           phone: String(formData.phone)
//         },
//         subtotal,
//         shipping,
//         tax,
//         total
//       };
  
//       const response = await fetch(`${API_URL}/api/v1/order`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(orderData)
//       });
  
//       const data = await response.json();
  
//       if (!response.ok) {
//         // Handle specific backend validation errors
//         if (data.error && data.error.includes('validation failed')) {
//           const validationErrors = Object.entries(data.errors || {})
//             .map(([field, error]) => `${field}: ${error.message}`);
//           toast.error(`Validation errors:\n${validationErrors.join('\n')}`);
//         } else {
//           throw new Error(data.message || 'Failed to place order');
//         }
//         return;
//       }
  
//       // Success case
//       setCartItems([]);
//       setActiveStep('complete');
//       toast.success('Order confirmed!');
      
//     } catch (error) {
//       console.error('Order error:', error);
//       toast.error(error.message || 'Failed to place order. Please try again.');
//     }
//   }

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     zipCode: "",
//     country: "",
//     cardNumber: "",
//     expiryDate: "",
//     cvv: "",
//   });

//   function increaseQty(item) {
//     if (item.product.stock <= item.qty) {
//       toast.warning(`Only ${item.product.stock} available in stock`);
//       return;
//     }
//     const updatedItems = cartItems.map((i) =>
//       i.product._id === item.product._id ? { ...i, qty: i.qty + 1 } : i
//     );
//     setCartItems(updatedItems);
//   }
  
//   function decreaseQty(item) {
//     if (item.qty > 1) {
//       const updatedItems = cartItems.map((i) =>
//         i.product._id === item.product._id ? { ...i, qty: i.qty - 1 } : i
//       );
//       setCartItems(updatedItems);
//     }
//   }
  
//   function removeItem(item) {
//     const updatedItems = cartItems.filter((i) => i.product._id !== item.product._id);
//     setCartItems(updatedItems);
//     toast.success(`${item.product.name} removed from cart`);
//   }

//   async function placeOrderHandler(e) {
//     e.preventDefault();
    
//     // Validate all form fields
//     const emptyFields = Object.entries(formData).some(([key, value]) => {
//       // Skip CVV validation here if you have separate validation
//       if (key === 'cvv') return false;
//       return value.trim() === "";
//     });
  
//     if (emptyFields) {
//       toast.error("All fields are required!");
//       return;
//     }
  
//     // Validate card details
//     if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
//       toast.error("Please enter a valid 16-digit card number");
//       return;
//     }
  
//     if (!/^\d{3,4}$/.test(formData.cvv)) {
//       toast.error("Please enter a valid CVV (3 or 4 digits)");
//       return;
//     }
  
//     try {
//       const response = await fetch(`${API_URL}/api/v1/order`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           cartItems,
//           formData,
//           subtotal,
//           shipping,
//           tax,
//           total
//         }),
//       });
  
//       const data = await response.json();
  
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to plac0e order2121131161');
//       }
  
//       if (data.success) {
//         setCartItems([]);
//         setActiveStep("complete");
//         toast.success("Order Confirmed!");
//       } else {
//         if (data.stockIssues) {
//           // Handle stock issues
//           data.stockIssues.forEach(issue => {
//             toast.error(`${issue.name}: ${issue.error}${issue.available ? ` (Available: ${issue.available})` : ''}`);
//           });
          
//           // Remove problematic items from cart
//           const updatedCart = cartItems.filter(item => 
//             !data.stockIssues.some(issue => issue.productId === item.product._id)
//           );
//           setCartItems(updatedCart);
//         } else {
//           toast.error(data.error || "Failed to placepjkk order");
//         }
//       }
//     } catch (error) {
//       console.error("Order error:", error);
//       toast.error(error.message || "Failed to place order. Please try again.");
//     }
//   }
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
//   const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.qty, 0);
//   const shipping = subtotal > 5000 ? 0 : 250;
//   const tax = subtotal * 0.05;
//   const total = subtotal + shipping + tax;

//   if (activeStep === "complete") {
//     return (
//       <div className="order-complete">
//         <div className="complete-card">
//           <div className="checkmark">✓</div>
//           <h2>Order Confirmed!</h2>
//           <p>Thank you for your purchase. Your order has been received.</p>
//           <Link to="/" className="btn continue-shopping">
//             Continue Shopping
//           </Link>
//         </div>
//       </div>
//     );
//   }



//   //Stripe payment integration
//   async function placeOrderHandler(e) {
//     e.preventDefault();
  
//     if (!stripe || !elements) {
//       toast.error("Stripe not loaded yet");
//       return;
//     }
  
//     try {
//       // Fetch payment intent client secret from backend first
//       const paymentIntentRes = await fetch(`${API_URL}/api/v1/create-payment-intent`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           amount: total * 100 // Stripe expects amount in cents
//         }),
//       });
  
//       const { clientSecret } = await paymentIntentRes.json();
  
//       const result = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//           billing_details: {
//             name: formData.fullName,
//             email: formData.email,
//             phone: formData.phone,
//             address: {
//               line1: formData.address,
//               city: formData.city,
//               postal_code: formData.zipCode,
//               country: formData.country,
//             },
//           },
//         },
//       });
  
//       if (result.error) {
//         toast.error(result.error.message);
//         return;
//       }
  
//       if (result.paymentIntent.status === "succeeded") {
//         // Now create the order in backend
//         const orderResponse = await fetch(`${API_URL}/api/v1/order`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             cartItems,
//             formData,
//             subtotal,
//             shipping,
//             tax,
//             total,
//             paymentIntentId: result.paymentIntent.id,
//           }),
//         });
  
//         const orderData = await orderResponse.json();
  
//         if (!orderResponse.ok) {
//           throw new Error(orderData.error || "Failed to place order");
//         }
  
//         setCartItems([]);
//         setActiveStep("complete");
//         toast.success("Order placed successfully!");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error(error.message || "Order placement failed");
//     }
//   }
  
//   return cartItems.length > 0 ? (
//     <Fragment>
//       <div className="cart-container">
//         {activeStep === "checkout" && (
//           <button className="back-to-cart" onClick={() => setActiveStep("cart")}>
//             <FaArrowLeft /> Back to Cart
//           </button>
//         )}
        
//         <div className="cart-content">
//           {activeStep === "cart" ? (
//             <>
//               <div className="cart-items-section">
//                 <h2 className="cart-title">
//                   Your Shopping Cart <span>({totalItems} items)</span>
//                 </h2>
//                 <div className="cart-items">
//                   {cartItems.map((item) => (
//                     <div key={item.product._id} className="cart-item">
//                       <div className="item-image-container">
//                         <img
//                           src={item.product.images[0].image}
//                           alt={item.product.name}
//                           className="cart-item-image"
//                         />
//                       </div>
//                       <div className="cart-item-details">
//                         <div className="item-info">
//                           <Link to={`/product/${item.product._id}`} className="cart-item-name">
//                             {item.product.name}
//                           </Link>
//                           <p className="cart-item-price">Rs {item.product.price.toLocaleString()}</p>
//                         </div>
//                         <div className="item-controls">
//                         <div className="quantity-control">
//   <button
//     className="qty-btn"
//     onClick={() => decreaseQty(item)}
//     disabled={item.qty <= 1}
//     data-tooltip="Decrease quantity"
//   >
//     <FaMinus />
//   </button>
//   <span className="quantity">{item.qty}</span>
//   <button
//     className="qty-btn"
//     onClick={() => increaseQty(item)}
//     disabled={item.qty >= item.product.stock}
//     data-tooltip="Increase quantity"
//   >
//     <FaPlus />
//   </button>
// </div>
// <button 
//   className="remove-btn" 
//   onClick={() => removeItem(item)}
//   data-tooltip="Remove item"
// >
//   <FaTrash /> Remove
// </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div className="order-summary-section">
//   <div className="order-summary">
//     <h3>Order Summary</h3>
//     <div className="summary-row">
//       <span>Subtotal</span>
//       <span>Rs {subtotal.toLocaleString()}</span>
//     </div>
//     <div className="summary-row">
//       <span>Shipping</span>
//       <span>{shipping === 0 ? "FREE" : `Rs ${shipping}`}</span>
//     </div>
//     <div className="summary-row">
//       <span>Tax (5%)</span>
//       <span>Rs {tax.toFixed(2)}</span>
//     </div>
//     <div className="summary-row total">
//       <span>Total</span>
//       <span>Rs {total.toFixed(2)}</span>
//     </div>
//     <button
//       className="checkout-btn"
//       onClick={() => setActiveStep("checkout")}
//     >
//       Proceed to Checkout
//     </button>
//   </div>
// </div>
//             </>
//           ) : (
//             <div className="checkout-section">
//               <div className="checkout-form-container">
//                 <h2>Checkout</h2>
//                 <div className="checkout-steps">
//                   <div className={`step ${activeStep === "cart" ? "active" : ""}`}>
//                     <span>1</span> Cart
//                   </div>
//                   <div className={`step ${activeStep === "checkout" ? "active" : ""}`}>
//                     <span>2</span> Checkout
//                   </div>
//                   <div className={`step ${activeStep === "complete" ? "active" : ""}`}>
//                     <span>3</span> Confirmation<br/>
//                   </div>
//                 </div>
                
//                 <form onSubmit={placeOrderHandler} className="checkout-form">
//                   <div className="form-section">
//                     <br/>
//                     <h3><FaUser /> Personal Information</h3>
//                     <div className="form-group">
//                       <input
//                         type="text"
//                         name="fullName"
//                         value={formData.fullName}
//                         onChange={handleChange}
//                         placeholder="Name"
//                         required
//                       />
                      

//                     <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         placeholder="Email Address"
//                         required
//                       />
//                       <input
//                         type="number"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleChange}
//                         placeholder="Phone Number"
//                         required
//                       />

//                     </div>
//                   </div>
//                   {/*→ Stripe does NOT allow you to collect raw card details using normal inputs (for security/PCI-DSS rules).
//                   → You must use Stripe's CardElement or Stripe Elements to securely handle card numbers, expiry, CVV etc.8→*/}
//                   <div className="form-section">
//                     <h3><FaMapMarkerAlt /> Shipping Address</h3>
//                     <div className="form-group">
//                       <input
//                         type="text"
//                         name="address"
//                         value={formData.address}
//                         onChange={handleChange}
//                         placeholder="Street Address"
//                         required
//                       />
//                     </div>
//                     <div className="form-row">
//                       <div className="form-group">
//                         <input
//                           type="text"
//                           name="city"
//                           value={formData.city}
//                           onChange={handleChange}
//                           placeholder="City"
//                           required
//                         />
//                       </div>
//                       <div className="form-group">
//                         <input
//                           type="text"
//                           name="zipCode"
//                           value={formData.zipCode}
//                           onChange={handleChange}
//                           placeholder="Zip Code"
//                           required
//                         />
//                       </div>
//                     </div>
//                     <div className="form-group">
//                       <input
//                         type="text"
//                         name="country"
//                         value={formData.country}
//                         onChange={handleChange}
//                         placeholder="Country"
//                         required
//                       />
//                     </div>
//                   </div><div className="form-section">
//                   <h3><FaCreditCard /> Payment Details</h3>
//                   <div className="form-group">
//                     <CardElement options={{
//                       style: {
//                         base: {
//                           fontSize: '16px',
//                           color: '#424770',
//                           '::placeholder': {
//                             color: '#aab7c4',
//                           },
//                         },
//                         invalid: {
//                           color: '#9e2146',
//                         },
//                       },
//                     }} />
//                   </div>

//                 </div>

                  
               
                  
//                   <div className="order-summary-checkout">
//                     <h3>Order Summary</h3>
//                     {cartItems.map((item) => (
//                       <div key={item.product._id} className="checkout-item">
//                         <span>
//                           {item.product.name} × {item.qty}
//                         </span>
//                         <span>Rs {(item.product.price * item.qty).toLocaleString()}</span>
//                       </div>
//                     ))}
//                     <div className="summary-row">
//                       <span>Subtotal</span>
//                       <span>Rs {subtotal.toLocaleString()}</span>
//                     </div>
//                     <div className="summary-row">
//                       <span>Shipping</span>
//                       <span>{shipping === 0 ? "FREE" : `Rs ${shipping}`}</span>
//                     </div>
//                     <div className="summary-row">
//                       <span>Tax (5%)</span>
//                       <span>Rs {tax.toFixed(2)}</span>
//                     </div>
//                     <div className="summary-row total">
//                       <span>Total</span>
//                       <span>Rs {total.toFixed(2)}</span>
//                     </div>
//                     <button type="submit" className="place-order-btn">
//                       Place Order
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </Fragment>
//   ) : (
//     <div className="empty-cart">
//       <div className="empty-cart-content">
//         <div className="empty-cart-icon">🛒</div>
//         <h2>Your cart is empty</h2>
//         <p>Looks like you haven't added anything to your cart yet</p>
//         <Link to="/" className="btn continue-shopping">
//           Continue Shopping
//         </Link>
//       </div>
//     </div>
//   );
// }