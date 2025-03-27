import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ChatPopup from "../components/Chatpopup";

export default function ProductDetail({ cartItems, setCartItems }) {
    const API_URL = "http://localhost:5001";
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const { id } = useParams();

    useEffect(() => {
        fetch(`${API_URL}/api/v1/product/` + id)
            .then(response => response.json())
            .then(response => {
                // Ensure price is a number
                const productData = response.product;
                productData.price = Number(productData.price);
                setProduct(productData);
            })
            .catch(error => console.error("Error fetching product:", error));
    }, [id]);

    function addToCart() {
        if (!product) return;
        
        if (product.stock === 0) {
            toast.error('This item is out of stock and cannot be added to cart');
            return;
        }
        
        if (qty > product.stock) {
            toast.error(`Only ${product.stock} items available in stock`);
            return;
        }
        
        const itemExist = cartItems.find((item) => item.product._id === product._id);
        if (!itemExist) {
            const newItem = { product, qty };
            setCartItems((state) => [...state, newItem]);
            toast.success('Item added to cart successfully');
        } else {
            toast.warning('Item already in cart');
        }
    }

    function increaseQty() {
        if (product && qty < product.stock) {
            setQty((prevQty) => prevQty + 1);
        } else {
            toast.info(`Maximum available quantity is ${product.stock}`);
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
                    <img 
                        src={product.images[0].image} 
                        alt={product.name} 
                        height="500" 
                        width="500" 
                        style={{ objectFit: 'contain' }}
                    />
                </div>

                <div className="col-12 col-lg-5 mt-5">
                    <h3>{product.name}</h3>
                    <p id="product_id">Product # {product._id}</p>
                    <hr />

                    <div className="rating-outer">
                        <div 
                            className="rating-inner" 
                            style={{ width: `${(product.ratings / 5) * 100}%` }}
                        ></div>
                    </div>
                    {product.numOfReviews && (
                        <span id="no_of_reviews">({product.numOfReviews} reviews)</span>
                    )}

                    <hr />

                    <p id="product_price">Rs {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</p>
                    
                    <div className="stockCounter d-inline">
                        <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>
                        <input 
                            type="number" 
                            className="form-control count d-inline" 
                            value={qty} 
                            readOnly 
                        />
                        <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
                    </div>

                    <button 
                        type="button" 
                        onClick={addToCart} 
                        disabled={product.stock === 0} 
                        id="cart_btn" 
                        className="btn btn-primary d-inline ml-4"
                        style={{ opacity: product.stock === 0 ? 0.5 : 1 }}
                    >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>

                    <hr />

                    <p>Status: 
                        <span 
                            id="stock_status" 
                            className={product.stock > 0 ? 'text-success' : 'text-danger'}
                        >
                            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
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
                        <button 
                            onClick={togglePopup} 
                            className="btn btn-info mt-2"
                            style={{ padding: "10px 20px" }}
                        >
                            Chat with Seller
                        </button>
                        
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