import React from 'react';
import './productList.css';

const ProductList = ({ products, onSelect }) => (
  <div className="product-list">
    <h2>All Products</h2>
    <ul>
      {products.map(product => (
        <li key={product.id} onClick={() => onSelect(product)}>
          <strong>{product.name}</strong> — {product.price}
        </li>
      ))}
    </ul>
  </div>
);
export default ProductList;
