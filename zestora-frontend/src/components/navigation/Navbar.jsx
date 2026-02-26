import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaShoppingCart, FaSignOutAlt, FaBars, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useLocationState } from '../../hooks/useLocationState';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { city } = useLocationState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/home', label: 'Home' },
    { path: '/orders', label: 'Orders' },
    { path: '/profile', label: 'Profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-zest-dark/80 backdrop-blur-xl border-b border-zest-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/home" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-zest-orange to-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">Z</span>
            </div>
            <button
              onClick={(event) => {
                event.preventDefault();
                navigate('/location');
              }}
              className="hidden sm:block text-left"
            >
              <span className="text-xl font-bold text-zest-text block">Zestora</span>
              <span className="text-xs text-zest-muted flex items-center gap-1">
                <FaMapMarkerAlt className="text-zest-orange" /> {city}
              </span>
            </button>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.path ? 'text-zest-orange' : 'text-zest-muted hover:text-zest-text'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/home#search')}
              className="p-2 text-zest-muted hover:text-zest-text transition-colors"
            >
              <FaSearch size={20} />
            </button>

            <Link to="/cart" className="p-2 text-zest-muted hover:text-zest-text transition-colors relative">
              <FaShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-zest-orange text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-zest-muted/20">
              <span className="text-sm text-zest-muted">Hi, {user?.name?.split(' ')[0] || 'User'}</span>
              <button onClick={handleLogout} className="p-2 text-zest-muted hover:text-zest-danger transition-colors">
                <FaSignOutAlt size={20} />
              </button>
            </div>

            <button className="md:hidden p-2 text-zest-muted" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <FaBars size={24} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zest-card border-t border-zest-muted/10"
          >
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 text-base font-medium ${
                    location.pathname === item.path ? 'text-zest-orange' : 'text-zest-muted'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <button onClick={handleLogout} className="w-full text-left py-2 text-zest-danger font-medium flex items-center gap-2">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
