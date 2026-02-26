import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setError('Please enter a valid email');
      return;
    }

    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1200);
  };

  return (
    <AuthLayout isLogin={true}>
      {isSent ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-zest-success/20 border border-zest-success/35 text-zest-success flex items-center justify-center mb-4">
            <FaPaperPlane />
          </div>
          <h3 className="text-xl font-bold text-zest-text">Reset Link Sent</h3>
          <p className="text-zest-muted mt-2 text-sm sm:text-base">
            Password reset link has been sent to <span className="text-zest-text font-medium">{email}</span>.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-xl border border-zest-orange/40 text-zest-orange hover:bg-zest-orange/10 transition-colors"
          >
            <FaArrowLeft className="text-xs" /> Back to Login
          </Link>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            icon={FaEnvelope}
            error={error}
          />

          <Button type="submit" className="w-full !rounded-2xl" size="lg" disabled={isLoading}>
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              'Send Reset Link'
            )}
          </Button>

          <div className="text-center">
            <Link to="/login" className="text-sm text-zest-orange hover:underline inline-flex items-center gap-2">
              <FaArrowLeft className="text-xs" /> Back to Login
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
