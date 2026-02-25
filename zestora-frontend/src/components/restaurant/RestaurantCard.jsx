import { motion } from 'framer-motion';
import { FaStar, FaClock, FaBolt } from 'react-icons/fa';
import Card from '../common/Card';

const RestaurantCard = ({ restaurant, onClick, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card onClick={onClick} className="group">
        <div className="relative h-52 overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />

          <div className="absolute top-3 left-3 bg-zest-orange text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
            {restaurant.offer}
          </div>
          <div className="absolute top-3 right-3 bg-zest-dark/80 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
            <FaStar className="text-yellow-400 text-sm" />
            <span className="text-white text-sm font-bold">{restaurant.rating}</span>
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white/90 text-sm font-medium">
            <FaClock className="text-zest-orange" />
            <span>{restaurant.deliveryTime} min</span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-zest-orange transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
            {restaurant.pureVeg && (
              <span className="text-[10px] font-semibold text-zest-success border border-zest-success rounded px-1.5 py-0.5">
                PURE VEG
              </span>
            )}
          </div>
          <p className="text-zest-muted text-sm mb-3 line-clamp-1">
            {restaurant.cuisine}
          </p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-zest-success">
              <FaBolt className="text-xs" />
              <span>{restaurant.distanceKm} km</span>
            </div>
            <div className="text-zest-muted">
              {restaurant.deliveryFee === 0 ? 'Free Delivery' : `Rs${restaurant.deliveryFee} delivery`}
            </div>
          </div>
          <div className="mt-2 text-zest-orange font-semibold text-sm">
            Min order Rs{restaurant.minOrder}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default RestaurantCard;
