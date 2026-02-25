import { AnimatePresence, motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useUI } from '../../hooks/useUI';

const ToastContainer = () => {
  const { toasts } = useUI();

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className={`px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md flex items-center gap-2 min-w-[240px] ${
              toast.type === 'error'
                ? 'bg-red-500/20 border-red-500/40 text-white'
                : 'bg-zest-card/95 border-zest-muted/20 text-white'
            }`}
          >
            {toast.type === 'error' ? <FaExclamationCircle /> : <FaCheckCircle className="text-zest-success" />}
            <p className="text-sm font-medium">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
