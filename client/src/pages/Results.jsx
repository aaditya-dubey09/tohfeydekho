import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Star, Zap, ShoppingCart, Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { paymentsAPI } from '../services/api';

const Results = () => {
  const location = useLocation();
  const recommendations = location.state?.recommendations || [];
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [bookingLoading, setBookingLoading] = useState(false);

  const loadRazorpay = () => new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Razorpay SDK failed to load'));
    document.body.appendChild(script);
  });

  const handleBookConsultation = async () => {
    if (!user) {
      alert('Please login to book an expert consultation');
      return;
    }

    try {
      setBookingLoading(true);
      await loadRazorpay();

      const amount = 49; // INR
      const { data } = await paymentsAPI.createOrder({
        amount,
        name: user.fullName,
        contact: user.email,
        context: 'Gift consultation request'
      });

      const order = data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        amount: order.amount,
        currency: order.currency,
        name: 'Tohfey Consultation',
        description: '1:1 Gift Expert Session',
        order_id: order.id,
        prefill: {
          name: user.fullName,
          email: user.email,
          contact: user.contact || ''
        },
        notes: {
          context: 'Gift consultation request'
        },
        handler: async (response) => {
          try {
            const verifyRes = await paymentsAPI.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            const calUrl = verifyRes.data?.calBookingUrl;
            if (calUrl) {
              window.location.href = calUrl;
            } else {
              alert('Payment verified. Please contact support to schedule your call.');
            }
          } catch (err) {
            console.error(err);
            alert('Payment verified, but booking could not be created. Please contact support.');
          }
        },
        theme: {
          color: '#000000'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert('Could not start payment. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">No recommendations found.</h2>
        <Link to="/quiz" className="text-blue-600 underline">Try the quiz again</Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Your Curated Picks</h1>
        <p className="text-gray-600">Based on your preferences, we found these 9 perfect products.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.map((product) => (
          <div key={product._id} className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all">
            <Link to={`/product/${product._id}`}>
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.images[0]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold">
                    <Zap size={12} className="text-yellow-500 fill-yellow-500" />
                    <span>{product.match_score} Match</span>
                  </div>
                  <div className="bg-black/90 text-white px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span>{product.expert_rating} Rating</span>
                  </div>
                </div>
              </div>
            </Link>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{product.description}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-black">₹{product.base_price}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => dispatch(addToCart(product))}
                    className="p-2 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-colors"
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>

              <Link
                to={`/product/${product._id}`}
                className="block w-full py-3 text-center border-2 border-black rounded-xl font-bold hover:bg-black hover:text-white transition-all"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Expert Consultation CTA */}
      <div className="bg-black text-white p-12 rounded-3xl text-center space-y-6">
        <h2 className="text-3xl font-bold">Still Unsure? Chat with an Expert</h2>
        <p className="text-gray-400 max-w-xl mx-auto">Get a personalized 1-on-1 consultation for just ₹49. We'll help you pick the absolute best gift.</p>
        <button
          onClick={handleBookConsultation}
          disabled={bookingLoading}
          className="px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {bookingLoading ? 'Starting payment...' : 'Book Expert Chat'}
        </button>
      </div>
    </div>
  );
};

export default Results;
