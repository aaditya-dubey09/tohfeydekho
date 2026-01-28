import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { productsAPI } from '../services/api';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchWishlist = async () => {
    try {
      const { data } = await productsAPI.getWishlist();
      setWishlist(data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeWishlist = async (id) => {
    try {
      await productsAPI.toggleWishlist(id);
      fetchWishlist();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="py-20 text-center">Loading...</div>;

  return (
    <div className="space-y-12">
      <h1 className="text-4xl font-black">Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem]">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-xl font-bold text-gray-500">Your wishlist is empty</p>
          <Link to="/quiz" className="text-black underline font-bold mt-4 inline-block">Find some products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map(product => (
            <div key={product._id} className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all">
              <div className="relative aspect-square">
                <img src={product.images[0]?.url} className="w-full h-full object-cover" alt={product.name} />
                <button
                  onClick={() => removeWishlist(product._id)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full text-red-600 shadow-md"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black">₹{product.base_price}</span>
                  <button
                    onClick={() => dispatch(addToCart(product))}
                    className="p-2 rounded-full bg-black text-white"
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>
                <Link to={`/product/${product._id}`} className="block text-center font-bold underline">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
