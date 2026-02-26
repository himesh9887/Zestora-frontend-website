import { AnimatePresence, motion } from 'framer-motion';
import { FaBan, FaCheckCircle } from 'react-icons/fa';
import { ORDER_STATUS } from '../../utils/constants';

const statusMeta = {
  [ORDER_STATUS.PREPARING]: { label: 'Preparing', className: 'bg-yellow-500/15 text-yellow-300 border-yellow-400/40' },
  [ORDER_STATUS.OUT_FOR_DELIVERY]: { label: 'Out for Delivery', className: 'bg-blue-500/15 text-blue-300 border-blue-400/40' },
  [ORDER_STATUS.DELIVERED]: { label: 'Delivered', className: 'bg-zest-success/15 text-zest-success border-zest-success/40' },
  [ORDER_STATUS.CANCELLED]: { label: 'Cancelled', className: 'bg-zest-danger/15 text-zest-danger border-zest-danger/40' },
};

const OrderStatusCard = ({ order, status, onCancel, cancelling }) => {
  const meta = statusMeta[status] || statusMeta[ORDER_STATUS.PREPARING];
  const canCancel = status === ORDER_STATUS.PREPARING;

  return (
    <div className="bg-zest-card border border-zest-muted/20 rounded-2xl p-4 shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-zest-muted text-xs uppercase tracking-[0.2em]">Order ID</p>
          <p className="text-zest-text font-bold">{order.id}</p>
          <p className="text-zest-muted text-sm">{order.restaurantName}</p>
        </div>
        <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${meta.className}`}>{meta.label}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={status}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mt-3 text-sm text-zest-muted"
        >
          {status === ORDER_STATUS.PREPARING && 'Restaurant is preparing your food.'}
          {status === ORDER_STATUS.OUT_FOR_DELIVERY && 'Rider is on the way with your order.'}
          {status === ORDER_STATUS.DELIVERED && 'Order delivered successfully. Enjoy your meal.'}
          {status === ORDER_STATUS.CANCELLED && 'Order was cancelled.'}
        </motion.p>
      </AnimatePresence>

      <div className="mt-4 flex gap-2">
        {canCancel && (
          <button
            onClick={onCancel}
            disabled={cancelling}
            className="flex-1 h-10 rounded-xl border border-zest-danger/50 text-zest-danger hover:bg-zest-danger/10 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <FaBan />
            {cancelling ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}
        {status === ORDER_STATUS.DELIVERED && (
          <div className="flex-1 h-10 rounded-xl bg-zest-success/15 text-zest-success inline-flex items-center justify-center gap-2 font-semibold">
            <FaCheckCircle />
            Completed
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatusCard;
