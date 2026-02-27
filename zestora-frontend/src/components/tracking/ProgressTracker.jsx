import { motion } from 'framer-motion';
import { ORDER_STATUS } from '../../utils/constants';

const stepMeta = [
  { id: ORDER_STATUS.PREPARING, label: 'Preparing', color: '#FACC15' },
  { id: ORDER_STATUS.OUT_FOR_DELIVERY, label: 'Out for Delivery', color: '#3B82F6' },
  { id: ORDER_STATUS.DELIVERED, label: 'Delivered', color: '#22C55E' },
];

const ProgressTracker = ({ status }) => {
  const isCancelled = status === ORDER_STATUS.CANCELLED;
  const activeIndex = Math.max(0, stepMeta.findIndex((step) => step.id === status));
  const progressPercent = isCancelled ? 0 : (activeIndex / (stepMeta.length - 1)) * 100;

  return (
    <div className="bg-zest-card border border-zest-muted/20 rounded-2xl p-4 shadow-lg">
      <p className="text-zest-muted text-xs uppercase tracking-[0.2em] mb-4">Order Status</p>
      <div className="relative">
        <div className="absolute top-4 left-0 right-0 h-1 rounded-full bg-zest-muted/20" />
        <motion.div
          className="absolute top-4 left-0 h-1 rounded-full"
          style={{ backgroundColor: isCancelled ? '#EF4444' : stepMeta[activeIndex]?.color || '#FACC15' }}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />

        <div className="relative flex justify-between">
          {stepMeta.map((step, index) => {
            const reached = index <= activeIndex;
            return (
              <div key={step.id} className="flex flex-col items-center gap-2 w-24 text-center">
                <motion.div
                  animate={{
                    backgroundColor: reached ? step.color : 'rgba(255,255,255,0.12)',
                    scale: index === activeIndex ? [1, 1.08, 1] : 1,
                  }}
                  transition={{ duration: 0.4 }}
                  className="w-8 h-8 rounded-full border border-white/10"
                />
                <p className={`text-xs md:text-sm font-semibold ${reached ? 'text-zest-text' : 'text-zest-muted'}`}>{step.label}</p>
              </div>
            );
          })}
        </div>
      </div>
      {isCancelled && (
        <p className="mt-4 text-sm text-zest-danger font-medium">Order cancelled. No further live progress is available.</p>
      )}
    </div>
  );
};

export default ProgressTracker;
