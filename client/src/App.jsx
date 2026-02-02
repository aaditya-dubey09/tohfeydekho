import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authAPI } from './services/api';
import { setUser } from './redux/slices/authSlice';
import { fetchCart } from './redux/slices/cart.thunk';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import QuizHistory from './pages/QuizHistory';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import ReactGA from "react-ga4";


function App() {
  const dispatch = useDispatch();
  const didCheckAuth = useRef(false);
  const [loading, setLoading] = React.useState(true);
  const location = useLocation();
  const TRACKING_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;
  ReactGA.initialize(TRACKING_ID);
  
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  useEffect(() => {
    if (didCheckAuth.current) return; // avoid double-run in React 18 StrictMode
    didCheckAuth.current = true;

    const checkAuth = async () => {
      try {
        const { data } = await authAPI.getProfile();
        dispatch(setUser(data.data));
        // Fetch cart after user is authenticated
        dispatch(fetchCart());
      } catch (error) {
        dispatch(setUser(null));
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
        <span className="ml-4 text-lg font-semibold">Loading...</span>
      </div>
    )
  }

  return (
      <ErrorBoundary>
        <div className="min-h-screen bg-white text-black font-sans flex flex-col">
          <Navbar />
          <main className="container mx-auto px-4 py-8 flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/results" element={<Results />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><QuizHistory /></ProtectedRoute>} />
              <Route path="/admin/*" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ErrorBoundary>
  );
}

export default App;
