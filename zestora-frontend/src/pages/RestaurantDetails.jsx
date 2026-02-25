import { useMemo, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaStar, FaClock, FaMapMarkerAlt, FaShoppingBag } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import MenuItem from '../components/restaurant/MenuItem';
import { useCart } from '../hooks/useCart';
import Button from '../components/common/Button';
import { getRestaurantById } from '../data/mockData';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems, cartTotal } = useCart();

  const restaurantData = useMemo(() => getRestaurantById(id), [id]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!restaurantData) {
    return <Navigate to="/home" replace />;
  }

  const categories = ['All', ...new Set(restaurantData.menu.map((item) => item.category))];

  const filteredMenu =
    selectedCategory === 'All'
      ? restaurantData.menu
      : restaurantData.menu.filter((item) => item.category === selectedCategory);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 bg-zest-dark/95 backdrop-blur-xl border-b border-zest-muted/10 px-4 py-4 flex items-center gap-4"
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-zest-card rounded-xl transition-colors"
        >
          <FaArrowLeft className="text-white" />
        </button>
        <h1 className="text-lg font-bold text-white truncate">{restaurantData.name}</h1>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        <div className="relative h-64 md:h-80 lg:h-96">
          <img src={restaurantData.image} alt={restaurantData.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-zest-dark via-transparent to-transparent" />
        </div>

        <div className="px-4 -mt-20 relative z-10 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zest-card rounded-2xl p-6 border border-zest-muted/10"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{restaurantData.name}</h1>
            <p className="text-zest-muted mb-4">{restaurantData.cuisine}</p>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1 text-yellow-400">
                <FaStar /> <span className="text-white font-bold">{restaurantData.rating}</span>
              </div>
              <div className="flex items-center gap-1 text-zest-muted">
                <FaClock className="text-zest-orange" /> <span>{restaurantData.deliveryTime} min</span>
              </div>
              <div className="flex items-center gap-1 text-zest-muted">
                <FaMapMarkerAlt className="text-zest-danger" /> <span>{restaurantData.address}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="px-4 mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-zest-orange text-white'
                    : 'bg-zest-card text-zest-muted hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 pb-32 md:pb-12">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="wait">
              {filteredMenu.map((item) => (
                <MenuItem key={item.id} item={{ ...item, restaurantName: restaurantData.name }} restaurantId={restaurantData.id} />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {cartItemCount > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-20 md:bottom-8 left-4 right-4 md:left-auto md:right-8 md:w-96 z-40"
          >
            <div className="bg-zest-orange rounded-2xl p-4 shadow-2xl shadow-orange-500/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-white">
                  <FaShoppingBag />
                  <span className="font-semibold">{cartItemCount} items</span>
                </div>
                <span className="text-white font-bold text-lg">Rs{cartTotal.toFixed(2)}</span>
              </div>
              <Button onClick={() => navigate('/cart')} className="w-full bg-white text-zest-orange hover:bg-gray-100">
                View Cart
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default RestaurantDetails;
