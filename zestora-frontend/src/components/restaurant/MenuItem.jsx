import { motion } from 'framer-motion';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';

const MenuItem = ({ item, restaurantId }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  
  const cartItem = cartItems.find(i => i.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    addToCart({
      ...item,
      restaurantId,
      restaurantName: item.restaurantName
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zest-card rounded-2xl p-4 flex gap-4 border border-zest-muted/10"
    >
      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-semibold text-white mb-1">{item.name}</h4>
          <p className="text-zest-muted text-sm line-clamp-2">{item.description}</p>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-zest-orange font-bold text-lg">Rs{item.price}</span>
          
          {quantity === 0 ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAdd}
              className="bg-zest-orange text-white p-2 rounded-xl hover:bg-orange-600 transition-colors"
            >
              <FaPlus size={16} />
            </motion.button>
          ) : (
            <div className="flex items-center gap-3 bg-zest-dark rounded-xl p-1">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => updateQuantity(item.id, quantity - 1)}
                className="p-2 text-zest-muted hover:text-white"
              >
                <FaMinus size={14} />
              </motion.button>
              <span className="text-white font-semibold w-6 text-center">{quantity}</span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => updateQuantity(item.id, quantity + 1)}
                className="p-2 text-zest-orange hover:text-orange-400"
              >
                <FaPlus size={14} />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItem;
