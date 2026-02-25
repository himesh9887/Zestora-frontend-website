import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaMapMarkerAlt, FaCreditCard, FaMoneyBill, FaMobileAlt, FaCheck } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { useUI } from '../hooks/useUI';
import { calculateCartTotals, formatCurrency } from '../utils/helpers';
import { PAYMENT_METHODS } from '../utils/constants';
import { simulatePayment } from '../services/paymentService';

const paymentIcons = {
  cod: FaMoneyBill,
  upi: FaMobileAlt,
  card: FaCreditCard,
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, updateUser } = useAuth();
  const { placeOrder } = useOrders();
  const { showToast } = useUI();

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [selectedAddressId, setSelectedAddressId] = useState(user?.addresses?.[0]?.id || null);
  const [newAddress, setNewAddress] = useState({ label: '', line1: '', city: '', pincode: '' });
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const totals = useMemo(() => calculateCartTotals(cartTotal), [cartTotal]);

  useEffect(() => {
    if (cartItems.length === 0 && !isComplete) {
      navigate('/cart', { replace: true });
    }
  }, [cartItems.length, isComplete, navigate]);

  const selectedAddress = user?.addresses?.find((address) => address.id === selectedAddressId);

  const handleSaveAddress = () => {
    if (!newAddress.label || !newAddress.line1 || !newAddress.city || !newAddress.pincode) {
      showToast('Please fill all address fields', 'error');
      return;
    }

    const address = { ...newAddress, id: Date.now() };
    const updatedAddresses = [...(user?.addresses || []), address];
    updateUser({ addresses: updatedAddresses });
    setSelectedAddressId(address.id);
    setShowNewAddressForm(false);
    setNewAddress({ label: '', line1: '', city: '', pincode: '' });
    showToast('Address saved');
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      showToast('Please select delivery address', 'error');
      return;
    }

    setIsProcessing(true);

    const paymentResult = await simulatePayment({ method: paymentMethod, amount: totals.grandTotal });

    if (paymentResult.success) {
      placeOrder({
        items: cartItems,
        totals,
        paymentMethod,
        address: selectedAddress,
      });
      clearCart();
      setIsComplete(true);
      showToast('Payment successful. Order placed!');
      setTimeout(() => navigate('/orders'), 1800);
    } else {
      showToast('Payment failed. Try again.', 'error');
    }

    setIsProcessing(false);
  };

  if (isComplete) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
            <div className="w-24 h-24 bg-zest-success rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheck className="text-4xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-zest-text mb-2">Order Placed Successfully</h2>
            <p className="text-zest-muted">Redirecting to your orders...</p>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="sticky top-0 z-30 bg-zest-dark/95 backdrop-blur-xl border-b border-zest-muted/10 px-4 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-zest-card rounded-xl transition-colors">
          <FaArrowLeft className="text-zest-text" />
        </button>
        <h1 className="text-lg font-bold text-zest-text">Checkout</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 pb-32">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zest-card rounded-2xl p-6 border border-zest-muted/10"
            >
              <h3 className="text-lg font-bold text-zest-text mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-zest-orange" /> Address Selection
              </h3>

              <div className="space-y-3">
                {(user?.addresses || []).map((address) => (
                  <button
                    key={address.id}
                    onClick={() => setSelectedAddressId(address.id)}
                    className={`w-full text-left p-3 rounded-xl border ${
                      selectedAddressId === address.id
                        ? 'border-zest-orange bg-zest-orange/10'
                        : 'border-zest-muted/20 hover:border-zest-muted/50'
                    }`}
                  >
                    <p className="font-semibold text-zest-text">{address.label}</p>
                    <p className="text-sm text-zest-muted">{address.line1}</p>
                    <p className="text-sm text-zest-muted">
                      {address.city} - {address.pincode}
                    </p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowNewAddressForm((prev) => !prev)}
                className="mt-4 text-zest-orange text-sm font-medium hover:underline"
              >
                + Add New Address
              </button>

              {showNewAddressForm && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    value={newAddress.label}
                    onChange={(event) => setNewAddress({ ...newAddress, label: event.target.value })}
                    placeholder="Label (Home/Work)"
                    className="bg-zest-dark border border-zest-muted/20 rounded-xl px-3 py-2 text-zest-text"
                  />
                  <input
                    value={newAddress.city}
                    onChange={(event) => setNewAddress({ ...newAddress, city: event.target.value })}
                    placeholder="City"
                    className="bg-zest-dark border border-zest-muted/20 rounded-xl px-3 py-2 text-zest-text"
                  />
                  <input
                    value={newAddress.line1}
                    onChange={(event) => setNewAddress({ ...newAddress, line1: event.target.value })}
                    placeholder="Address line"
                    className="md:col-span-2 bg-zest-dark border border-zest-muted/20 rounded-xl px-3 py-2 text-zest-text"
                  />
                  <input
                    value={newAddress.pincode}
                    onChange={(event) => setNewAddress({ ...newAddress, pincode: event.target.value })}
                    placeholder="Pincode"
                    className="bg-zest-dark border border-zest-muted/20 rounded-xl px-3 py-2 text-zest-text"
                  />
                  <Button variant="secondary" className="md:w-fit" onClick={handleSaveAddress}>
                    Save Address
                  </Button>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zest-card rounded-2xl p-6 border border-zest-muted/10"
            >
              <h3 className="text-lg font-bold text-zest-text mb-4">Payment Method</h3>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = paymentIcons[method.id];
                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === method.id
                          ? 'border-zest-orange bg-zest-orange/10'
                          : 'border-zest-muted/20 hover:border-zest-muted/40'
                      }`}
                    >
                      <div className="w-10 h-10 bg-zest-dark rounded-xl flex items-center justify-center">
                        <Icon className="text-zest-orange" />
                      </div>
                      <p className="font-semibold text-zest-text">{method.label}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zest-card rounded-2xl p-6 border border-zest-muted/10 h-fit"
          >
            <h3 className="text-lg font-bold text-zest-text mb-6">Order Summary</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-zest-muted">
                <span>Subtotal</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-zest-muted">
                <span>Delivery Fee</span>
                <span>{formatCurrency(totals.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-zest-muted">
                <span>Platform Fee</span>
                <span>{formatCurrency(totals.platformFee)}</span>
              </div>
              <div className="flex justify-between text-zest-muted">
                <span>GST (5%)</span>
                <span>{formatCurrency(totals.gst)}</span>
              </div>
              <div className="border-t border-zest-muted/20 pt-3 flex justify-between text-zest-text font-bold text-xl">
                <span>To Pay</span>
                <span className="text-zest-orange">{formatCurrency(totals.grandTotal)}</span>
              </div>
            </div>

            <Button onClick={handlePlaceOrder} className="w-full" size="lg" disabled={isProcessing}>
              {isProcessing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                'Pay Now'
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;
