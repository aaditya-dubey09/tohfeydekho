import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartThunk } from '../redux/slices/cart.thunk';
import { productsAPI } from '../services/api';
import ProductCard from '../components/cards/ProductCard';

const Wishlist = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localWishlist, setLocalWishlist] = useState(new Set());
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { wishlist } = useSelector(state => state.products);

  useEffect(() => {
    setLocalWishlist(new Set(wishlist?.map(p => p._id) || []));
  }, [wishlist]);

  const fetchWishlist = async () => {
    try {
      const { data } = await productsAPI.getWishlist();
      setWishlistProducts(data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

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
      fetchWishlist();
    } catch (error) {
      console.error('Wishlist error:', error);
    }
  };

  if (loading) return <div className="py-20 text-center">Loading...</div>;

  return (
    <div className="space-y-12">
      <h1 className="text-4xl font-black">Your Wishlist</h1>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem]">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-xl font-bold text-gray-500">Your wishlist is empty</p>
          <Link to="/quiz" className="text-black underline font-bold mt-4 inline-block">Find some products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlistProducts.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              variant="detailed"
              onAddToCart={handleAddToCart}
              onWishlist={handleWishlist}
              isWishlisted={localWishlist.has(product._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
