import { motion } from 'framer-motion';
import { FaStar, FaClock, FaTruck } from 'react-icons/fa';
import Card from '../common/Card';

const RestaurantCard = ({ restaurant, onClick, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card onClick={onClick} className="group">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={restaurant.image} 
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zest-card via-transparent to-transparent" />
          
          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-zest-dark/80 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
            <FaStar className="text-yellow-400 text-sm" />
            <span className="text-white text-sm font-bold">{restaurant.rating}</span>
          </div>

          {/* Delivery Time */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white/90 text-sm">
            <FaClock className="text-zest-orange" />
            <span>{restaurant.deliveryTime} min</span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-zest-orange transition-colors">
            {restaurant.name}
          </h3>
          <p className="text-zest-muted text-sm mb-3 line-clamp-1">
            {restaurant.cuisine}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-zest-muted text-sm">
              <FaTruck className="text-zest-success" />
              <span>${restaurant.deliveryFee === 0 ? 'Free' : restaurant.deliveryFee}</span>
            </div>
            <div className="text-zest-orange font-semibold">
              ${restaurant.minOrder} min
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default RestaurantCard;