import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartThunk } from '../../redux/slices/cart.thunk';
import { productsAPI } from '../../services/api';
import { categoryDisplayNames } from '../../utils/constants';
import ProductCard from '../cards/ProductCard';

const ProductCategorySection = ({ category, products }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { wishlist } = useSelector(state => state.products);
  const [localWishlist, setLocalWishlist] = useState(new Set());

  useEffect(() => {
    setLocalWishlist(new Set(wishlist?.map(p => p._id) || []));
  }, [wishlist]);

  const getTopProductsByCategory = (category, limit = 3) => {
    return products
      .filter(p => p.category === category)
      .sort((a, b) => (b.expert_rating || 0) - (a.expert_rating || 0))
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

  const topProducts = getTopProductsByCategory(category);
  if (topProducts.length === 0) return null;

  const displayName = categoryDisplayNames[category] || category.toUpperCase();

  return (
    <section className="space-y-6 border-b-4 border-black pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-black">{displayName}...</h2>
          <p className="text-gray-600 font-bold mt-2">Expertly curated picks you'll love</p>
        </div>
        <Link
          to="/browse"
          state={{ category }}
          className="px-6 py-3 bg-black text-white rounded-full font-black hover:shadow-[4px_4px_0px_gray] transition-all flex items-center gap-2"
        >
          View All <ArrowRight size={18} />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {topProducts.map(product => (
          <ProductCard
            key={product._id}
            product={product}
            variant="category"
            onAddToCart={handleAddToCart}
            onWishlist={handleWishlist}
            isWishlisted={localWishlist.has(product._id)}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductCategorySection;
