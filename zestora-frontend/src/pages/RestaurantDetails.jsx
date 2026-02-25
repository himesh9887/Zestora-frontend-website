import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaStar, FaClock, FaMapMarkerAlt, FaShoppingBag } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import MenuItem from '../components/restaurant/MenuItem';
import { useCart } from '../hooks/useCart';
import Button from '../components/common/Button';

// Mock Data
const restaurantData = {
  id: 1,
  name: "Burger King",
  cuisine: "American • Burgers • Fast Food",
  rating: 4.5,
  deliveryTime: 25,
  address: "123 Burger Street, Food City",
  image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1200&auto=format&fit=crop",
  menu: [
    {
      id: 101,
      name: "Whopper",
      description: "Flame-grilled beef patty with tomatoes, lettuce, mayo, pickles, and onions on a sesame seed bun",
      price: 8.99,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop",
      category: "Burgers"
    },
    {
      id: 102,
      name: "Chicken Fries",
      description: "Crispy white meat chicken shaped like fries, perfect for dipping",
      price: 5.99,
      image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&auto=format&fit=crop",
      category: "Sides"
    },
    {
      id: 103,
      name: "Onion Rings",
      description: "Golden and crispy onion rings, the perfect side",
      price: 3.99,
      image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&auto=format&fit=crop",
      category: "Sides"
    },
    {
      id: 104,
      name: "Chocolate Shake",
      description: "Creamy hand-spun chocolate shake with whipped topping",
      price: 4.49,
      image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop",
      category: "Drinks"
    }
  ]
};

const RestaurantDetails = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', ...new Set(restaurantData.menu.map(item => item.category))];
  
  const filteredMenu = selectedCategory === 'All' 
    ? restaurantData.menu 
    : restaurantData.menu.filter(item => item.category === selectedCategory);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <MainLayout>
      {/* Sticky Header */}
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
        {/* Hero Image */}
        <div className="relative h-64 md:h-80 lg:h-96">
          <img 
            src={restaurantData.image} 
            alt={restaurantData.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zest-dark via-transparent to-transparent" />
        </div>

        {/* Restaurant Info */}
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

        {/* Menu Categories */}
        <div className="px-4 mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-zest-orange text-white'
                    : 'bg-zest-card text-zest-muted hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-4 pb-32 md:pb-12">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode='wait'>
              {filteredMenu.map((item) => (
                <MenuItem 
                  key={item.id} 
                  item={{...item, restaurantName: restaurantData.name}} 
                  restaurantId={restaurantData.id}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Sticky Cart Bar */}
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
                <span className="text-white font-bold text-lg">${cartTotal.toFixed(2)}</span>
              </div>
              <Button 
                onClick={() => navigate('/cart')}
                className="w-full bg-white text-zest-orange hover:bg-gray-100"
              >
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
