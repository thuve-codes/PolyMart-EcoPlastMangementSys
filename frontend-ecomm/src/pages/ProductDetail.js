import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ChatPopup from "../components/Chatpopup"; // Ensure correct path

export default function ProductDetail({ cartItems, setCartItems }) {
    const API_URL = "http://localhost:5001";
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [isPopupOpen, setIsPopupOpen] = useState(false); // State for popup

    const { id } = useParams();

    useEffect(() => {
        fetch(`${API_URL}/api/v1/product/` + id)
            .then(response => response.json())
            .then(response => setProduct(response.product))
            .catch(error => console.error("Error fetching product:", error));
    }, [id]);

    function addToCart() {
        if (!product) return;
        const itemExist = cartItems.find((item) => item.product._id === product._id);
        if (!itemExist) {
            const newItem = { product, qty };
            setCartItems((state) => [...state, newItem]);
            toast.success('Item added to cart Successfully');
        } else {
            toast.warning('Item already in cart');
        }
    }

    function increaseQty() {
        if (product && qty < product.stock) {
            setQty((prevQty) => prevQty + 1);
        }
    }

    function decreaseQty() {
        if (qty > 1) setQty((state) => state - 1);
    }

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    return (
        product &&
        <div className="container container-fluid">
            <div className="row f-flex justify-content-around">
                <div className="col-12 col-lg-5 img-fluid" id="product_image">
                    <img src={product.images[0].image} alt="Product" height="500" width="500" />
                </div>

                <div className="col-12 col-lg-5 mt-5">
                    <h3>{product.name}</h3>
                    <p id="product_id">Product # {product._id}</p>
                    <hr />

                    <div className="rating-outer">
                        <div className="rating-inner" style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
                    </div>

                    <hr />

                    <p id="product_price">${product.price}</p>
                    <div className="stockCounter d-inline">
                        <button className="btn btn-danger minus" onClick={decreaseQty}>-</button>
                        <input type="number" className="form-control count d-inline" value={qty} readOnly />
                        <button className="btn btn-primary plus" onClick={increaseQty}>+</button>
                    </div>

                    <button 
                        type="button" 
                        onClick={addToCart} 
                        disabled={product.stock === 0} 
                        id="cart_btn" 
                        className="btn btn-primary d-inline ml-4"
                    >
                        Add to Cart
                    </button>

                    <hr />

                    <p>Status: 
                        <span id="stock_status" className={product.stock > 0 ? 'text-success' : 'text-danger'}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </p>

                    <hr />

                    <h4 className="mt-2">Description:</h4>
                    <p>{product.description}</p>

                    <hr />
                    <p id="product_seller mb-3">
                        Sold by: <strong>{product.seller}</strong>
                    </p>

                    <div className="rating w-50">
                        {/* Button to toggle chat popup */}
                        <button onClick={togglePopup} style={{ padding: "10px 20px", cursor: "pointer" }}>
                            Chat with Seller
                        </button>
                        
                        {/* Chat Popup */}
                        {isPopupOpen && (
                            <ChatPopup
                                productName={product.name}
                                sellerName={product.seller}
                                isOpen={isPopupOpen}
                                togglePopup={togglePopup}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
