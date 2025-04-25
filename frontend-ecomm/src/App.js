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

function App() {
  const [cartItems, setCartItems] = useState([]);

  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer position='top-center' theme='dark' />
        <Header2 cartItems={cartItems} />
        
        <main> {/* Better semantic HTML */}
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
        </main>
        
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;