import React, { useState } from 'react';
import { X, Zap, Clock, CheckCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { paymentsAPI } from '../services/api';
import { useModal } from '../hooks/useModal';
import Modal from './ui/Modal';

const ExpertTalkModal = ({ isOpen, onClose, source = 'browse' }) => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen: infoModalOpen, modalConfig, showModal, closeModal } = useModal();

  if (!isOpen) return null;

  const loadRazorpay = () => new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Razorpay SDK failed to load'));
    document.body.appendChild(script);
  });

  const handleBooking = async () => {
    if (!user) {
      showModal({
        title: 'Login Required',
        message: 'Please login to book an expert consultation',
        type: 'warning'
      });
      return;
    }

    try {
      setIsLoading(true);
      await loadRazorpay();

      const amount = 29; // INR
      const { data } = await paymentsAPI.createOrder({
        amount,
        name: user.fullName,
        contact: user.email,
        context: '1:1 Expert Gift Consultation'
      });

      const order = data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        amount: order.amount,
        currency: order.currency,
        name: 'Tohfey Expert Consultation',
        description: '1:1 Gift Expert Session',
        order_id: order.id,
        prefill: {
          name: user.fullName,
          email: user.email,
          contact: user.contact || ''
        },
        notes: {
          context: '1:1 Expert Gift Consultation',
          source: source
        },
        handler: async (response) => {
          try {
            const verifyRes = await paymentsAPI.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            const calUrl = verifyRes.data?.calBookingUrl;
            
            // Close all modals
            onClose();
            closeModal();
            
            if (calUrl) {
              // Redirect to booking page
              window.location.href = calUrl;
            } else {
              showModal({
                title: 'Booking Successful',
                message: 'Payment verified! You will be redirected to book your consultation slot.',
                type: 'success'
              });
              // Redirect to home after 2 seconds
              setTimeout(() => {
                navigate('/');
              }, 2000);
            }
          } catch (err) {
            console.error('Verification error:', err);
            showModal({
              title: 'Verification Failed',
              message: 'Payment received but verification failed. Please contact support.',
              type: 'error'
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
      console.error('Booking error:', error);
      showModal({
        title: 'Booking Failed',
        message: error.message || 'There was an issue processing your booking. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 h-full w-full"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-lg w-full p-8 relative animate-in fade-in zoom-in duration-200 shadow-xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>

          {/* Header */}
          <div className="space-y-4 mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500">
              <Zap size={32} className="text-white fill-white" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-2">Expert Consultation</h2>
              <p className="text-gray-600">Get personalized gift recommendations from our expert</p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {[
              { icon: Clock, text: '30-minute 1:1 session' },
              { icon: Zap, text: 'Personalized gift advice' },
              { icon: CheckCircle, text: 'Expert verified recommendations' }
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <feature.icon size={16} className="text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Price and CTA */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-1">Consultation Fee</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-black">₹29</span>
                <span className="text-gray-500">Only</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Book your session now!</p>
            </div>

            <button
              onClick={handleBooking}
              disabled={isLoading || !user}
              className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Processing...' : user ? 'Book Now' : 'Login to Book'}
            </button>

            <p className="text-xs text-gray-500 text-center">
              After payment, you'll be redirected to schedule your session
            </p>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      <Modal
        isOpen={infoModalOpen}
        onClose={closeModal}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </>
  );
};

export default ExpertTalkModal;
