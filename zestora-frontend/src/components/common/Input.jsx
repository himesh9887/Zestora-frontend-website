import { motion } from 'framer-motion';

const Input = ({ 
  label, 
  error, 
  icon: Icon, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-zest-muted mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zest-muted">
            <Icon size={20} />
          </div>
        )}
        <motion.input
          whileHover={{ y: -1 }}
          whileFocus={{ scale: 1.01 }}
          className={`w-full bg-zest-card border border-zest-muted/20 rounded-xl py-3.5 px-4 
            ${Icon ? 'pl-12' : ''} text-zest-text placeholder-zest-muted/50
            hover:border-zest-orange/50 focus:outline-none focus:border-zest-orange focus:ring-2 focus:ring-zest-orange/20
            transition-all duration-300`}
          {...props}
        />
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-zest-danger text-sm mt-2"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;
