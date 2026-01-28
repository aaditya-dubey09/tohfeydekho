import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, Heart, User, LogOut, Search, Gift, Settings } from 'lucide-react';
import { logout } from '../redux/slices/authSlice';
import { authAPI } from '../services/api';

const Navbar = () => {
  const { user } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const isHome = location.pathname === '/' || location.pathname === '';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/browse', { state: { searchQuery } });
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 md:py-0">
        <div className="flex items-center justify-between gap-4 mb-3 md:mb-0 md:h-20">
          <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <Gift size={24} /> TOHFEY DEKHO
          </Link>

          {isHome && <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search gifts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </form>}

          <div className="hidden md:flex items-center gap-8 font-bold text-sm uppercase tracking-widest">
            <Link to="/quiz" className="hover:text-gray-500 transition-colors">Find Product</Link>
            <Link to="/browse" className="hover:text-gray-500 transition-colors">Browse</Link>
            {user?.role === 'admin' && <Link to="/admin" className="text-red-600">Admin</Link>}
          </div>

          <div className="flex items-center gap-6">
            <Link to="/wishlist" className="relative hover:scale-110 transition-transform">
              <Heart size={22} />
            </Link>
            <Link to="/cart" className="relative hover:scale-110 transition-transform">
              <ShoppingCart size={22} />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/history" title="Quiz History" className="hover:scale-110 transition-transform">
                  <User size={22} />
                </Link>
                <Link to="/settings" title="Settings" className="hover:scale-110 transition-transform">
                  <Settings size={22} />
                </Link>
                <button onClick={handleLogout} title="Logout" className="hover:scale-110 transition-transform">
                  <LogOut size={22} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-black text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearch} className="md:hidden">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search gifts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
