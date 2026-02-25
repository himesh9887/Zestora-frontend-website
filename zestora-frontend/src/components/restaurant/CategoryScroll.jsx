import { motion } from 'framer-motion';
import { categories as defaultCategories } from '../../data/mockData';

const FALLBACK_FOOD_IMAGE = '/food/food-01.svg';

const CategoryScroll = ({ selected, onSelect, categories = defaultCategories }) => {
  return (
    <div className="relative">
      <div
        className="flex gap-3 overflow-x-auto scrollbar-hide py-1 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => {
          const isSelected = selected === category.id;

          return (
            <motion.button
              key={category.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(category.id)}
              className={`flex flex-col items-center gap-2 min-w-[84px] p-2 rounded-2xl transition-all border ${
                isSelected
                  ? 'bg-zest-orange/15 border-zest-orange text-white'
                  : 'bg-zest-card border-zest-muted/10 text-zest-muted hover:border-zest-muted/30'
              }`}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
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
              <span className="text-xs font-medium whitespace-nowrap">{category.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryScroll;
