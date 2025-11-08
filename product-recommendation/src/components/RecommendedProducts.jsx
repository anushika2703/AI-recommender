import React from 'react';
import './recommendedProducts.css';

const RecommendedProducts = ({ results }) => (
  <div className="recommended-products">
    <h3>AI Recommendations</h3>
    {results.length > 0 ? (
      <ul>
        {results.map(product => (
          <li key={product.id}>
            <strong>{product.name}</strong> — {product.price}
          </li>
        ))}
      </ul>
    ) : (
      <p>No recommendations yet.</p>
    )}
  </div>
);
export default RecommendedProducts;
