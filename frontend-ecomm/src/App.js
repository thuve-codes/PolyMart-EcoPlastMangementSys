import React from 'react';
import './App.css';
import Footer from './components/Footer';
import Header2 from './components/Header2';
import Home from './pages/Home';
import Chatpage from './pages/chatpage';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductDetail from './pages/ProductDetail';
import MyOrders from './pages/MyOrder'; // Changed variable name to start with capital letter
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cart from './pages/Cart';

// Stripe imports
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripepubkey=process.env.REACT_APP_STRIPE_PUB_KEY;


// Load your Stripe public key
const stripePromise = loadStripe(stripepubkey);
console.log(`"${stripepubkey}"`);  // Log the public key to confirm it's correct


function App() {
  const [cartItems, setCartItems] = useState([]);

  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer position='top-center' theme='dark' />
        <Header2 cartItems={cartItems} />
        
        <main> {/* Better semantic HTML */}
          {/* Wrap Routes in Elements provider to enable Stripe */}
          <Elements stripe={stripePromise}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Home />} />
              <Route 
                path="/product/:id" 
                element={<ProductDetail cartItems={cartItems} setCartItems={setCartItems} />} 
              />
              <Route path="/chat" element={<Chatpage />} /> {/* Fixed path and element */}
              <Route path="/orders" element={<MyOrders />} /> {/* Fixed variable name and path */}
              <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
            </Routes>
          </Elements>
        </main>
        
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
