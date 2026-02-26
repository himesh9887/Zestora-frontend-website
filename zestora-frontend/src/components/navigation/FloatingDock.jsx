import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaShoppingCart, FaListAlt, FaUser } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';

const FloatingDock = () => {
  const location = useLocation();
  const { cartCount } = useCart();

  const tabs = [
    { to: '/home', icon: FaHome, label: 'Home', isActive: location.pathname === '/home' },
    { to: '/checkout', icon: FaShoppingCart, label: 'Cart', badge: cartCount, isActive: location.pathname === '/checkout' || location.pathname === '/cart' },
    { to: '/orders', icon: FaListAlt, label: 'Orders', isActive: location.pathname === '/orders' },
    { to: '/profile', icon: FaUser, label: 'Profile', isActive: location.pathname === '/profile' },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      <div className="mx-4 mb-4 bg-zest-card/95 backdrop-blur-xl rounded-3xl border border-zest-muted/20 shadow-lg shadow-black/10">
        <div className="flex items-center justify-around py-3 px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <Link key={tab.label} to={tab.to} className="relative flex flex-col items-center gap-1 p-2">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`relative p-2 rounded-xl transition-colors ${
                    tab.isActive ? 'bg-zest-orange/15 text-zest-orange' : 'text-zest-muted'
                  }`}
                >
                  <Icon size={22} />
                  {tab.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-zest-danger text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {tab.badge > 9 ? '9+' : tab.badge}
                    </span>
                  )}
                </motion.div>
                <span className={`text-xs font-medium ${tab.isActive ? 'text-zest-orange' : 'text-zest-muted'}`}>
                  {tab.label}
                </span>
                {tab.isActive && <motion.div layoutId="activeTab" className="absolute -bottom-1 w-1 h-1 bg-zest-orange rounded-full" />}
              </Link>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default FloatingDock;
