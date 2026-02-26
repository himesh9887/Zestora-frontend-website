import { AnimatePresence, motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useUI } from '../../hooks/useUI';

const ToastContainer = () => {
  const { toasts, theme } = useUI();

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-4 z-[110] space-y-2 pointer-events-none w-[calc(100%-1.5rem)] md:w-auto max-w-md"
      style={{ top: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className={`px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md flex items-center gap-2 w-full md:min-w-[260px] ${
              toast.type === 'error'
                ? 'bg-red-600/95 border-red-300/50 text-white'
                : theme === 'light'
                  ? 'bg-white/95 border-slate-200 text-slate-800'
                  : 'bg-zest-card/95 border-zest-muted/20 text-white'
            }`}
          >
            {toast.type === 'error' ? (
              <FaExclamationCircle className="text-white text-base flex-shrink-0" />
            ) : (
              <FaCheckCircle className="text-zest-success text-base flex-shrink-0" />
            )}
            <p className="text-sm font-medium leading-5">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
