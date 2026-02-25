import { motion } from 'framer-motion';
import { FaUtensils } from 'react-icons/fa';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 bg-zest-dark flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 1 
        }}
        className="relative"
      >
        <div className="w-32 h-32 bg-gradient-to-br from-zest-orange to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/30">
          <FaUtensils className="text-5xl text-white" />
        </div>
        
        {/* Orbiting dots */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 -m-4"
        >
          <div className="w-4 h-4 bg-zest-orange rounded-full absolute top-0 left-1/2 -translate-x-1/2" />
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-4xl font-bold text-white mt-8 tracking-tight"
      >
        Zestora
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="text-zest-muted mt-2 text-lg"
      >
        Premium Food Delivery
      </motion.p>

      {/* Loading bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 200 }}
        transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
        className="h-1 bg-gradient-to-r from-zest-orange to-orange-400 rounded-full mt-8"
      />
    </div>
  );
};

export default SplashScreen;