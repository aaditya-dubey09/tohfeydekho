import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactGA from 'react-ga4';
import { paymentsAPI } from '../services/api';
import Modal from '../components/ui/Modal';
import { useModal } from '../hooks/useModal';
import RecommendationsGrid from '../components/grids/RecommendationsGrid';

const Results = () => {
  const location = useLocation();
  const recommendations = location.state?.recommendations || [];
  const matchType = location.state?.matchType || 'recommendations';
  const noPerfectMatch = location.state?.noPerfectMatch || false;
  const { user } = useSelector(state => state.auth);
  const [bookingLoading, setBookingLoading] = useState(false);
  const { isOpen, modalConfig, showModal, closeModal } = useModal();

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
      showModal({
        title: 'Login Required',
        message: 'Please login to book a consultation',
        type: 'warning'
      })
      return;
    }

    /**
      Used standard 'begin_checkout' for better funnel tracking
     */
    ReactGA.event('begin_checkout', {
      content_type: 'expert_consultation',
      value: 29,
      currency: 'INR',
      items: [{
        item_id: 'consultation_001',
        item_name: 'Expert Consultation',
        price: 29,
        quantity: 1
      }]
    });

    // Custom event for backend dashboard query
    ReactGA.event('expert_booking_intent', {
      source: 'results_page',
      price: 29
    });

    try {
      setBookingLoading(true);
      await loadRazorpay();

      const amount = 29;
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

            /**
              Track successful purchase/verification
              This matches the 'expert_events' query in backend
             */
            ReactGA.event('expert_payment_success', {
              transaction_id: response.razorpay_payment_id,
              value: 29,
              currency: 'INR',
              source: 'results_page'
            });

            const calUrl = verifyRes.data?.calBookingUrl;
            if (calUrl) {
              window.location.href = calUrl;
            } else {
              showModal({
                title: 'Booking Successful',
                message: 'Payment verified! Please contact support to schedule your consultation.',
                type: 'success'
              });
            }
          } catch (err) {
            console.error(err);
            ReactGA.event('expert_payment_failed', {
              error_type: 'verification_error',
              order_id: response.razorpay_order_id
            });
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
      showModal({
        title: 'Payment Failed',
        message: 'There was an issue processing your payment. Please try again.',
        type: 'error'
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const resultsTitle = matchType === 'closest'
    ? 'Closest Matches We Found'
    : matchType === 'fallback'
      ? 'Other Products to Explore'
      : 'Your Curated Picks';

  const resultsSubtitle = matchType === 'closest'
    ? 'We didn’t find exact matches, so these are the closest based on your answers.'
    : matchType === 'fallback'
      ? 'Here are some great options while we expand our catalog.'
      : `Based on your preferences, we found these ${recommendations.length} perfect products.`;

  return (
    <div className="space-y-12 px-4">
      {noPerfectMatch && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-2xl px-4 py-3 text-sm md:text-base">
          We couldn’t find the perfect match yet as we’re growing our product database. Here are other great products to explore in the meantime.
        </div>
      )}

      <RecommendationsGrid
        recommendations={recommendations}
        title={resultsTitle}
        subtitle={resultsSubtitle}
      />

      {/* Expert Consultation CTA - Always Visible */}
      <div className="bg-gradient-to-r from-black to-gray-900 text-white p-6 md:p-12 rounded-3xl text-center space-y-6 mt-12 border-2 border-yellow-500">
        <div className="inline-block bg-yellow-500 text-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider">
          Limited Offer
        </div>
        <h2 className="text-2xl md:text-3xl font-black">Still Unsure? Get Expert Guidance</h2>
        <p className="text-gray-300 max-w-xl mx-auto text-sm md:text-base">Book a personalized 1-on-1 consultation with our gift experts for just <span className="font-black text-yellow-400">₹29</span>. We'll help you pick the perfect gift in minutes.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={handleBookConsultation}
            disabled={bookingLoading}
            className="px-6 md:px-8 py-3 md:py-4 bg-yellow-400 text-black rounded-full font-black text-sm md:text-base hover:bg-yellow-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex-1 sm:flex-auto"
          >
            {bookingLoading ? 'Processing...' : '✨ Book Expert Talk'}
          </button>
          <button
            onClick={() => window.scrollTo(0, 0)}
            className="px-6 md:px-8 py-3 md:py-4 border-2 border-white text-white rounded-full font-bold text-sm md:text-base hover:bg-white hover:text-black transition-all flex-1 sm:flex-auto"
          >
            Continue Shopping
          </button>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </div>
  );
};

export default Results;
