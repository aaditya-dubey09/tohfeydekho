import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, ShoppingBag } from 'lucide-react';
import { removeFromCartThunk } from '../redux/slices/cart.thunk';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { items } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const getProductPrice = (item) => {
    if (!item.retailer_prices || item.retailer_prices.length === 0) return 0;
    const prices = item.retailer_prices.map(rp => rp.price);
    return Math.min(...prices);
  };

  const total = items.reduce((sum, item) => sum + getProductPrice(item), 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-20 space-y-6">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag size={40} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <Link to="/quiz" className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold">
          Find Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-black">Your Selection</h1>

      <div className="grid grid-cols-1 gap-6">
        {items.map(item => (
          <div key={item._id} className="flex items-center gap-6 p-6 bg-gray-50 rounded-3xl">
            <img src={item.images?.[0]?.url || 'https://via.placeholder.com/100'} className="w-24 h-24 rounded-2xl object-cover" alt={item.name} />
            <div className="flex-1">
              <h3 className="text-xl font-bold">{item.name}</h3>
              <p className="text-gray-500">₹{getProductPrice(item).toLocaleString()}</p>
            </div>
            <button
              onClick={() => dispatch(removeFromCartThunk(item._id))}
              className="p-3 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 size={24} />
            </button>
          </div>
        ))}
      </div>

      <div className="p-8 bg-black text-white rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Total Estimated Price</p>
          <p className="text-5xl font-black">₹{total.toLocaleString()}</p>
        </div>
        <div className="text-right space-y-4">
          <p className="text-gray-400 text-sm">Note: This is a calculation-only cart. <br /> Purchase products directly from retailers.</p>
          <Link to="/results" className="inline-block bg-white text-black px-10 py-4 rounded-full font-black hover:scale-105 transition-transform">
            Continue Browsing
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
