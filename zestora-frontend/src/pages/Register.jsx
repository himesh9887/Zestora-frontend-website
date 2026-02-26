import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaGoogle, FaMobileAlt, FaCheckCircle } from 'react-icons/fa';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useUI();
  const [authMethod, setAuthMethod] = useState('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [phoneData, setPhoneData] = useState({
    name: '',
    phone: '',
    otp: '',
    generatedOtp: '',
    isOtpSent: false,
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!acceptTerms) newErrors.acceptTerms = 'Please accept Terms & Privacy Policy';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      register(
        { id: 1, name: formData.name, email: formData.email },
        'mock_token_' + Date.now()
      );
      setIsLoading(false);
      navigate('/home');
    }, 1500);
  };

  const handleGoogleRegister = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      const random = Math.floor(100 + Math.random() * 900);
      register(
        {
          id: Date.now(),
          name: `Google User ${random}`,
          email: `googleuser${random}@gmail.com`,
          authProvider: 'google',
        },
        `google_mock_token_${Date.now()}`
      );
      setIsGoogleLoading(false);
      showToast('Signed up with Google');
      navigate('/home');
    }, 1200);
  };

  const handleSendOtp = () => {
    const trimmedPhone = phoneData.phone.trim();
    const trimmedName = phoneData.name.trim();

    if (!trimmedName) {
      showToast('Please enter your full name', 'error');
      return;
    }
    if (!/^\d{10}$/.test(trimmedPhone)) {
      showToast('Enter valid 10 digit phone number', 'error');
      return;
    }
    if (!acceptTerms) {
      showToast('Please accept Terms & Privacy Policy', 'error');
      return;
    }

    setIsOtpSending(true);
    setTimeout(() => {
      const generatedOtp = String(100000 + Math.floor(Math.random() * 900000));
      setPhoneData((prev) => ({ ...prev, generatedOtp, isOtpSent: true }));
      setIsOtpSending(false);
      showToast(`Demo OTP: ${generatedOtp}`);
    }, 900);
  };

  const handleVerifyOtp = () => {
    if (!phoneData.isOtpSent) {
      showToast('Please request OTP first', 'error');
      return;
    }
    if (!/^\d{6}$/.test(phoneData.otp.trim())) {
      showToast('Enter valid 6 digit OTP', 'error');
      return;
    }
    if (phoneData.otp.trim() !== phoneData.generatedOtp) {
      showToast('Incorrect OTP, please try again', 'error');
      return;
    }

    setIsOtpVerifying(true);
    setTimeout(() => {
      const phone = phoneData.phone.trim();
      register(
        {
          id: Date.now(),
          name: phoneData.name.trim(),
          phone,
          email: `${phone}@phone.zestora`,
          authProvider: 'phone',
        },
        `phone_mock_token_${Date.now()}`
      );
      setIsOtpVerifying(false);
      showToast('Phone number verified and account created');
      navigate('/home');
    }, 1000);
  };

  return (
    <AuthLayout isLogin={false}>
      <div className="space-y-5">
        <Button
          type="button"
          variant="secondary"
          className="w-full !rounded-2xl !border-zest-muted/25 hover:!border-zest-orange/60"
          onClick={handleGoogleRegister}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-zest-orange border-t-transparent rounded-full"
            />
          ) : (
            <>
              <FaGoogle className="text-zest-orange" /> Continue with Google
            </>
          )}
        </Button>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zest-muted/25" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-[0.2em]">
            <span className="bg-zest-card px-3 text-zest-muted">or sign up with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-zest-dark/45 p-1">
          <button
            type="button"
            onClick={() => setAuthMethod('email')}
            className={`rounded-xl py-2.5 text-sm font-medium transition-colors ${
              authMethod === 'email' ? 'bg-zest-orange text-white' : 'text-zest-muted hover:text-zest-text'
            }`}
          >
            <span className="inline-flex items-center gap-2"><FaEnvelope className="text-xs" /> Email</span>
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod('phone')}
            className={`rounded-xl py-2.5 text-sm font-medium transition-colors ${
              authMethod === 'phone' ? 'bg-zest-orange text-white' : 'text-zest-muted hover:text-zest-text'
            }`}
          >
            <span className="inline-flex items-center gap-2"><FaMobileAlt className="text-xs" /> Phone</span>
          </button>
        </div>

        {authMethod === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4 sm:space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your name"
              icon={FaUser}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
            />

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
                placeholder="Create password"
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

            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                icon={FaLock}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-[38px] text-zest-muted hover:text-zest-text transition-colors p-1"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <label className="flex items-start gap-2 text-sm text-zest-muted cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(event) => setAcceptTerms(event.target.checked)}
                className="mt-1 rounded border-zest-muted/25 bg-zest-card accent-zest-orange"
              />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </label>
            {errors.acceptTerms ? <p className="text-zest-danger text-sm -mt-3">{errors.acceptTerms}</p> : null}

            <Button type="submit" className="w-full group !rounded-2xl" size="lg" disabled={isLoading}>
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  Create Account <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your name"
              icon={FaUser}
              value={phoneData.name}
              onChange={(event) => setPhoneData((prev) => ({ ...prev, name: event.target.value }))}
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="10 digit mobile number"
              icon={FaMobileAlt}
              value={phoneData.phone}
              onChange={(event) =>
                setPhoneData((prev) => ({
                  ...prev,
                  phone: event.target.value.replace(/\D/g, '').slice(0, 10),
                }))
              }
            />

            <label className="flex items-start gap-2 text-sm text-zest-muted cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(event) => setAcceptTerms(event.target.checked)}
                className="mt-1 rounded border-zest-muted/25 bg-zest-card accent-zest-orange"
              />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </label>

            <Button
              type="button"
              onClick={handleSendOtp}
              className="w-full !rounded-2xl"
              disabled={isOtpSending}
            >
              {isOtpSending ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : phoneData.isOtpSent ? (
                'Resend OTP'
              ) : (
                'Send OTP'
              )}
            </Button>

            {phoneData.isOtpSent && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 rounded-2xl border border-zest-success/30 bg-zest-success/10 p-4">
                <p className="text-sm text-zest-text flex items-center gap-2">
                  <FaCheckCircle className="text-zest-success" /> OTP sent to +91 {phoneData.phone}
                </p>
                <Input
                  label="Enter OTP"
                  type="text"
                  placeholder="6 digit OTP"
                  icon={FaLock}
                  value={phoneData.otp}
                  onChange={(event) =>
                    setPhoneData((prev) => ({
                      ...prev,
                      otp: event.target.value.replace(/\D/g, '').slice(0, 6),
                    }))
                  }
                />
                <Button
                  type="button"
                  className="w-full !rounded-2xl"
                  onClick={handleVerifyOtp}
                  disabled={isOtpVerifying}
                >
                  {isOtpVerifying ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      Verify OTP & Register <FaArrowRight className="text-xs" />
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      <p className="text-center mt-6 sm:mt-7 text-zest-muted text-sm sm:text-base">
        Already have an account?{' '}
        <Link to="/login" className="text-zest-orange font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
