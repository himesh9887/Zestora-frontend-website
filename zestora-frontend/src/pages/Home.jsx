import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaSearch, FaChevronDown } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import CategoryScroll from '../components/restaurant/CategoryScroll';
import RestaurantCard from '../components/restaurant/RestaurantCard';

// Mock Data
const restaurants = [
  {
    id: 1,
    name: "Burger King",
    cuisine: "American • Burgers • Fast Food",
    rating: 4.5,
    deliveryTime: 25,
    deliveryFee: 0,
    minOrder: 15,
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&auto=format&fit=crop",
    category: 2
  },
  {
    id: 2,
    name: "Pizza Hut",
    cuisine: "Italian • Pizza • Pasta",
    rating: 4.3,
    deliveryTime: 35,
    deliveryFee: 2.99,
    minOrder: 20,
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop",
    category: 1
  },
  {
    id: 3,
    name: "Sushi Master",
    cuisine: "Japanese • Sushi • Asian",
    rating: 4.8,
    deliveryTime: 40,
    deliveryFee: 3.99,
    minOrder: 25,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop",
    category: 4
  },
  {
    id: 4,
    name: "Green Garden",
    cuisine: "Healthy • Salads • Vegan",
    rating: 4.6,
    deliveryTime: 20,
    deliveryFee: 1.99,
    minOrder: 12,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop",
    category: 5
  },
  {
    id: 5,
    name: "Chicken Republic",
    cuisine: "Chicken • Wings • Fast Food",
    rating: 4.2,
    deliveryTime: 30,
    deliveryFee: 2.49,
    minOrder: 18,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop",
    category: 3
  },
  {
    id: 6,
    name: "Ocean Basket",
    cuisine: "Seafood • Fish • Grill",
    rating: 4.7,
    deliveryTime: 45,
    deliveryFee: 4.99,
    minOrder: 30,
    image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&auto=format&fit=crop",
    category: 4
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRestaurants = restaurants.filter(r => {
    const matchesCategory = selectedCategory ? r.category === selectedCategory : true;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         r.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Location & Search */}
        <div className="mb-8 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-zest-muted"
          >
            <FaMapMarkerAlt className="text-zest-orange" />
            <span className="text-sm">Delivering to</span>
            <button className="flex items-center gap-1 text-white font-semibold hover:text-zest-orange transition-colors">
              123 Main Street <FaChevronDown size={12} />
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zest-muted" />
            <input
              type="text"
              placeholder="Search restaurants, cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zest-card border border-zest-muted/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-zest-muted/50 focus:outline-none focus:border-zest-orange focus:ring-2 focus:ring-zest-orange/20"
            />
          </motion.div>
        </div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">Categories</h2>
          <CategoryScroll selected={selectedCategory} onSelect={setSelectedCategory} />
        </motion.div>

        {/* Restaurants */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              {selectedCategory ? 'Filtered Results' : 'Popular Near You'}
            </h2>
            <span className="text-zest-muted text-sm">{filteredRestaurants.length} places</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.map((restaurant, index) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                index={index}
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              />
            ))}
          </div>

          {filteredRestaurants.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-zest-muted text-lg">No restaurants found</p>
              <button 
                onClick={() => {setSelectedCategory(null); setSearchQuery('');}}
                className="mt-4 text-zest-orange hover:underline"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;