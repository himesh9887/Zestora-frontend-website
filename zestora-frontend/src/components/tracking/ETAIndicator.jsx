import { AnimatePresence, motion } from 'framer-motion';

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const ETAIndicator = ({ etaMinutes, totalMinutes = 30, delivered = false }) => {
  const safeEta = Math.max(0, etaMinutes);
  const progress = delivered ? 1 : Math.min(1, (totalMinutes - safeEta) / totalMinutes);
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const isUrgent = safeEta <= 5 && safeEta > 0;

  return (
    <div className="bg-zest-card border border-zest-muted/20 rounded-2xl p-4 shadow-lg">
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={RADIUS} stroke="rgba(255,255,255,0.12)" strokeWidth="8" fill="none" />
            <motion.circle
              cx="50"
              cy="50"
              r={RADIUS}
              stroke={delivered ? '#22C55E' : isUrgent ? '#EF4444' : '#FF6B00'}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={delivered ? 'done' : safeEta}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-xl font-black text-zest-text"
              >
                {delivered ? '0' : safeEta}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-zest-muted text-xs uppercase tracking-[0.2em]">Estimated Arrival</p>
          <p className={`text-lg md:text-xl font-bold ${delivered ? 'text-zest-success' : isUrgent ? 'text-zest-danger' : 'text-zest-text'}`}>
            {delivered ? 'Delivered' : `Arriving in ${safeEta} minutes`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ETAIndicator;
