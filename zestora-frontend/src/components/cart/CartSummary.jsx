import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import Button from '../common/Button';

const CartSummary = ({ subtotal, deliveryFee = 2.99, tax = 0, onCheckout }) => {
  const total = subtotal + deliveryFee + tax;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zest-card rounded-2xl p-6 border border-zest-muted/10 sticky top-24"
    >
      <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-zest-muted">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-zest-muted">
          <span>Delivery Fee</span>
          <span>${deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-zest-muted">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-zest-muted/20 pt-3 flex justify-between text-white font-bold text-lg">
          <span>Total</span>
          <span className="text-zest-orange">${total.toFixed(2)}</span>
        </div>
      </div>

      <Button 
        onClick={onCheckout} 
        className="w-full"
        size="lg"
      >
        Proceed to Checkout <FaArrowRight />
      </Button>
    </motion.div>
  );
};

export default CartSummary;