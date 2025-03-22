import React, { Fragment, useEffect,useState } from 'react'
import ProductCard from '../components/ProductCard';
import Search from '../components/Search';
import { useSearchParams } from 'react-router-dom';

const API_URL = "http://localhost:5001";

export default function Home() { 

    const [products, setProducts] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
        useEffect(() => {
            fetch(`${API_URL}/api/v1` + '/products?'+searchParams)   
            .then(response => response.json())
            .then(response => setProducts(response.products))
        },[searchParams])

    return (
    <Fragment> <Search />
    <h1 id="products_heading">Latest Products</h1>
   

    <section id="products" className="container mt-5">
      <div className="row">
        {products.map(product => <ProductCard product={product}/> )}
      </div>
    </section>



    </Fragment>
    );
    }