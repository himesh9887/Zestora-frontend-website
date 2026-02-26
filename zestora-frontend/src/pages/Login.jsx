import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password too short';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      login(
        { id: 1, name: 'John Doe', email: formData.email },
        'mock_token_' + Date.now()
      );
      setIsLoading(false);
      navigate('/home');
    }, 1500);
  };

  return (
    <AuthLayout isLogin={true}>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          icon={FaEnvelope}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            icon={FaLock}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[38px] text-zest-muted hover:text-zest-text transition-colors p-1"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="flex items-center justify-between text-sm gap-3">
          <label className="flex items-center gap-2 text-zest-muted cursor-pointer">
            <input type="checkbox" className="rounded border-zest-muted/20 bg-zest-card accent-zest-orange" />
            Remember me
          </label>
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-zest-orange hover:underline shrink-0 font-medium"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          className="w-full group !rounded-2xl"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <>
              Continue <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </form>

      <p className="text-center mt-6 sm:mt-7 text-zest-muted text-sm sm:text-base">
        Don't have an account?{' '}
        <Link to="/register" className="text-zest-orange font-semibold hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
