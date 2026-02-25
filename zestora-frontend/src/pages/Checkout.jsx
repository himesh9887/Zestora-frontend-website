import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaMapMarkerAlt, FaCreditCard, FaMoneyBill, FaCheck } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import { useCart } from '../hooks/useCart';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const deliveryFee = 2.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + deliveryFee + tax;

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      clearCart();
      setTimeout(() => navigate('/orders'), 2000);
    }, 2000);
  };

  if (isComplete) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-zest-success rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheck className="text-4xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Order Placed!</h2>
            <p className="text-zest-muted">Your delicious food is on the way</p>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-zest-dark/95 backdrop-blur-xl border-b border-zest-muted/10 px-4 py-4 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-zest-card rounded-xl transition-colors"
        >
          <FaArrowLeft className="text-white" />
        </button>
        <h1 className="text-lg font-bold text-white">Checkout</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 pb-32">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zest-card rounded-2xl p-6 border border-zest-muted/10"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-zest-orange" /> Delivery Address
              </h3>
              <div className="bg-zest-dark rounded-xl p-4 border-2 border-zest-orange">
                <p className="font-semibold text-white">Home</p>
                <p className="text-zest-muted text-sm mt-1">123 Main Street, Apt 4B</p>
                <p className="text-zest-muted text-sm">New York, NY 10001</p>
              </div>
              <button className="mt-4 text-zest-orange text-sm font-medium hover:underline">
                + Add New Address
              </button>
            </motion.div>

            {/* Payment Method */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zest-card rounded-2xl p-6 border border-zest-muted/10"
            >
              <h3 className="text-lg font-bold text-white mb-4">Payment Method</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'card' 
                      ? 'border-zest-orange bg-zest-orange/10' 
                      : 'border-zest-muted/20 hover:border-zest-muted/40'
                  }`}
                >
                  <div className="w-12 h-12 bg-zest-dark rounded-xl flex items-center justify-center">
                    <FaCreditCard className="text-zest-orange text-xl" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-white">Credit Card</p>
                    <p className="text-zest-muted text-sm">**** **** **** 4242</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'card' ? 'border-zest-orange' : 'border-zest-muted'
                  }`}>
                    {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-zest-orange rounded-full" />}
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'cash' 
                      ? 'border-zest-orange bg-zest-orange/10' 
                      : 'border-zest-muted/20 hover:border-zest-muted/40'
                  }`}
                >
                  <div className="w-12 h-12 bg-zest-dark rounded-xl flex items-center justify-center">
                    <FaMoneyBill className="text-zest-success text-xl" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-white">Cash on Delivery</p>
                    <p className="text-zest-muted text-sm">Pay when you receive</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'cash' ? 'border-zest-orange' : 'border-zest-muted'
                  }`}>
                    {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 bg-zest-orange rounded-full" />}
                  </div>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zest-card rounded-2xl p-6 border border-zest-muted/10 h-fit"
          >
            <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-zest-muted">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zest-muted">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zest-muted">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-zest-muted/20 pt-3 flex justify-between text-white font-bold text-xl">
                <span>Total</span>
                <span className="text-zest-orange">${total.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              onClick={handlePlaceOrder}
              className="w-full"
              size="lg"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                'Place Order'
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;