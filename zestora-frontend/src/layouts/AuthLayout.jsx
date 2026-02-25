import { motion } from 'framer-motion';

const AuthLayout = ({ children, isLogin = true }) => {
  return (
    <div className="min-h-screen bg-zest-dark flex">
      {/* Desktop Side Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-zest-orange to-orange-700 items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white text-center"
        >
          <h1 className="text-6xl font-bold mb-6">Zestora</h1>
          <p className="text-2xl font-light opacity-90">
            {isLogin ? 'Welcome back, food lover!' : 'Join the food revolution'}
          </p>
          <div className="mt-12 grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <div className="text-4xl font-bold">500+</div>
              <div className="text-sm opacity-80">Restaurants</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <div className="text-4xl font-bold">50k+</div>
              <div className="text-sm opacity-80">Happy Customers</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-4xl font-bold text-zest-orange mb-2">Zestora</h1>
            <p className="text-zest-muted">
              {isLogin ? 'Sign in to continue' : 'Create your account'}
            </p>
          </div>
          
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;