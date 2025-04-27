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

// Load your Stripe public key
const stripePromise = loadStripe("pk_test_51RITe84gLRA5Z0ymYo5OqzxjQmB4hveFlxYRvFaON4L3emUQbxjxB696YCOP5xWNhySfLHFdcqqFnil0qNEyT92o00oIVxx6d0");

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
