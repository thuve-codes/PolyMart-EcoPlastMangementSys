import React,{useEffect } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import AboutUs from './pages/AboutUs'; // Changed import to match the file name
import Home from './pages/Home';
//import Chatpage from './pages/chatpage';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductDetail from './pages/ProductDetail';
import MyOrders from './pages/MyOrder'; // Changed variable name to start with capital letter
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cart from './pages/Cart';


import '@fortawesome/fontawesome-free/css/all.min.css';

// Stripe imports
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripepubkey=process.env.REACT_APP_STRIPE_PUB_KEY;


// Load your Stripe public key
const stripePromise = loadStripe(stripepubkey);
console.log(`"${stripepubkey}"`);  // Log the public key to confirm it's correct


function App() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loginChannel = new BroadcastChannel('auth_channel');

    loginChannel.onmessage = (event) => {
      const { type, username, token } = event.data;

      if (type === 'LOGIN') {
        localStorage.setItem('username', username);
        localStorage.setItem('token', token);
        window.location.reload(); // Refresh app to reflect login
      }

      if (type === 'LOGOUT') {
        localStorage.clear();
        window.location.href = '/';
      }
    };

    return () => loginChannel.close(); // Cleanup on unmount
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer position='top-center' theme='dark' />
        <Header cartItems={cartItems} />
        
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
              {/* <Route path="/chat" element={<Chatpage />} /> Fixed path and element */}
              <Route path="/orders" element={<MyOrders />} /> {/* Fixed variable name and path */}
              <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
              <Route path="/aboutus" element={<AboutUs />} />
            </Routes>
          </Elements>
        </main>
        
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
