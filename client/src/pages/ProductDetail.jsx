import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShieldCheck, Truck, ExternalLink, Heart, ShoppingCart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartThunk } from '../redux/slices/cart.thunk';
import { productsAPI } from '../services/api';
import { useModal } from '../hooks/useModal';
import Modal from '../components/ui/Modal';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { isOpen, modalConfig, showModal, closeModal } = useModal();
  const { wishlist } = useSelector(state => state.products);
  const [localWishlist, setLocalWishlist] = useState(new Set());

  useEffect(() => {
    setLocalWishlist(new Set(wishlist?.map(p => p._id) || []));
  }, [wishlist]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await productsAPI.getById(id);
        setProduct(data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="py-20 text-center">Loading...</div>;
  if (!product) return <div className="py-20 text-center">Product not found</div>;

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showModal({
        title: 'Login Required',
        message: 'Please login to save products to your wishlist',
        type: 'warning'
      });
      return;
    }
    try {
      await productsAPI.toggleWishlist(product._id);
      setLocalWishlist(prev => {
        const newSet = new Set(prev);
        if (newSet.has(product._id)) {
          newSet.delete(product._id);
        } else {
          newSet.add(product._id);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Wishlist error:', error);
    }
  };

  return (
    <>
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100">
            <img
              src={product.images[activeImage]?.url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-4">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 ${activeImage === idx ? 'border-black' : 'border-transparent'}`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Expert Pick
              </span>
              {/* <div className="flex items-center gap-1 text-yellow-500">
                <Star size={16} fill="currentColor" />
                <span className="font-bold text-black">{product.expert_rating}/5</span>
              </div> */}
            </div>
            <h1 className="text-4xl font-black mb-4">{product.name}</h1>
            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-xl">Price Comparison</h3>
            {product.retailer_prices && product.retailer_prices.length > 0 ? (
              <div className="space-y-3">
                {product.retailer_prices.map((rp, idx) => {
                  const totalPrice = rp.price + (rp.shipping_cost || 0);
                  const isCheapest = product.retailer_prices.length > 0 &&
                    totalPrice === Math.min(...product.retailer_prices.map(r => r.price + (r.shipping_cost || 0)));

                  return (
                    <div
                      key={idx}
                      className={`border-2 rounded-2xl p-4 transition-all ${isCheapest ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-bold text-lg capitalize">{rp.retailer_id}</p>
                            {isCheapest && <span className="text-xs font-bold bg-green-600 text-white px-2 py-1 rounded">BEST PRICE</span>}
                            {!rp.is_exact && <span className="text-xs text-gray-500">~Approx</span>}
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black">₹{totalPrice}</span>
                            {rp.shipping_cost > 0 && (
                              <span className="text-sm text-gray-600">
                                (₹{rp.price} + ₹{rp.shipping_cost} shipping)
                              </span>
                            )}
                          </div>
                        </div>
                        <a
                          href={rp.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-bold"
                        >
                          View <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                Price comparison data not available yet
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => dispatch(addToCartThunk(product._id))}
              className="flex-1 bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
            >
              <ShoppingCart size={20} /> Add to Cart
            </button>
            <button
              onClick={(e) => handleWishlist(e)}
              className="p-4 rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:scale-105 transition-all duration-300 bg-white"
            >
              <Heart 
                size={24} 
                fill={localWishlist.has(product._id) ? 'currentColor' : 'none'}
                className={localWishlist.has(product._id) ? 'text-red-500' : 'text-gray-700'}
              />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
              <ShieldCheck className="text-green-600" />
              <span className="text-sm font-medium">Verified Product</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
              <Truck className="text-blue-600" />
              <span className="text-sm font-medium">Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </>
  );
};

export default ProductDetail;
