import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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
  FaStar,
  FaHeadset,
} from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import CategoryScroll from '../components/restaurant/CategoryScroll';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import LocationPermissionModal from '../components/ui/LocationPermissionModal';
import { categories, promoBanners, restaurants } from '../data/mockData';
import { useLocationState } from '../hooks/useLocationState';

const FALLBACK_FOOD_IMAGE = '/food/food-01.svg';
const categoryKeywordMap = {
  biryani: ['biryani'],
  'street-food': ['street', 'chaat', 'snacks'],
  seafood: ['seafood', 'fish', 'prawn'],
  healthy: ['healthy', 'salad', 'bowl'],
  wraps: ['wrap', 'roll'],
  momos: ['momo'],
  thali: ['thali'],
  cafe: ['cafe', 'coffee'],
  bakery: ['bakery', 'cake', 'pastry', 'donut'],
};

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { city } = useLocationState();

  const searchRef = useRef(null);
  const stickySearchRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [foodType, setFoodType] = useState('all');
  const [under100Only, setUnder100Only] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [heroSlide, setHeroSlide] = useState(0);
  const [vegModeEnabled, setVegModeEnabled] = useState(false);
  const [showFloatingSearch, setShowFloatingSearch] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const handleContactSupport = () => navigate('/support');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (location.hash === '#search') {
      if (showFloatingSearch) {
        stickySearchRef.current?.focus();
      } else {
        searchRef.current?.focus();
      }
    }
  }, [location.hash, showFloatingSearch]);

  const activeBanner = promoBanners[0];
  const mobileHeroBanners = useMemo(() => promoBanners.slice(0, 4), []);

  useEffect(() => {
    if (!isMobile || mobileHeroBanners.length <= 1) return undefined;
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % mobileHeroBanners.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [isMobile, mobileHeroBanners.length]);

  useEffect(() => {
    if (!isMobile) {
      setShowFloatingSearch(false);
      return undefined;
    }

    const handleScroll = () => {
      const y = window.scrollY;
      setShowFloatingSearch((prev) => {
        if (prev && y < 130) return false;
        if (!prev && y > 170) return true;
        return prev;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => setIsFiltering(false), 240);
    return () => clearTimeout(timer);
  }, [city, selectedCategory, searchQuery, sortBy, foodType, under100Only]);

  const selectedCategoryKeywords = useMemo(
    () => categoryKeywordMap[selectedCategory] || [selectedCategory.replace(/-/g, ' ')],
    [selectedCategory]
  );
  const selectedCategoryMeta = useMemo(
    () => categories.find((category) => category.id === selectedCategory) || categories[0],
    [selectedCategory]
  );

  const filteredRestaurants = useMemo(
    () =>
      restaurants
        .filter((restaurant) => {
          const matchesCity = restaurant.city === city;
          const matchesCategory =
            selectedCategory === 'all' ||
            restaurant.category === selectedCategory ||
            selectedCategoryKeywords.some((keyword) =>
              `${restaurant.name} ${restaurant.cuisine}`.toLowerCase().includes(keyword.toLowerCase())
            );
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
    [city, foodType, searchQuery, selectedCategory, selectedCategoryKeywords, sortBy, under100Only]
  );

  const mobileVisibleRestaurants = useMemo(() => {
    if (!isMobile || filteredRestaurants.length >= 30) return filteredRestaurants;
    return restaurants
      .filter((restaurant) => {
        const matchesCategory =
          selectedCategory === 'all' ||
          restaurant.category === selectedCategory ||
          selectedCategoryKeywords.some((keyword) =>
            `${restaurant.name} ${restaurant.cuisine}`.toLowerCase().includes(keyword.toLowerCase())
          );
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
  }, [filteredRestaurants, foodType, isMobile, searchQuery, selectedCategory, selectedCategoryKeywords, sortBy, under100Only]);

  const mobileCategories = useMemo(() => {
    const preferredOrder = [
      'all',
      'pizza',
      'north-indian',
      'burger',
      'south-indian',
      'chinese',
      'desserts',
      'drinks',
    ];

    const ordered = preferredOrder.map((id) => categories.find((item) => item.id === id)).filter(Boolean);
    const remaining = categories.filter((item) => !preferredOrder.includes(item.id));
    return [...ordered, ...remaining];
  }, []);

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
            onClick={() => navigate('/location')}
            className="flex items-center gap-1 text-zest-text font-semibold hover:text-zest-orange transition-colors"
          >
            {city} <FaChevronDown size={12} />
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative">
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

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-zest-text font-semibold text-base md:text-lg truncate">
            {selectedCategoryMeta?.label || 'All'} Picks
          </p>
          <p className="text-zest-muted text-sm">{filteredRestaurants.length} restaurants found</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-zest-orange/15 text-zest-orange text-xs font-semibold tracking-wide">
          LIVE FILTER
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        <button
          onClick={() => setSortBy(sortBy === 'rating' ? 'delivery' : 'rating')}
          className="px-4 py-2 rounded-xl border text-sm font-medium flex items-center gap-2 whitespace-nowrap bg-zest-card text-zest-muted border-zest-muted/20"
        >
          <FaSlidersH /> {sortBy === 'rating' ? 'Sort: Rating' : 'Sort: Delivery'}
        </button>
        <button
          onClick={() => setFoodType(foodType === 'veg' ? 'all' : 'veg')}
          className={`px-4 py-2 rounded-xl border text-sm font-medium flex items-center gap-2 whitespace-nowrap ${
            foodType === 'veg' ? 'bg-zest-orange text-white border-zest-orange' : 'bg-zest-card text-zest-muted border-zest-muted/20'
          }`}
        >
          <FaLeaf /> Veg
        </button>
        <button
          onClick={() => setFoodType(foodType === 'nonveg' ? 'all' : 'nonveg')}
          className={`px-4 py-2 rounded-xl border text-sm font-medium flex items-center gap-2 whitespace-nowrap ${
            foodType === 'nonveg' ? 'bg-zest-orange text-white border-zest-orange' : 'bg-zest-card text-zest-muted border-zest-muted/20'
          }`}
        >
          <FaDrumstickBite /> Non-Veg
        </button>
      </div>

      <motion.div
        key={`desktop-grid-${city}-${selectedCategory}-${searchQuery}-${sortBy}-${foodType}-${under100Only}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isFiltering ? 0.55 : 1 }}
        transition={{ duration: 0.25 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant, index) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              index={index}
              onClick={() => navigate(`/restaurant/${restaurant.id}`)}
            />
          ))
        ) : (
          <div className="col-span-full rounded-3xl border border-zest-muted/20 bg-zest-card/70 p-7 md:p-10 text-center">
            <p className="text-zest-text text-xl font-bold">No matches found</p>
            <p className="text-zest-muted mt-2">Try changing category or clearing filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setSortBy('rating');
                setFoodType('all');
                setUnder100Only(false);
              }}
              className="mt-5 px-5 py-2.5 rounded-xl bg-zest-orange text-white font-semibold hover:bg-orange-600 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );

  const renderMobile = () => (
    <div className="pb-4 bg-zest-dark text-zest-text">
      <div className="relative overflow-hidden bg-gradient-to-b from-sky-300 via-blue-500 to-blue-700 px-4 pt-5 pb-4">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_20%_30%,white,transparent_35%),radial-gradient(circle_at_85%_20%,white,transparent_25%),linear-gradient(to_right,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-[length:100%_100%,100%_100%,16px_16px]" />

        <div className="relative flex items-start justify-between mb-4">
          <div>
            <button onClick={() => navigate('/location')} className="flex items-center gap-1 text-slate-900 font-bold text-[32px]">
              <FaMapMarkerAlt className="text-slate-900 text-base" />
              <span className="text-[20px]">Work</span>
              <FaChevronDown className="text-xs mt-0.5" />
            </button>
            <p className="text-slate-900/85 text-base max-w-[210px] truncate">{city} Delivery Area</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-yellow-100 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full border border-yellow-700/30">GOLD Rs1</span>
            <button className="w-9 h-9 bg-white/80 rounded-full flex items-center justify-center">
              <FaTicketAlt className="text-slate-700" />
            </button>
            <button onClick={() => navigate('/profile')} className="w-9 h-9 bg-white/80 rounded-full flex items-center justify-center">
              <FaUserCircle className="text-blue-600 text-xl" />
            </button>
          </div>
        </div>

        <div className="relative mb-3 flex items-center gap-2">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-500 text-base pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              placeholder='Search "chaat"'
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full bg-white rounded-2xl h-12 pl-11 pr-12 text-[20px] leading-none text-slate-700 placeholder-slate-400 border border-white/80 focus:outline-none focus:ring-2 focus:ring-rose-300/70"
            />
            <div className="absolute right-0 top-0 h-12 w-11 border-l border-slate-200/80 flex items-center justify-center rounded-r-2xl">
              <FaMicrophone className="text-rose-500 text-base" />
            </div>
          </div>
          <button
            onClick={() => setVegModeEnabled((prev) => !prev)}
            className={`w-[58px] h-12 rounded-2xl text-[10px] font-bold leading-tight flex flex-col items-center justify-center transition-colors ${
              vegModeEnabled ? 'bg-emerald-100 text-emerald-800 border border-emerald-400/50' : 'bg-white/85 text-slate-700'
            }`}
          >
            <motion.span
              animate={vegModeEnabled ? { scale: [1, 1.18, 1], rotate: [0, -8, 8, 0] } : { scale: 1, rotate: 0 }}
              transition={{ duration: 1.1, repeat: vegModeEnabled ? Infinity : 0 }}
              className={`${vegModeEnabled ? 'text-emerald-600' : 'text-slate-500'}`}
            >
              <FaLeaf className="text-xs" />
            </motion.span>
            <span className="mt-0.5">VEG</span>
            <span>MODE</span>
          </button>
        </div>

        <div className="relative rounded-3xl overflow-hidden h-44">
          <div className="absolute inset-0 flex transition-transform duration-500" style={{ transform: `translateX(-${heroSlide * 100}%)` }}>
            {mobileHeroBanners.map((banner) => (
              <img
                key={banner.id}
                src={banner.image}
                alt={banner.title}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = FALLBACK_FOOD_IMAGE;
                }}
                className="w-full h-44 shrink-0 object-cover"
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-900/30 to-transparent" />
          <div className="absolute inset-0 p-4 flex flex-col justify-center">
            <h2 className="text-4xl font-black text-white tracking-tight">MEALS UNDER Rs250</h2>
            <p className="mt-2 inline-flex self-start bg-rose-600 text-white text-xs px-2 py-1 rounded-sm font-bold">FINAL PRICE, BEST OFFER APPLIED</p>
            <button className="mt-3 self-start bg-black/90 text-white text-sm font-semibold px-4 py-1.5 rounded-full">Order now</button>
          </div>
        </div>

        <div className="relative mt-3 flex items-center justify-center gap-1.5">
          {mobileHeroBanners.map((banner, idx) => (
            <button
              key={banner.id}
              onClick={() => setHeroSlide(idx)}
              className={`h-1.5 rounded-full transition-all ${heroSlide === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/55'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <div
        className={`fixed top-0 left-0 right-0 z-40 bg-zest-dark/95 backdrop-blur-md border-b border-zest-muted/20 px-4 py-2 transition-all duration-300 ${
          showFloatingSearch ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-3 pointer-events-none'
        }`}
      >
          <div className="relative flex items-center gap-2 max-w-7xl mx-auto">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-500 text-base pointer-events-none" />
              <input
                ref={stickySearchRef}
                type="text"
                placeholder='Search "chaat"'
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full bg-white rounded-2xl h-11 pl-11 pr-12 text-base leading-none text-slate-700 placeholder-slate-400 border border-white/80 focus:outline-none focus:ring-2 focus:ring-rose-300/70"
              />
              <div className="absolute right-0 top-0 h-11 w-11 border-l border-slate-200/80 flex items-center justify-center rounded-r-2xl">
                <FaMicrophone className="text-rose-500 text-base" />
              </div>
            </div>
            <button
              onClick={() => setVegModeEnabled((prev) => !prev)}
              className={`w-[58px] h-11 rounded-2xl text-[10px] font-bold leading-tight flex flex-col items-center justify-center transition-colors ${
                vegModeEnabled ? 'bg-emerald-100 text-emerald-800 border border-emerald-400/50' : 'bg-white/85 text-slate-700'
              }`}
            >
              <motion.span
                animate={vegModeEnabled ? { scale: [1, 1.18, 1], rotate: [0, -8, 8, 0] } : { scale: 1, rotate: 0 }}
                transition={{ duration: 1.1, repeat: vegModeEnabled ? Infinity : 0 }}
                className={`${vegModeEnabled ? 'text-emerald-600' : 'text-slate-500'}`}
              >
                <FaLeaf className="text-xs" />
              </motion.span>
              <span className="mt-0.5">VEG</span>
              <span>MODE</span>
            </button>
          </div>
        </div>

      <div
        className={`sticky ${showFloatingSearch ? 'top-[58px]' : 'top-0'} z-20 bg-zest-dark/95 backdrop-blur-md border-b border-zest-muted/20 px-4 pt-1 pb-2 transition-[top] duration-300`}
      >
        <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-1">
          {mobileCategories.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <button key={category.id} onClick={() => setSelectedCategory(category.id)} className="flex-shrink-0 text-center">
                <div
                  className={`w-16 h-16 rounded-full overflow-hidden bg-zest-card shadow-sm mx-auto border transition-all ${
                    isSelected ? 'border-zest-orange ring-2 ring-zest-orange/30 scale-105' : 'border-zest-muted/20'
                  }`}
                >
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
                <p className={`mt-2 text-sm font-semibold ${isSelected ? 'text-zest-text' : 'text-zest-muted'}`}>{category.label}</p>
                <div className={`mt-2 h-1 rounded-full transition-all ${isSelected ? 'bg-zest-orange w-full' : 'bg-transparent w-6 mx-auto'}`} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2 mb-3">
          <button
            onClick={() => setSortBy(sortBy === 'rating' ? 'delivery' : 'rating')}
            className="px-4 py-2 rounded-xl border border-zest-muted/20 bg-zest-card text-zest-muted text-sm font-semibold whitespace-nowrap inline-flex items-center gap-2"
          >
            <FaSlidersH />
            Filters
          </button>
          <button
            onClick={() => setSortBy('delivery')}
            className="px-4 py-2 rounded-xl border border-zest-muted/20 bg-zest-card text-zest-muted text-sm font-semibold whitespace-nowrap inline-flex items-center gap-2"
          >
            <FaBolt className="text-zest-success" />
            Near & Fast
          </button>
          <button
            onClick={() => setUnder100Only((prev) => !prev)}
            className={`px-4 py-2 rounded-xl border text-sm font-semibold whitespace-nowrap ${
              under100Only ? 'border-zest-orange text-zest-orange bg-zest-orange/10' : 'border-zest-muted/20 bg-zest-card text-zest-muted'
            }`}
          >
            Under Rs100
          </button>
          <button
            onClick={() => setFoodType(foodType === 'veg' ? 'all' : 'veg')}
            className={`px-4 py-2 rounded-xl border text-sm font-semibold whitespace-nowrap ${
              foodType === 'veg' ? 'border-zest-success text-zest-success bg-zest-success/10' : 'border-zest-muted/20 bg-zest-card text-zest-muted'
            }`}
          >
            Pure Veg
          </button>
        </div>

        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-zest-muted text-sm tracking-[0.22em] font-semibold">RECOMMENDED FOR YOU</h2>
          <p className="text-zest-muted text-xs">{mobileVisibleRestaurants.length} found</p>
        </div>
        <motion.div
          key={`mobile-grid-${city}-${selectedCategory}-${searchQuery}-${sortBy}-${foodType}-${under100Only}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isFiltering ? 0.6 : 1 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-2 gap-3"
        >
          <AnimatePresence mode="popLayout">
            {mobileVisibleRestaurants.length > 0 ? (
              mobileVisibleRestaurants.slice(0, 35).map((restaurant, index) => (
                <motion.button
                  key={restaurant.id}
                  onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                  className="text-left"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, delay: Math.min(index * 0.04, 0.28) }}
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
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-[11px] px-2 py-1 rounded-lg font-semibold">{restaurant.offer}</div>
                    <div className="absolute bottom-2 left-2 bg-zest-success text-white text-xs px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1">
                      <span>{restaurant.rating}</span>
                      <FaStar className="text-[9px]" />
                    </div>
                  </div>
                  <p className="mt-2 text-zest-text text-lg font-bold leading-tight line-clamp-1">{restaurant.name}</p>
                  <p className="text-zest-success text-base font-semibold leading-tight inline-flex items-center gap-1">
                    <FaBolt className="text-xs" />
                    {restaurant.deliveryTime}-{restaurant.deliveryTime + 5} mins
                  </p>
                </motion.button>
              ))
            ) : (
              <motion.div
                key="mobile-empty-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="col-span-2 rounded-2xl border border-zest-muted/20 bg-zest-card/70 p-5 text-center"
              >
                <p className="text-zest-text font-semibold">No food found in this filter</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setSortBy('rating');
                    setFoodType('all');
                    setUnder100Only(false);
                  }}
                  className="mt-3 px-4 py-2 rounded-lg bg-zest-orange text-white text-sm font-semibold"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <LocationPermissionModal />
      <button
        onClick={handleContactSupport}
        aria-label="Contact support"
        className="fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+88px)] md:bottom-6 z-[60] inline-flex items-center justify-center rounded-full border border-zest-orange/40 bg-zest-orange text-white shadow-lg shadow-zest-orange/35 hover:bg-orange-600 transition-colors w-12 h-12 md:w-auto md:h-auto md:px-4 md:py-2 md:gap-2 md:text-sm md:font-semibold"
      >
        <FaHeadset className="text-base md:text-sm" />
        <span className="hidden md:inline">Support</span>
      </button>
      {isMobile ? renderMobile() : renderDesktop()}
    </MainLayout>
  );
};

export default Home;
