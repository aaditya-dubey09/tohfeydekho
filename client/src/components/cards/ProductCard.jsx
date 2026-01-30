import React from 'react';
import { Zap, ShoppingCart, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProductCard = ({ 
  product, 
  onAddToCart, 
  onWishlist, 
  isWishlisted,
  variant = 'default'
}) => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const getDisplayPrice = (product) => {
    if (!product.retailer_prices || product.retailer_prices.length === 0) return null;
    const prices = product.retailer_prices.map(rp => rp.price);
    return Math.min(...prices);
  };

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    if (onWishlist) {
      await onWishlist(e, product._id);
    }
  };

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product._id);
    }
  };

  const price = getDisplayPrice(product);

  if (variant === 'category') {
    return (
      <div className="bg-white border-2 border-gray-100 rounded-xl overflow-hidden hover:border-black hover:shadow-[6px_6px_0px_black] transition-all duration-300 group">
        <Link to={`/product/${product._id}`}>
          <div className="aspect-video overflow-hidden bg-gray-100 relative max-h-[220px]">
            <img
              src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/300'; }}
            />
            <div className='absolute top-2 right-2'>
              <button onClick={handleWishlistClick} className="p-2 rounded-full hover:scale-110 transition-all duration-300 bg-white shadow-md">
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} className={isWishlisted ? 'text-red-500' : 'text-gray-700'} />
              </button>
            </div>
          </div>
        </Link>
        <div className="p-3 space-y-2">
          <Link to={`/product/${product._id}`}>
            <h3 className="text-sm font-bold hover:underline line-clamp-2">{product.name}</h3>
          </Link>
          <div className="flex flex-wrap gap-1">
            {product.occasion_tags?.slice(0, 2).map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-bold text-gray-700">{tag}</span>
            ))}
          </div>
          <button onClick={handleAddToCartClick} className="w-full bg-black text-white py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm">
            <ShoppingCart size={14} /> Add to Cart
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="bg-white border-2 border-gray-100 rounded-xl overflow-hidden hover:shadow-[6px_6px_0px_black] transition-all duration-300">
        <Link to={`/product/${product._id}`}>
          <div className="aspect-square overflow-hidden bg-gray-100 relative">
            <img
              src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/300'; }}
            />
            <div className='absolute top-2 right-2'>
              <button onClick={handleWishlistClick} className="p-2 rounded-full hover:scale-110 transition-all duration-300 bg-white shadow-md">
                <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} className={isWishlisted ? 'text-red-500' : 'text-gray-700'} />
              </button>
            </div>
          </div>
        </Link>
        <div className="p-2.5 space-y-2">
          <Link to={`/product/${product._id}`}>
            <h3 className="text-sm font-bold hover:underline line-clamp-2">{product.name}</h3>
          </Link>
          <div className="flex flex-wrap gap-1">
            {product.occasion_tags?.slice(0, 2).map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-bold text-gray-700">{tag}</span>
            ))}
          </div>
          <button onClick={handleAddToCartClick} className="w-full bg-black text-white py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm">
            <ShoppingCart size={14} /> Add to Cart
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:shadow-[10px_10px_0px_black] transition-shadow duration-300">
        <Link to={`/product/${product._id}`}>
          <div className="aspect-square overflow-hidden bg-gray-100 relative">
            <img
              src={product.images?.[0]?.url || 'https://via.placeholder.com/400'}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400'; }}
            />
            <div className='absolute top-2 right-2'>
              <button onClick={handleWishlistClick} className="p-2 rounded-full hover:scale-110 transition-all duration-300 bg-white shadow-md">
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} className={isWishlisted ? 'text-red-500' : 'text-gray-700'} />
              </button>
            </div>
          </div>
        </Link>
        <div className="p-6 space-y-4">
          <Link to={`/product/${product._id}`}>
            <h3 className="text-xl font-bold hover:underline line-clamp-2">{product.name}</h3>
          </Link>
          <div className="flex flex-wrap gap-2">
            {product.occasion_tags?.slice(0, 2).map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold">{tag}</span>
            ))}
            {product.emotion_tags?.slice(0, 1).map(tag => (
              <span key={tag} className="px-3 py-1 bg-yellow-100 rounded-full text-xs font-bold">{tag}</span>
            ))}
          </div>
          <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
          {price && (
            <div className="text-2xl font-black">
              <span className='text-[16px] font-semibold text-black/80'>Starting at -</span> ₹{price.toLocaleString()}
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={handleAddToCartClick} className="flex-1 bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <Link to={`/product/${product._id}`} className="px-4 py-3 border-2 border-black rounded-xl font-bold hover:bg-black hover:text-white transition-colors flex items-center justify-center">
              View
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link to={`/product/${product._id}`}>
      <div className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.images?.[0]?.url || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/400'; }}
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold">
              <Zap size={12} className="text-yellow-500 fill-yellow-500" />
              <span>Expert Pick</span>
            </div>
          </div>
          <div className='absolute top-4 right-4'>
            <button onClick={handleWishlistClick} className="p-2 rounded-full hover:scale-110 transition-all duration-300 bg-white shadow-md">
              <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} className={isWishlisted ? 'text-red-500' : 'text-gray-700'} />
            </button>
          </div>
        </div>
        <div className="p-4 md:p-6 space-y-4">
          <div>
            <h3 className="font-bold text-lg line-clamp-2 group-hover:text-yellow-600 transition-colors">{product.name}</h3>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
          </div>
          <div className="flex items-end justify-between">
            {price && (
              <div className="text-2xl font-black"><span className='text-[16px] text-black/80'>Starting at -</span> ₹{price.toLocaleString()}</div>
            )}
            <button onClick={handleAddToCartClick} className="p-2 hover:bg-yellow-400 rounded-lg transition-colors" title="Add to Cart">
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
