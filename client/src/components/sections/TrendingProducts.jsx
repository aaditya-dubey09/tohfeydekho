import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartThunk } from '../../redux/slices/cart.thunk';
import { productsAPI } from '../../services/api';
import ProductCard from '../cards/ProductCard';

const TrendingProducts = ({ products }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { wishlist } = useSelector(state => state.products);
  const [localWishlist, setLocalWishlist] = useState(new Set());

  useEffect(() => {
    setLocalWishlist(new Set(wishlist?.map(p => p._id) || []));
  }, [wishlist]);

  const getTrendingProducts = (limit = 6) => {
    return products
      .filter(p => p.is_visible)
      .sort((a, b) => {
        const scoreA = (a.wishlist_count || 0) * 3 + (a.cart_count || 0) * 2 + (a.views || 0) * 0.1;
        const scoreB = (b.wishlist_count || 0) * 3 + (b.cart_count || 0) * 2 + (b.views || 0) * 0.1;
        return scoreB - scoreA;
      })
      .slice(0, limit);
  };

  const handleAddToCart = (productId) => {
    dispatch(addToCartThunk(productId));
  };

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

  const trendingProducts = getTrendingProducts();
  if (trendingProducts.length === 0) return null;

  return (
    <section className="space-y-6 border-b-4 border-black pb-12">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl">
          <TrendingUp size={28} className="text-white" />
        </div>
        <div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter">TRENDING NOW</h2>
          <p className="text-gray-600 font-bold mt-1">Most loved gifts right now</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {trendingProducts.map(product => (
          <ProductCard
            key={product._id}
            product={product}
            variant="compact"
            onAddToCart={handleAddToCart}
            onWishlist={handleWishlist}
            isWishlisted={localWishlist.has(product._id)}
          />
        ))}
      </div>
    </section>
  );
};

export default TrendingProducts;
