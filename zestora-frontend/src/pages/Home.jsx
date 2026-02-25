import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaSearch, FaChevronDown, FaSlidersH, FaLeaf, FaDrumstickBite } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import CategoryScroll from '../components/restaurant/CategoryScroll';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import LocationPermissionModal from '../components/ui/LocationPermissionModal';
import { categories, promoBanners, restaurants } from '../data/mockData';
import { useLocationState } from '../hooks/useLocationState';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { city, cityOptions, selectManualCity } = useLocationState();

  const searchRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [foodType, setFoodType] = useState('all');
  const [isCityMenuOpen, setIsCityMenuOpen] = useState(false);

  useEffect(() => {
    if (location.hash === '#search') {
      searchRef.current?.focus();
    }
  }, [location.hash]);

  const activeBanner = promoBanners[0];

  const filteredRestaurants = restaurants
    .filter((restaurant) => {
      const matchesCity = restaurant.city === city;
      const matchesCategory = selectedCategory === 'all' ? true : restaurant.category === selectedCategory;
      const matchesSearch =
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFoodType =
        foodType === 'all' ? true : foodType === 'veg' ? restaurant.pureVeg : !restaurant.pureVeg;

      return matchesCity && matchesCategory && matchesSearch && matchesFoodType;
    })
    .sort((a, b) => {
      if (sortBy === 'delivery') return a.deliveryTime - b.deliveryTime;
      return b.rating - a.rating;
    });

  return (
    <MainLayout>
      <LocationPermissionModal />

      <div className="max-w-7xl mx-auto px-4 py-5 md:py-6">
        <div className="mb-5 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex items-center gap-2 text-zest-muted"
          >
            <FaMapMarkerAlt className="text-zest-orange" />
            <span className="text-sm">Delivering to</span>
            <button
              onClick={() => setIsCityMenuOpen((prev) => !prev)}
              className="flex items-center gap-1 text-zest-text font-semibold hover:text-zest-orange transition-colors"
            >
              {city} <FaChevronDown size={12} />
            </button>

            {isCityMenuOpen && (
              <div className="absolute top-8 left-6 z-20 w-44 rounded-xl border border-zest-muted/20 bg-zest-card shadow-2xl">
                {cityOptions.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      selectManualCity(item);
                      setIsCityMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-zest-dark ${
                      item === city ? 'text-zest-orange' : 'text-zest-text'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zest-muted" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search for restaurant, dish, or cuisine"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full bg-zest-card border border-zest-muted/20 rounded-2xl py-4 pl-12 pr-4 text-zest-text placeholder-zest-muted/50 focus:outline-none focus:border-zest-orange focus:ring-2 focus:ring-zest-orange/20"
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 p-5 md:p-8 flex flex-col justify-center">
            <p className="text-zest-orange font-semibold text-sm mb-1">Limited Time</p>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">{activeBanner.title}</h2>
            <p className="text-white/85 mt-2">{activeBanner.subtitle}</p>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-lg md:text-xl font-bold text-zest-text mb-4">What's on your mind?</h2>
          <CategoryScroll selected={selectedCategory} onSelect={setSelectedCategory} categories={categories} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex gap-3 overflow-x-auto pb-2 mb-6 scrollbar-hide"
        >
          <button
            onClick={() => setSortBy(sortBy === 'rating' ? 'delivery' : 'rating')}
            className="px-4 py-2 rounded-xl border text-sm font-medium flex items-center gap-2 whitespace-nowrap bg-zest-card text-zest-muted border-zest-muted/20"
          >
            <FaSlidersH /> {sortBy === 'rating' ? 'Sort: Rating' : 'Sort: Delivery'}
          </button>
          <button
            onClick={() => setFoodType(foodType === 'veg' ? 'all' : 'veg')}
            className={`px-4 py-2 rounded-xl border text-sm font-medium flex items-center gap-2 whitespace-nowrap ${
              foodType === 'veg'
                ? 'bg-zest-orange text-white border-zest-orange'
                : 'bg-zest-card text-zest-muted border-zest-muted/20'
            }`}
          >
            <FaLeaf /> Veg
          </button>
          <button
            onClick={() => setFoodType(foodType === 'nonveg' ? 'all' : 'nonveg')}
            className={`px-4 py-2 rounded-xl border text-sm font-medium flex items-center gap-2 whitespace-nowrap ${
              foodType === 'nonveg'
                ? 'bg-zest-orange text-white border-zest-orange'
                : 'bg-zest-card text-zest-muted border-zest-muted/20'
            }`}
          >
            <FaDrumstickBite /> Non-Veg
          </button>
        </motion.div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-zest-text">Top restaurants in {city}</h2>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-zest-muted text-lg">No restaurants found for this city/filter.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setSortBy('rating');
                  setFoodType('all');
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
