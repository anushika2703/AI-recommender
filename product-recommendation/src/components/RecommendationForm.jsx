import React, { useState } from 'react';
import './recommendationForm.css';

const RecommendationForm = ({ onRecommend, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!disabled) {
      onRecommend(input);
    }
  };

  return (
    <form className="recommendation-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="e.g. I want a phone under $500"
        value={input}
        onChange={e => setInput(e.target.value)}
        required
        disabled={disabled}
      />
      <button type="submit" disabled={disabled}>
        {disabled ? 'Loading...' : 'Get Recommendations'}
      </button>
    </form>
  );
};
export default RecommendationForm;
