import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaSearch, FaShoppingCart, FaListAlt, FaUser } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';

const FloatingDock = () => {
  const location = useLocation();
  const { cartCount } = useCart();

  const tabs = [
    { path: '/home', icon: FaHome, label: 'Home' },
    { path: '/home', icon: FaSearch, label: 'Search' }, // Search modal trigger
    { path: '/cart', icon: FaShoppingCart, label: 'Cart', badge: cartCount },
    { path: '/orders', icon: FaListAlt, label: 'Orders' },
    { path: '/profile', icon: FaUser, label: 'Profile' },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      <div className="mx-4 mb-4 bg-zest-card/90 backdrop-blur-xl rounded-3xl border border-zest-muted/10 shadow-2xl shadow-black/50">
        <div className="flex items-center justify-around py-3 px-2">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;
            
            return (
              <Link
                key={tab.label}
                to={tab.path}
                className="relative flex flex-col items-center gap-1 p-2"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`relative p-2 rounded-xl transition-colors ${
                    isActive ? 'bg-zest-orange text-white' : 'text-zest-muted'
                  }`}
                >
                  <Icon size={22} />
                  {tab.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-zest-danger text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {tab.badge > 9 ? '9+' : tab.badge}
                    </span>
                  )}
                </motion.div>
                <span className={`text-xs font-medium ${
                  isActive ? 'text-zest-orange' : 'text-zest-muted'
                }`}>
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 w-1 h-1 bg-zest-orange rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default FloatingDock;