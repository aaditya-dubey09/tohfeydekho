import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { productsAPI } from '../../services/api';
import ProductCard from '../cards/ProductCard';

const RecommendationsGrid = ({ recommendations, onAddToCart, title, subtitle }) => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { wishlist } = useSelector(state => state.products);
  const [localWishlist, setLocalWishlist] = useState(new Set());

  useEffect(() => {
    setLocalWishlist(new Set(wishlist?.map(p => p._id) || []));
  }, [wishlist]);

  const handleWishlist = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      await productsAPI.toggleWishlist(productId);
      setLocalWishlist(prev => {
        const newSet = new Set(prev);
        if (newSet.has(productId)) {
          newSet.delete(productId);
        } else {
          newSet.add(productId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Wishlist error:', error);
    }
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">No recommendations found.</h2>
      </div>
    );
  }

  const resolvedTitle = title || 'Your Curated Picks';
  const resolvedSubtitle = subtitle || `Based on your preferences, we found these ${recommendations.length} perfect products.`;

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">{resolvedTitle}</h1>
        <p className="text-gray-600">{resolvedSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            variant="default"
            onAddToCart={onAddToCart}
            onWishlist={handleWishlist}
            isWishlisted={localWishlist.has(product._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendationsGrid;
