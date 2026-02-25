import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPizzaSlice, FaHamburger, FaDrumstickBite, FaFish, FaLeaf, FaIceCream, FaCoffee } from 'react-icons/fa';

const categories = [
  { id: 1, name: 'Pizza', icon: FaPizzaSlice },
  { id: 2, name: 'Burger', icon: FaHamburger },
  { id: 3, name: 'Chicken', icon: FaDrumstickBite },
  { id: 4, name: 'Seafood', icon: FaFish },
  { id: 5, name: 'Vegetarian', icon: FaLeaf },
  { id: 6, name: 'Dessert', icon: FaIceCream },
  { id: 7, name: 'Drinks', icon: FaCoffee },
];

const CategoryScroll = ({ selected, onSelect }) => {
  const scrollRef = useRef(null);

  return (
    <div className="relative">
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selected === category.id;
          
          return (
            <motion.button
              key={category.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(isSelected ? null : category.id)}
              className={`flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-2xl transition-all ${
                isSelected 
                  ? 'bg-zest-orange text-white shadow-lg shadow-orange-500/30' 
                  : 'bg-zest-card text-zest-muted hover:bg-zest-card/80'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryScroll;