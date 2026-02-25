import { motion } from 'framer-motion';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-zest-card rounded-2xl p-4 flex gap-4 border border-zest-muted/10"
    >
      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold text-white">{item.name}</h4>
            <p className="text-zest-muted text-xs">{item.restaurantName}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => removeFromCart(item.id)}
            className="text-zest-muted hover:text-zest-danger p-1"
          >
            <FaTrash size={16} />
          </motion.button>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-zest-orange font-bold">${(item.price * item.quantity).toFixed(2)}</span>
          
          <div className="flex items-center gap-2 bg-zest-dark rounded-xl p-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-2 text-zest-muted hover:text-white"
            >
              <FaMinus size={12} />
            </motion.button>
            <span className="text-white font-semibold w-6 text-center text-sm">{item.quantity}</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-2 text-zest-orange hover:text-orange-400"
            >
              <FaPlus size={12} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;