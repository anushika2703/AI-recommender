import React, { useState } from 'react';
import ProductList from './components/ProductList';
import RecommendationForm from './components/RecommendationForm';
import RecommendedProducts from './components/RecommendedProducts';
import './styles/main.css';

const products = [
  { id: 1, name: "iPhone SE", price: "$399" },
  { id: 2, name: "Samsung Galaxy S21", price: "$499" },
  { id: 3, name: "Pixel 7", price: "$499" },
  { id: 4, name: "OnePlus Nord", price: "$349" }
];

function App() {
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const recommendProducts = async (preference) => {
    setLoading(true);
    setError(null);
    setRecommended([]);

    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const prefLower = preference.toLowerCase();
      
      // Smart product matching based on user preference
      const matchedProducts = products.filter(p => {
        const priceNum = parseInt(p.price.replace('$', ''));
        const nameLower = p.name.toLowerCase();
        
        // Extract price from preference (e.g., "under $500", "$400", "less than 450")
        const priceMatch = prefLower.match(/(?:under|below|less than|max|maximum|up to|at most|under|below)\s*\$?(\d+)/i) ||
                          prefLower.match(/\$(\d+)/) ||
                          prefLower.match(/(\d+)\s*(?:dollar|dollars|buck|bucks)/i);
        const prefPrice = priceMatch ? parseInt(priceMatch[1]) : null;
        
        // Check various matching criteria
        const matchesName = nameLower.includes(prefLower) || 
                           prefLower.includes(nameLower) ||
                           (prefLower.includes('iphone') && nameLower.includes('iphone')) ||
                           (prefLower.includes('samsung') && nameLower.includes('samsung')) ||
                           (prefLower.includes('pixel') && nameLower.includes('pixel')) ||
                           (prefLower.includes('oneplus') && nameLower.includes('oneplus')) ||
                           (prefLower.includes('google') && nameLower.includes('pixel'));
        
        const matchesPrice = prefPrice ? priceNum <= prefPrice : false;
        const matchesBudget = (prefLower.includes('cheap') || prefLower.includes('affordable') || prefLower.includes('budget')) && priceNum < 450;
        const matchesPremium = (prefLower.includes('premium') || prefLower.includes('high-end') || prefLower.includes('best')) && priceNum >= 450;
        const matchesMidRange = (prefLower.includes('mid') || prefLower.includes('medium')) && priceNum >= 400 && priceNum <= 500;
        
        return matchesName || matchesPrice || matchesBudget || matchesPremium || matchesMidRange;
      });

      if (matchedProducts.length > 0) {
        setRecommended(matchedProducts);
      } else {
        // If no matches, show all products as fallback
        setRecommended(products);
        setError("No specific matches found. Showing all available products.");
      }

      // Optional: Try Hugging Face API if token is configured (for future use)
      // This is commented out due to CORS issues when calling from browser
      /*
      const apiToken = process.env.REACT_APP_HF_TOKEN;
      if (apiToken) {
        try {
          const prompt = `From this product list: ${products
            .map(p => `${p.name}, ${p.price}`)
            .join("; ")}. Recommend products based on: "${preference}" and return only matching products as JSON array with id, name, price.`;

          const res = await axios.post(
            "https://api-inference.huggingface.co/models/meta-llama/Llama-2-70b-chat-hf",
            { inputs: prompt },
            {
              headers: {
                Authorization: `Bearer ${apiToken}`,
                "Content-Type": "application/json",
              }
            }
          );

          if (res.data?.error) {
            throw new Error(res.data.error);
          }

          if (res.data?.estimated_time) {
            throw new Error(`Model is loading. Please wait ${Math.ceil(res.data.estimated_time)} seconds and try again.`);
          }

          const text = res.data?.generated_text || res.data?.[0]?.generated_text || '';
          
          if (text) {
            const jsonMatch = text.match(/\[.*?\]/s);
            if (jsonMatch) {
              try {
                const matches = JSON.parse(jsonMatch[0]);
                setRecommended(matches);
                return;
              } catch (parseErr) {
                // Use fallback matching
              }
            }
          }
        } catch (apiErr) {
          console.warn("API call failed, using local matching:", apiErr);
          // Continue with local matching
        }
      }
      */
    } catch (err) {
      console.error("Recommendation error:", err);
      setError(err.message || "Could not fetch recommendations.");
      setRecommended([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Product Recommendation System</h1>
      <RecommendationForm onRecommend={recommendProducts} disabled={loading} />
      {loading && <p style={{ color: '#13315c', marginTop: '10px' }}>Loading recommendations...</p>}
      {error && (
        <div style={{ 
          background: '#fee', 
          color: '#c33', 
          padding: '10px', 
          borderRadius: '5px', 
          marginTop: '10px' 
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      <RecommendedProducts results={recommended} />
      <ProductList products={products} onSelect={() => {}} />
    </div>
  );
}

export default App;
