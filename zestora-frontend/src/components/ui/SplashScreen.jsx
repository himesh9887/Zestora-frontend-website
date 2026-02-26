import { motion } from 'framer-motion';
import { FaUtensils } from 'react-icons/fa';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-zest-dark flex flex-col items-center justify-center px-6">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-zest-orange/25 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15 }}
          className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center"
      >
        <div className="relative mx-auto h-24 w-24 sm:h-28 sm:w-28">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-[-10px] rounded-[2rem] border border-zest-orange/35"
          />
          <div className="h-full w-full bg-gradient-to-br from-zest-orange to-orange-600 rounded-[1.6rem] flex items-center justify-center shadow-2xl shadow-orange-500/35">
            <FaUtensils className="text-4xl sm:text-5xl text-white" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-7"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Zestora</h1>
          <p className="text-zest-muted mt-2 text-base sm:text-lg">Fresh food. Fast delivery.</p>
          <div className="mt-6 h-1.5 w-44 sm:w-56 mx-auto rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className="h-full w-1/2 bg-gradient-to-r from-zest-orange to-amber-300 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
