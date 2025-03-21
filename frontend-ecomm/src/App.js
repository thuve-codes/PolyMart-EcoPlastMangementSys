import './App.css';
import Footer from './components/Footer';
import Header2 from './components/Header2';
import Home from './pages/Home';
import { useState } from 'react';

import { BrowserRouter , Router,Routes, Route } from 'react-router-dom';
import ProductDetail from './pages/ProductDetail';

import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cart from './pages/Cart';


function App() {

  const [cartItems, setCartItems] = useState([]);

  return (
    <div className="App">
      <BrowserRouter>
      <ToastContainer position='top-center' theme='dark'/>
      <Header2 cartItems={cartItems}/>
        <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail cartItems={cartItems} setCartItems={setCartItems}/>} />
          <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems}/>} />
        </Routes>
        </div>
        
        <Footer />

        </BrowserRouter>
    </div>
  );
}

export default App;
