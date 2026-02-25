import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaSearch, FaChevronDown, FaSlidersH, FaBolt, FaLeaf } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import CategoryScroll from '../components/restaurant/CategoryScroll';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import { categories, promoBanners, restaurants } from '../data/mockData';

const Home = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFastOnly, setIsFastOnly] = useState(false);
  const [isPureVegOnly, setIsPureVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  const activeBanner = promoBanners[0];

  const filteredRestaurants = restaurants
    .filter((restaurant) => {
      const matchesCategory =
        selectedCategory === 'all' ? true : restaurant.category === selectedCategory;
      const matchesSearch =
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFast = isFastOnly ? restaurant.deliveryTime <= 20 : true;
      const matchesVeg = isPureVegOnly ? restaurant.pureVeg : true;
      return matchesCategory && matchesSearch && matchesFast && matchesVeg;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'delivery') return a.deliveryTime - b.deliveryTime;
      return 0;
    });

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-5 md:py-6">
        <div className="mb-5 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-zest-muted"
          >
            <FaMapMarkerAlt className="text-zest-orange" />
            <span className="text-sm">Delivering to</span>
            <button className="flex items-center gap-1 text-white font-semibold hover:text-zest-orange transition-colors">
              Work, Alwar <FaChevronDown size={12} />
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
              placeholder="Search for restaurant, dish, or cuisine"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full bg-zest-card border border-zest-muted/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-zest-muted/50 focus:outline-none focus:border-zest-orange focus:ring-2 focus:ring-zest-orange/20"
            />
          </motion.div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative overflow-hidden rounded-3xl mb-6"
        >
          <img src={activeBanner.image} alt={activeBanner.title} className="w-full h-44 md:h-60 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-zest-dark via-zest-dark/70 to-transparent" />
          <div className="absolute inset-0 p-5 md:p-8 flex flex-col justify-center">
            <p className="text-zest-orange font-semibold text-sm mb-1">Gold Offer</p>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">{activeBanner.title}</h2>
            <p className="text-zest-text/85 mt-2">{activeBanner.subtitle}</p>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-lg md:text-xl font-bold text-white mb-4">What's on your mind?</h2>
          <CategoryScroll
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            categories={categories}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex gap-3 overflow-x-auto pb-2 mb-6 scrollbar-hide"
        >
          <button
            onClick={() => setSortBy(sortBy === 'rating' ? 'relevance' : 'rating')}
            className={`px-4 py-2 rounded-xl border text-sm font-medium flex items-center gap-2 whitespace-nowrap ${
              sortBy === 'rating'
                ? 'bg-zest-orange text-white border-zest-orange'
                : 'bg-zest-card text-zest-muted border-zest-muted/20'
            }`}
          >
            <FaSlidersH /> Sort
          </button>
          <button
            onClick={() => setIsFastOnly(!isFastOnly)}
            className={`px-4 py-2 rounded-xl border text-sm font-medium flex items-center gap-2 whitespace-nowrap ${
              isFastOnly
                ? 'bg-zest-orange text-white border-zest-orange'
                : 'bg-zest-card text-zest-muted border-zest-muted/20'
            }`}
          >
            <FaBolt /> Near & Fast
          </button>
          <button
            onClick={() => setIsPureVegOnly(!isPureVegOnly)}
            className={`px-4 py-2 rounded-xl border text-sm font-medium flex items-center gap-2 whitespace-nowrap ${
              isPureVegOnly
                ? 'bg-zest-orange text-white border-zest-orange'
                : 'bg-zest-card text-zest-muted border-zest-muted/20'
            }`}
          >
            <FaLeaf /> Pure Veg
          </button>
        </motion.div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Top restaurants to explore</h2>
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
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setIsFastOnly(false);
                  setIsPureVegOnly(false);
                  setSortBy('relevance');
                }}
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
