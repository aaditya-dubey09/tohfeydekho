import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, Heart, User, LogOut, Search, Gift, Settings, Menu, X } from 'lucide-react';
import { logout as logoutThunk } from '../redux/slices/auth.thunk';
import { useModal } from '../hooks/useModal';
import Modal from './ui/Modal';

const Navbar = () => {
  const { user } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isOpen, modalConfig, showModal, closeModal } = useModal();

  const isHome = location.pathname === '/' || location.pathname === '';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/browse', { state: { searchQuery } });
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };
  const handleLogout = async () => {
    showModal({
      title: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      type: 'warning',
      confirmText: 'Logout',
      onConfirm: async () => {
        try {
          dispatch(logoutThunk());
          navigate('/');
          setMobileMenuOpen(false);
        } catch (error) {
            console.error('Logout failed', error);
        }
      }
    });
  };

  return (
    <>
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-2 flex-shrink-0">
            <Gift size={20} className="md:w-6 md:h-6" /> 
            <span className="hidden sm:inline">TOHFEY DEKHO</span>
            <span className="sm:hidden">TOHFEY</span>
          </Link>

          {/* Desktop Search & Navigation */}
          <div className="hidden lg:flex flex-1 items-center gap-8 mx-8">
            {isHome && <form onSubmit={handleSearch} className="flex flex-1 max-w-xs">
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

            <div className="flex items-center gap-8 font-bold text-sm uppercase tracking-widest">
              <Link to="/quiz" className="hover:text-gray-500 transition-colors">Find Product</Link>
              <Link to="/browse" className="hover:text-gray-500 transition-colors">Browse</Link>
              {user?.role === 'admin' && <Link to="/admin" className="text-red-600">Admin</Link>}
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-3 md:gap-6">
            <Link to="/wishlist" className="relative hover:scale-110 transition-transform p-2 md:p-0">
              <Heart size={20} className="md:w-5 md:h-5" />
            </Link>
            <Link to="/cart" className="relative hover:scale-110 transition-transform p-2 md:p-0">
              <ShoppingCart size={20} className="md:w-5 md:h-5" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center gap-3 md:gap-4">
              {user ? (
                <>
                  <Link to="/history" title="Quiz History" className="hover:scale-110 transition-transform p-2 md:p-0">
                    <User size={20} className="md:w-5 md:h-5" />
                  </Link>
                  <Link to="/settings" title="Settings" className="hover:scale-110 transition-transform p-2 md:p-0">
                    <Settings size={20} className="md:w-5 md:h-5" />
                  </Link>
                  <button onClick={handleLogout} title="Logout" className="hover:scale-110 transition-transform p-2 md:p-0">
                    <LogOut size={20} className="md:w-5 md:h-5" />
                  </button>
                </>
              ) : (
                <Link to="/login" className="bg-black text-white px-4 md:px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-100 space-y-3">
            {isHome && (
              <form onSubmit={handleSearch} className="py-2">
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
            )}
            
            <Link 
              to="/quiz" 
              className="block px-4 py-2 font-bold text-sm uppercase tracking-widest hover:bg-gray-50 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Product
            </Link>
            <Link 
              to="/browse" 
              className="block px-4 py-2 font-bold text-sm uppercase tracking-widest hover:bg-gray-50 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse
            </Link>
            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className="block px-4 py-2 font-bold text-sm uppercase tracking-widest text-red-600 hover:bg-gray-50 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}

            {/* Mobile User Menu */}
            <div className="border-t border-gray-100 pt-3 space-y-2">
              {user ? (
                <>
                  <Link 
                    to="/history" 
                    className="flex items-center gap-2 px-4 py-2 font-bold text-sm hover:bg-gray-50 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={18} /> Quiz History
                  </Link>
                  <Link 
                    to="/settings" 
                    className="flex items-center gap-2 px-4 py-2 font-bold text-sm hover:bg-gray-50 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings size={18} /> Settings
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 font-bold text-sm hover:bg-gray-50 rounded"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="block w-full text-center bg-black text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
    <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onConfirm={modalConfig.onConfirm}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
      />
    </>
  );
};

export default Navbar;
