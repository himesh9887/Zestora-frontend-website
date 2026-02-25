import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import Button from '../common/Button';
import { calculateCartTotals, formatCurrency } from '../../utils/helpers';

const CartSummary = ({ subtotal, onCheckout }) => {
  const totals = calculateCartTotals(subtotal);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zest-card rounded-2xl p-6 border border-zest-muted/10 sticky top-24"
    >
      <h3 className="text-lg font-bold text-zest-text mb-4">Order Summary</h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-zest-muted">
          <span>Subtotal</span>
          <span>{formatCurrency(totals.subtotal)}</span>
        </div>
        <div className="flex justify-between text-zest-muted">
          <span>Delivery Fee</span>
          <span>{formatCurrency(totals.deliveryFee)}</span>
        </div>
        <div className="flex justify-between text-zest-muted">
          <span>Platform Fee</span>
          <span>{formatCurrency(totals.platformFee)}</span>
        </div>
        <div className="flex justify-between text-zest-muted">
          <span>GST (5%)</span>
          <span>{formatCurrency(totals.gst)}</span>
        </div>
        <div className="border-t border-zest-muted/20 pt-3 flex justify-between text-zest-text font-bold text-lg">
          <span>To Pay</span>
          <span className="text-zest-orange">{formatCurrency(totals.grandTotal)}</span>
        </div>
      </div>

      <Button onClick={onCheckout} className="w-full" size="lg">
        Proceed to Checkout <FaArrowRight />
      </Button>
    </motion.div>
  );
};

export default CartSummary;
