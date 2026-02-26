import { motion } from 'framer-motion';
import { FaStar, FaUtensils } from 'react-icons/fa';

const AuthLayout = ({ children, isLogin = true }) => {
  return (
    <div className="relative min-h-screen bg-zest-dark overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-zest-orange/30 blur-3xl" />
        <div className="absolute top-24 -right-16 h-52 w-52 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute bottom-0 -left-20 h-56 w-56 rounded-full bg-red-500/20 blur-3xl" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 md:px-8 md:py-10">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1.05fr,0.95fr] gap-6 lg:gap-8 items-center">
          <motion.section
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            className="hidden lg:block"
          >
            <div className="rounded-[2rem] border border-zest-muted/20 bg-zest-card/65 backdrop-blur-xl p-8 xl:p-10 shadow-2xl shadow-black/25">
              <div className="inline-flex items-center gap-2 rounded-full border border-zest-orange/35 bg-zest-orange/10 px-4 py-2 text-zest-orange font-semibold">
                <FaUtensils /> Zestora
              </div>
              <h1 className="text-5xl xl:text-6xl font-bold text-zest-text mt-7 leading-tight">
                {isLogin ? 'Good Food, Fast Login.' : 'Create. Order. Enjoy.'}
              </h1>
              <p className="mt-4 text-zest-muted text-lg">
                {isLogin ? 'Welcome back. Your favorite meals are waiting.' : 'Set up your account and start ordering in minutes.'}
              </p>
              <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-zest-dark/55 border border-zest-muted/15 p-4">
                  <p className="text-xl font-bold text-zest-text">500+</p>
                  <p className="text-xs text-zest-muted mt-1">Restaurants</p>
                </div>
                <div className="rounded-2xl bg-zest-dark/55 border border-zest-muted/15 p-4">
                  <p className="text-xl font-bold text-zest-text">4.9</p>
                  <p className="text-xs text-zest-muted mt-1">Ratings</p>
                </div>
                <div className="rounded-2xl bg-zest-dark/55 border border-zest-muted/15 p-4">
                  <p className="text-xl font-bold text-zest-text">30m</p>
                  <p className="text-xs text-zest-muted mt-1">Delivery</p>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full rounded-[1.75rem] border border-zest-muted/20 bg-zest-card/85 backdrop-blur-xl shadow-2xl shadow-black/30 px-5 py-6 sm:px-8 sm:py-8"
          >
            <div className="text-center mb-6 sm:mb-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-zest-orange/30 bg-zest-orange/10 px-3 py-1.5 text-zest-orange text-sm font-semibold">
                <FaStar className="text-xs" /> Modern Food Experience
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zest-text mt-4">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h2>
              <p className="text-zest-muted mt-2 text-sm sm:text-base">
                {isLogin ? 'Continue to your account securely' : 'Register and unlock quick checkout'}
              </p>
            </div>

            {children}
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
