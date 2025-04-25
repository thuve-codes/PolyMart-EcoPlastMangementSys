import React, { Fragment, useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';  // Importing the search icon

const API_URL = "http://localhost:5001";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // Get the search query from the URL (if any)
  const keyword = searchParams.get("keyword") || '';

  useEffect(() => {
    // Trigger search when searchParams change (i.e., when the keyword changes)
    fetch(`${API_URL}/api/v1/products?keyword=${keyword}`)
      .then(response => response.json())
      .then(response => setProducts(response.products));
  }, [keyword]);  // Effect runs when the keyword changes

  const handleSearchChange = (e) => {
    const newKeyword = e.target.value.trim();
    // Update searchParams with the new keyword
    setSearchParams({ keyword: newKeyword });
  };

  return (
    <Fragment>
      {/* Redesigned Search Bar */}
      <div className="search-container">
        <input 
          type="text"
          className="search-input"
          placeholder="Search for products..."
          value={keyword}  // Bind value to searchParams
          onChange={handleSearchChange}  // Update searchParams on input change
        />
        <button className="search-btn">
          <FaSearch />
        </button>
      </div>

      <h1 id="products_heading">Latest Products</h1>

      <section id="products" className="container mt-5">
        <div className="row">
          {products.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </Fragment>
  );
}
