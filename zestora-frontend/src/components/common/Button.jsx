import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick,
  type = 'button',
  disabled = false,
  ...props 
}) => {
  const baseStyles = 'rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-zest-orange to-orange-600 text-white hover:shadow-lg hover:shadow-orange-500/30',
    secondary: 'bg-zest-card text-zest-text border border-zest-muted/20 hover:border-zest-orange/50',
    outline: 'border-2 border-zest-orange text-zest-orange hover:bg-zest-orange hover:text-white',
    danger: 'bg-zest-danger text-white hover:bg-red-600',
    ghost: 'text-zest-muted hover:text-zest-text hover:bg-white/5',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;