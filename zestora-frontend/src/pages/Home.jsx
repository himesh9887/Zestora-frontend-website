import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaMapMarkerAlt,
  FaSearch,
  FaChevronDown,
  FaSlidersH,
  FaLeaf,
  FaDrumstickBite,
  FaMicrophone,
  FaBolt,
  FaTicketAlt,
  FaUserCircle,
} from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import CategoryScroll from '../components/restaurant/CategoryScroll';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import LocationPermissionModal from '../components/ui/LocationPermissionModal';
import { categories, promoBanners, restaurants } from '../data/mockData';
import { useLocationState } from '../hooks/useLocationState';

const FALLBACK_FOOD_IMAGE = '/food/food-01.svg';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { city, cityOptions, selectManualCity } = useLocationState();

  const searchRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [foodType, setFoodType] = useState('all');
  const [under100Only, setUnder100Only] = useState(false);
  const [isCityMenuOpen, setIsCityMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (location.hash === '#search') {
      searchRef.current?.focus();
    }
  }, [location.hash]);

  const activeBanner = promoBanners[0];

  const filteredRestaurants = useMemo(
    () =>
      restaurants
        .filter((restaurant) => {
          const matchesCity = restaurant.city === city;
          const matchesCategory = selectedCategory === 'all' ? true : restaurant.category === selectedCategory;
          const matchesSearch =
            restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesFoodType =
            foodType === 'all' ? true : foodType === 'veg' ? restaurant.pureVeg : !restaurant.pureVeg;
          const matchesBudget = under100Only ? restaurant.minOrder <= 100 : true;

          return matchesCity && matchesCategory && matchesSearch && matchesFoodType && matchesBudget;
        })
        .sort((a, b) => {
          if (sortBy === 'delivery') return a.deliveryTime - b.deliveryTime;
          return b.rating - a.rating;
        }),
    [city, foodType, searchQuery, selectedCategory, sortBy, under100Only]
  );

  const mobileVisibleRestaurants = useMemo(() => {
    if (!isMobile || filteredRestaurants.length >= 30) return filteredRestaurants;

    return restaurants
      .filter((restaurant) => {
        const matchesCategory = selectedCategory === 'all' ? true : restaurant.category === selectedCategory;
        const matchesSearch =
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFoodType = foodType === 'all' ? true : foodType === 'veg' ? restaurant.pureVeg : !restaurant.pureVeg;
        const matchesBudget = under100Only ? restaurant.minOrder <= 100 : true;

        return matchesCategory && matchesSearch && matchesFoodType && matchesBudget;
      })
      .sort((a, b) => {
        if (sortBy === 'delivery') return a.deliveryTime - b.deliveryTime;
        return b.rating - a.rating;
      });
  }, [filteredRestaurants, foodType, isMobile, searchQuery, selectedCategory, sortBy, under100Only]);

  const mobileCategories = useMemo(
    () => [
      categories.find((item) => item.id === 'all'),
      categories.find((item) => item.id === 'pizza'),
      categories.find((item) => item.id === 'north-indian'),
      categories.find((item) => item.id === 'burger'),
      categories.find((item) => item.id === 'chinese'),
    ].filter(Boolean),
    []
  );

  const renderDesktop = () => (
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
        <img
          src={activeBanner.image}
          alt={activeBanner.title}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = FALLBACK_FOOD_IMAGE;
          }}
          className="w-full h-44 md:h-60 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 p-5 md:p-8 flex flex-col justify-center">
          <p className="text-zest-orange font-semibold text-sm mb-1">Limited Time</p>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">{activeBanner.title}</h2>
          <p className="text-white/85 mt-2">{activeBanner.subtitle}</p>
        </div>
      </motion.section>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-6">
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
      </div>
    </div>
  );

  const renderMobile = () => (
    <div className="pb-4">
      <div className="relative overflow-hidden bg-gradient-to-b from-sky-300 via-sky-500 to-blue-700 px-4 pt-5 pb-7">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_20%_30%,white,transparent_35%),radial-gradient(circle_at_85%_20%,white,transparent_25%),linear-gradient(to_right,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-[length:100%_100%,100%_100%,16px_16px]" />

        <div className="relative flex items-start justify-between">
          <div>
            <button
              onClick={() => setIsCityMenuOpen((prev) => !prev)}
              className="flex items-center gap-1 text-slate-900 font-extrabold text-[34px]"
            >
              <FaMapMarkerAlt className="text-black text-base" />
              <span className="text-[21px]">Work</span>
              <FaChevronDown className="text-xs" />
            </button>
            <p className="text-slate-900/80 text-base max-w-[210px] truncate">{city} Delivery Area</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-yellow-100 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full border border-yellow-700/30">
              GOLD Rs1
            </span>
            <button className="w-9 h-9 bg-white/75 rounded-full flex items-center justify-center">
              <FaTicketAlt className="text-slate-700" />
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="w-9 h-9 bg-white/75 rounded-full flex items-center justify-center"
            >
              <FaUserCircle className="text-blue-600 text-xl" />
            </button>
          </div>
        </div>

        {isCityMenuOpen && (
          <div className="relative mt-2 z-20 w-44 rounded-xl border border-slate-200 bg-white shadow-2xl">
            {cityOptions.map((item) => (
              <button
                key={item}
                onClick={() => {
                  selectManualCity(item);
                  setIsCityMenuOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-100 ${
                  item === city ? 'text-orange-500' : 'text-slate-700'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        )}
        

        <div className="relative mt-5">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500 text-xl" />
          <input
            ref={searchRef}
            type="text"
            placeholder='Search "chaat"'
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full bg-white rounded-2xl py-4 pl-12 pr-14 text-slate-700 placeholder-slate-400 text-2xl font-medium focus:outline-none"
          />
          <FaMicrophone className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500 text-xl" />
        </div>

        <div className="relative mt-4 rounded-3xl overflow-hidden">
          <img
            src={activeBanner.image}
            alt={activeBanner.title}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = FALLBACK_FOOD_IMAGE;
            }}
            className="w-full h-44 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 via-blue-900/20 to-transparent" />
          <div className="absolute inset-0 p-4 flex flex-col justify-center">
            <h2 className="text-4xl font-black text-white tracking-tight">MEALS UNDER Rs250</h2>
            <p className="mt-2 inline-flex self-start bg-rose-600 text-white text-xs px-2 py-1 rounded-md font-bold">
              FINAL PRICE, BEST OFFER APPLIED
            </p>
            <button className="mt-3 self-start bg-black text-white px-4 py-2 rounded-full text-sm font-semibold">
              Order now
            </button>
          </div>
        </div>

        <div className="relative mt-3 flex justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white/50" />
          <span className="w-2 h-2 rounded-full bg-white" />
          <span className="w-2 h-2 rounded-full bg-white/50" />
          <span className="w-2 h-2 rounded-full bg-white/50" />
        </div>
      </div>

      <div className="-mt-1 bg-slate-100 rounded-t-3xl pt-4 pb-2">
        <div className="px-4">
          <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-3">
            {mobileCategories.map((category) => {
              const isSelected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex-shrink-0 text-center"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-sm mx-auto">
                    <img
                      src={category.image}
                      alt={category.label}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = FALLBACK_FOOD_IMAGE;
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className={`mt-2 text-sm font-semibold ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                    {category.label}
                  </p>
                  <div className={`mt-2 h-1 rounded-full ${isSelected ? 'bg-rose-500' : 'bg-transparent'}`} />
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
            <button
              onClick={() => setSortBy(sortBy === 'rating' ? 'delivery' : 'rating')}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-semibold whitespace-nowrap inline-flex items-center gap-2"
            >
              <FaSlidersH />
              Filters
            </button>
            <button
              onClick={() => setSortBy('delivery')}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-semibold whitespace-nowrap inline-flex items-center gap-2"
            >
              <FaBolt className="text-emerald-500" />
              Near & Fast
            </button>
            <button
              onClick={() => setUnder100Only((prev) => !prev)}
              className={`px-4 py-2 rounded-xl border text-sm font-semibold whitespace-nowrap ${
                under100Only ? 'border-rose-500 text-rose-500 bg-rose-50' : 'border-slate-300 bg-white text-slate-700'
              }`}
            >
              Under Rs100
            </button>
            <button
              onClick={() => setFoodType(foodType === 'veg' ? 'all' : 'veg')}
              className={`px-4 py-2 rounded-xl border text-sm font-semibold whitespace-nowrap ${
                foodType === 'veg'
                  ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                  : 'border-slate-300 bg-white text-slate-700'
              }`}
            >
              Pure Veg
            </button>
          </div>
        </div>

        <div className="px-4 mt-4">
          <h2 className="text-slate-500 text-lg tracking-[0.22em] font-semibold mb-3">RECOMMENDED FOR YOU</h2>
          <div className="grid grid-cols-2 gap-3">
            {mobileVisibleRestaurants.slice(0, 35).map((restaurant) => (
              <button
                key={restaurant.id}
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                className="text-left"
              >
                <div className="relative rounded-2xl overflow-hidden h-28">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = FALLBACK_FOOD_IMAGE;
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-[11px] px-2 py-1 rounded-lg font-semibold">
                    {restaurant.offer}
                  </div>
                  <div className="absolute bottom-2 left-2 bg-emerald-700 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {restaurant.rating} ★
                  </div>
                </div>
                <p className="mt-2 text-slate-900 text-xl font-bold leading-tight line-clamp-1">{restaurant.name}</p>
                <p className="text-emerald-600 text-xl font-semibold leading-tight inline-flex items-center gap-1">
                  <FaBolt className="text-sm" />
                  {restaurant.deliveryTime}-{restaurant.deliveryTime + 5} mins
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <LocationPermissionModal />
      {isMobile ? renderMobile() : renderDesktop()}
    </MainLayout>
  );
};

export default Home;
