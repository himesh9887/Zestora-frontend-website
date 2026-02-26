import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaArrowLeft,
  FaBolt,
  FaCheck,
  FaCheckCircle,
  FaChevronDown,
  FaChevronRight,
  FaCog,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaMoneyBill,
  FaMotorcycle,
  FaPlus,
  FaRegCreditCard,
  FaUniversity,
  FaWallet,
} from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { useUI } from '../hooks/useUI';
import { calculateCartTotals, formatCurrency } from '../utils/helpers';
import { simulatePayment } from '../services/paymentService';

const optionGroups = [
  {
    title: 'PAY ON DELIVERY',
    items: [{ id: 'cod_main', label: 'Pay on delivery', subtitle: 'UPI/Cash', icon: FaMoneyBill, gateway: 'cod', available: true }],
  },
  {
    title: 'RECOMMENDED',
    items: [
      { id: 'upi_paytm', label: 'Paytm UPI', icon: FaMobileAlt, gateway: 'upi', available: true },
      { id: 'upi_phonepe', label: 'PhonePe UPI', icon: FaMobileAlt, gateway: 'upi', available: true },
    ],
  },
  {
    title: 'CARDS',
    items: [
      { id: 'card_main', label: 'Add credit or debit cards', icon: FaRegCreditCard, gateway: 'card', available: true, action: 'plus' },
      { id: 'pluxee', label: 'Add Pluxee', icon: FaRegCreditCard, gateway: 'card', available: true, action: 'plus' },
    ],
  },
  {
    title: 'PAY BY ANY UPI APP',
    items: [{ id: 'upi_custom', label: 'Add new UPI ID', icon: FaMobileAlt, gateway: 'upi', available: true, action: 'plus' }],
  },
  {
    title: 'WALLETS',
    items: [
      { id: 'wallet_amazon', label: 'Amazon Pay Balance', icon: FaWallet, gateway: 'upi', available: true, action: 'plus' },
      { id: 'wallet_mobi', label: 'Mobikwik', icon: FaWallet, gateway: 'upi', available: true, action: 'plus' },
    ],
  },
  {
    title: 'NETBANKING',
    items: [{ id: 'netbanking', label: 'Netbanking', icon: FaUniversity, gateway: 'upi', available: true, action: 'plus' }],
  },
  {
    title: 'PAY LATER',
    items: [
      { id: 'paylater_amz', label: 'Amazon Pay Later', icon: FaWallet, gateway: 'upi', available: false },
      { id: 'paylater_lazy', label: 'LazyPay', icon: FaWallet, gateway: 'upi', available: false },
    ],
  },
];

const bankOptions = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra Bank'];

const paymentLogos = {
  cod_main: `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
      <rect x='16' y='26' width='64' height='44' rx='8' fill='none' stroke='#1f2937' stroke-width='4'/>
      <rect x='24' y='34' width='28' height='20' rx='4' fill='none' stroke='#1f2937' stroke-width='4'/>
      <circle cx='65' cy='48' r='3.5' fill='#1f2937'/>
      <path d='M80 40h8v16h-8' fill='none' stroke='#1f2937' stroke-width='4' stroke-linecap='round'/>
    </svg>`
  )}`,
  upi_paytm: `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
      <rect width='96' height='96' rx='16' fill='white'/>
      <text x='48' y='57' text-anchor='middle' font-family='Segoe UI, Arial, sans-serif' font-size='28' font-weight='800'>
        <tspan fill='#0f4aa1'>pay</tspan><tspan fill='#00baf2'>tm</tspan>
      </text>
    </svg>`
  )}`,
  upi_phonepe: `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
      <rect width='96' height='96' rx='16' fill='white'/>
      <circle cx='48' cy='48' r='24' fill='#6b21a8'/>
      <text x='48' y='58' text-anchor='middle' font-family='Noto Sans Devanagari, Segoe UI, Arial, sans-serif' font-size='30' font-weight='700' fill='white'>पे</text>
    </svg>`
  )}`,
  card_main: 'https://cdn-icons-png.flaticon.com/512/179/179457.png',
  pluxee: 'https://logo.clearbit.com/pluxee.in',
  upi_custom: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg',
  wallet_amazon: 'https://logo.clearbit.com/amazonpay.in',
  wallet_mobi: 'https://logo.clearbit.com/mobikwik.com',
  paylater_amz: 'https://logo.clearbit.com/amazonpay.in',
  paylater_lazy: 'https://logo.clearbit.com/lazypay.in',
  netbanking: 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png',
};

const PaymentMethodIcon = ({ item, className = '' }) => {
  const Icon = item.icon || FaCog;
  const logo = paymentLogos[item.id];

  return (
    <div className={`w-12 h-12 rounded-xl border border-zest-muted/30 flex items-center justify-center bg-zest-card overflow-hidden ${className}`}>
      {logo ? (
        <img
          src={logo}
          alt={item.label}
          onError={(event) => {
            event.currentTarget.style.display = 'none';
            const fallback = event.currentTarget.nextElementSibling;
            if (fallback) fallback.style.display = 'block';
          }}
          className="max-w-[74%] max-h-[74%] object-contain"
        />
      ) : null}
      <Icon className="text-zest-muted" style={{ display: logo ? 'none' : 'block' }} />
    </div>
  );
};

const getPaymentDetailType = (item) => {
  if (!item) return 'unknown';
  if (item.id === 'cod_main') return 'cod';
  if (item.id.startsWith('upi_')) return 'upi';
  if (item.id.startsWith('wallet_')) return 'wallet';
  if (item.id === 'netbanking') return 'netbanking';
  if (item.gateway === 'card') return 'card';
  return 'upi';
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();
  const { showToast } = useUI();

  const [selectedAddressId] = useState(user?.addresses?.[0]?.id || null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [activePaymentOption, setActivePaymentOption] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [walletMobile, setWalletMobile] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [cardForm, setCardForm] = useState({ number: '', name: '', expiry: '', cvv: '' });

  const totals = useMemo(() => calculateCartTotals(cartTotal), [cartTotal]);
  const restaurantName = cartItems[0]?.restaurantName || 'Your Restaurant';
  const selectedAddress = user?.addresses?.find((address) => address.id === selectedAddressId) || user?.addresses?.[0];

  useEffect(() => {
    if (cartItems.length === 0 && !isComplete) {
      navigate('/home', { replace: true });
    }
  }, [cartItems.length, isComplete, navigate]);

  const selectedPayment = useMemo(
    () => optionGroups.flatMap((group) => group.items).find((item) => item.id === selectedPaymentId),
    [selectedPaymentId]
  );

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      showToast('Please select delivery address', 'error');
      return;
    }
    if (!selectedPayment) {
      setIsPaymentSheetOpen(true);
      showToast('Please add a payment method', 'error');
      return;
    }

    setIsProcessing(true);
    const paymentResult = await simulatePayment({
      method: selectedPayment.gateway,
      amount: totals.grandTotal,
    });

    if (paymentResult.success) {
      placeOrder({
        items: cartItems,
        totals,
        paymentMethod: selectedPayment.gateway,
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

  const openPaymentSheet = () => setIsPaymentSheetOpen(true);

  const handleSelectPaymentFromDetail = (successMessage) => {
    if (!activePaymentOption) return;
    setSelectedPaymentId(activePaymentOption.id);
    setActivePaymentOption(null);
    setIsPaymentSheetOpen(false);
    showToast(successMessage || `${activePaymentOption.label} selected`);
  };

  const renderPaymentDetail = () => {
    if (!activePaymentOption) return null;
    const type = getPaymentDetailType(activePaymentOption);

    if (type === 'upi') {
      return (
        <div className="p-4 space-y-4">
          <div className="bg-zest-card rounded-3xl border border-zest-muted/20 p-4">
            <h3 className="text-lg font-semibold text-zest-text mb-3">{activePaymentOption.label}</h3>
            <label className="text-sm text-zest-muted">UPI ID</label>
            <input
              value={upiId}
              onChange={(event) => setUpiId(event.target.value)}
              placeholder="example@upi"
              className="mt-1 w-full rounded-xl border border-zest-muted/30 px-3 py-3 text-zest-text focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <p className="text-xs text-zest-muted mt-2">Enter valid UPI ID to continue payment.</p>
          </div>
          <Button
            onClick={() => handleSelectPaymentFromDetail('UPI ID saved')}
            disabled={!upiId.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Continue with UPI
          </Button>
        </div>
      );
    }

    if (type === 'card') {
      const isCardValid =
        cardForm.number.replace(/\s/g, '').length >= 12 &&
        cardForm.name.trim().length >= 3 &&
        cardForm.expiry.trim().length >= 4 &&
        cardForm.cvv.trim().length >= 3;

      return (
        <div className="p-4 space-y-4">
          <div className="bg-zest-card rounded-3xl border border-zest-muted/20 p-4 space-y-3">
            <h3 className="text-lg font-semibold text-zest-text">Add Card Details</h3>
            <input
              value={cardForm.number}
              onChange={(event) => setCardForm({ ...cardForm, number: event.target.value })}
              placeholder="Card number"
              className="w-full rounded-xl border border-zest-muted/30 px-3 py-3 text-zest-text focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <input
              value={cardForm.name}
              onChange={(event) => setCardForm({ ...cardForm, name: event.target.value })}
              placeholder="Card holder name"
              className="w-full rounded-xl border border-zest-muted/30 px-3 py-3 text-zest-text focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                value={cardForm.expiry}
                onChange={(event) => setCardForm({ ...cardForm, expiry: event.target.value })}
                placeholder="MM/YY"
                className="w-full rounded-xl border border-zest-muted/30 px-3 py-3 text-zest-text focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <input
                value={cardForm.cvv}
                onChange={(event) => setCardForm({ ...cardForm, cvv: event.target.value })}
                placeholder="CVV"
                className="w-full rounded-xl border border-zest-muted/30 px-3 py-3 text-zest-text focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>
          <Button
            onClick={() => handleSelectPaymentFromDetail('Card added successfully')}
            disabled={!isCardValid}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Save Card
          </Button>
        </div>
      );
    }

    if (type === 'wallet') {
      return (
        <div className="p-4 space-y-4">
          <div className="bg-zest-card rounded-3xl border border-zest-muted/20 p-4">
            <h3 className="text-lg font-semibold text-zest-text mb-3">{activePaymentOption.label}</h3>
            <label className="text-sm text-zest-muted">Mobile Number</label>
            <input
              value={walletMobile}
              onChange={(event) => setWalletMobile(event.target.value)}
              placeholder="Enter 10 digit mobile number"
              className="mt-1 w-full rounded-xl border border-zest-muted/30 px-3 py-3 text-zest-text focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <Button
            onClick={() => handleSelectPaymentFromDetail('Wallet linked successfully')}
            disabled={walletMobile.trim().length < 10}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Link Wallet
          </Button>
        </div>
      );
    }

    if (type === 'netbanking') {
      return (
        <div className="p-4 space-y-4">
          <div className="bg-zest-card rounded-3xl border border-zest-muted/20 p-4">
            <h3 className="text-lg font-semibold text-zest-text mb-3">Select Bank</h3>
            <div className="space-y-2">
              {bankOptions.map((bank) => (
                <button
                  key={bank}
                  onClick={() => setSelectedBank(bank)}
                  className={`w-full text-left px-3 py-3 rounded-xl border ${
                    selectedBank === bank ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-zest-muted/30 text-zest-muted'
                  }`}
                >
                  {bank}
                </button>
              ))}
            </div>
          </div>
          <Button
            onClick={() => handleSelectPaymentFromDetail('Netbanking selected')}
            disabled={!selectedBank}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Continue to Bank
          </Button>
        </div>
      );
    }

    if (type === 'cod') {
      return (
        <div className="p-4 space-y-4">
          <div className="bg-zest-card rounded-3xl border border-zest-muted/20 p-4">
            <h3 className="text-lg font-semibold text-zest-text mb-2">Pay on Delivery</h3>
            <p className="text-zest-muted text-sm">
              You can pay using cash or UPI when your order is delivered.
            </p>
          </div>
          <Button
            onClick={() => handleSelectPaymentFromDetail('Pay on delivery selected')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Confirm COD
          </Button>
        </div>
      );
    }

    return (
      <div className="p-4">
        <div className="bg-zest-card rounded-3xl border border-zest-muted/20 p-4">
          <p className="text-zest-muted">This payment option is being prepared.</p>
        </div>
      </div>
    );
  };

  if (isComplete) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-zest-dark flex items-center justify-center px-4">
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
      <div className="min-h-screen bg-zest-dark pb-44">
        <div className="sticky top-0 z-30 bg-zest-card border-b border-zest-muted/20 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-zest-card">
              <FaArrowLeft className="text-zest-text" />
            </button>
            <div className="min-w-0">
              <p className="text-zest-muted text-sm truncate">{restaurantName}</p>
              <p className="text-emerald-600 font-semibold text-xl leading-tight">15-20 mins to Work</p>
              <p className="text-zest-muted text-sm truncate">{selectedAddress?.line1 || 'Add address'}</p>
            </div>
            <button className="ml-auto p-2 rounded-lg hover:bg-zest-card">
              <FaChevronDown className="text-zest-muted" />
            </button>
          </div>
        </div>

        <div className="bg-blue-100 px-4 py-2.5 text-blue-700 font-semibold text-base">You saved Rs20 on this order</div>

        <div className="max-w-3xl mx-auto p-4 space-y-4">
          <section className="bg-zest-card rounded-3xl border border-zest-muted/20 overflow-hidden">
            <div className="p-4 bg-[#f9f4ea] border-b border-zest-muted/20">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="text-xl font-semibold text-zest-text">Get Gold for 3 months at Rs1</p>
                  <p className="text-zest-muted mt-1">Enjoy FREE delivery above Rs99 and extra offers with Gold</p>
                </div>
                <button className="h-10 px-5 rounded-xl border-2 border-emerald-600 text-emerald-700 font-semibold">ADD</button>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-zest-text text-lg font-semibold truncate">{item.name}</p>
                    <button onClick={() => navigate(-1)} className="text-emerald-700 text-sm font-medium">Edit &gt;</button>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center rounded-xl border border-emerald-600 overflow-hidden">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-emerald-700 font-semibold">-</button>
                      <span className="px-4 py-1 font-semibold text-zest-text">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-emerald-700 font-semibold">+</button>
                    </div>
                    <p className="font-bold text-zest-text mt-1">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}

              <button onClick={() => navigate(-1)} className="text-emerald-700 font-semibold text-xl">+ Add more items</button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button className="rounded-xl border border-zest-muted/30 py-2 text-zest-muted text-sm">Add a note for restaurant</button>
                <button className="rounded-xl border border-zest-muted/30 py-2 text-zest-muted text-sm">Do not send cutlery</button>
              </div>
            </div>
          </section>

          <section className="bg-zest-card rounded-3xl border border-zest-muted/20 overflow-hidden">
            <div className="p-4 bg-blue-100 text-blue-700 font-semibold text-lg">Save extra by applying coupons on every order</div>
            <div className="p-4 border-b border-zest-muted/20">
              <p className="text-zest-text text-xl font-semibold flex items-center gap-2">
                <FaCheckCircle className="text-emerald-500" /> You saved Rs15 on delivery
              </p>
              <p className="text-blue-600">Auto-applied on your order</p>
            </div>
            <div className="p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-zest-text text-lg font-semibold">Save Rs120 with GETOFF120ON249</p>
                <button className="text-emerald-700 text-sm font-medium">View all coupons &gt;</button>
              </div>
              <button className="h-10 px-5 rounded-xl border-2 border-emerald-600 text-emerald-700 font-semibold">APPLY</button>
            </div>
          </section>

          <section className="bg-zest-card rounded-3xl border border-zest-muted/20 p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zest-text text-xl font-semibold flex items-center gap-2">
                  <FaBolt className="text-emerald-600" /> Delivery in <span className="text-emerald-600">15-20 mins</span>
                </p>
                <p className="text-zest-muted mt-1">Want this later? <span className="underline">Schedule it</span></p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">Near & fast</span>
            </div>

            <div className="mt-4 border-t border-zest-muted/20 pt-4">
              <p className="text-zest-text text-lg font-semibold flex items-center gap-2">
                <FaMotorcycle /> Delivery by <span className="font-semibold">Standard Fleet</span>
              </p>
              <div className="mt-3 rounded-xl border border-emerald-500 p-3">
                <p className="text-zest-text font-bold">Standard Fleet</p>
                <p className="text-zest-muted text-sm">Our standard food delivery experience</p>
              </div>
            </div>

            <div className="mt-4 border-t border-zest-muted/20 pt-4 flex items-start gap-3">
              <FaMapMarkerAlt className="text-zest-muted mt-1" />
              <div>
                <p className="text-zest-text font-semibold">Delivery at {selectedAddress?.label || 'Work'}</p>
                <p className="text-zest-muted text-sm">{selectedAddress?.line1}, {selectedAddress?.city}</p>
                <button className="underline text-zest-muted mt-1 text-sm">Add instructions for delivery partner</button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="fixed bottom-[104px] left-4 right-4 z-[70]">
        <Button
          onClick={selectedPayment ? handlePlaceOrder : openPaymentSheet}
          className="w-full !rounded-xl !py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : selectedPayment ? `Pay ${formatCurrency(totals.grandTotal)}` : 'Add Payment Method'}
        </Button>
      </div>

      {isPaymentSheetOpen && (
        <div className="fixed inset-0 z-[120] bg-zest-dark overflow-y-auto">
          <div className="sticky top-0 z-10 bg-zest-dark px-4 py-4 border-b border-zest-muted/20 flex items-center gap-3">
            <button
              onClick={() => {
                if (activePaymentOption) {
                  setActivePaymentOption(null);
                } else {
                  setIsPaymentSheetOpen(false);
                }
              }}
              className="p-2 rounded-lg hover:bg-zest-card"
            >
              <FaArrowLeft className="text-zest-text" />
            </button>
            <h2 className="text-2xl font-semibold text-zest-text">
              {activePaymentOption ? activePaymentOption.label : `Bill total: ${formatCurrency(totals.grandTotal)}`}
            </h2>
          </div>

          {activePaymentOption ? (
            renderPaymentDetail()
          ) : (
            <div className="p-4 space-y-6 pb-10">
              {optionGroups.map((group) => (
                <section key={group.title}>
                  <h3 className="text-zest-muted tracking-[0.2em] text-sm font-semibold mb-3">{group.title}</h3>
                  <div className="bg-zest-card rounded-3xl border border-zest-muted/20 overflow-hidden">
                    {group.items.map((item, index) => {
                      const isSelected = selectedPaymentId === item.id;

                      return (
                        <div key={item.id} className={`p-4 ${index !== group.items.length - 1 ? 'border-b border-zest-muted/20' : ''}`}>
                          <button
                            disabled={!item.available}
                            onClick={() => {
                              if (!item.available) return;
                              setActivePaymentOption(item);
                            }}
                            className={`w-full flex items-center gap-3 text-left ${!item.available ? 'opacity-55' : ''}`}
                          >
                            <PaymentMethodIcon item={item} />
                            <div className="flex-1 min-w-0">
                              <p className={`text-xl font-semibold truncate ${isSelected ? 'text-emerald-700' : 'text-zest-text'}`}>{item.label}</p>
                              {item.subtitle ? <p className="text-zest-muted">{item.subtitle}</p> : null}
                            </div>
                            {item.action === 'plus' ? (
                              <FaPlus className="text-emerald-600 text-xl" />
                            ) : (
                              <FaChevronRight className="text-zest-muted" />
                            )}
                          </button>
                          {!item.available && (
                            <div className="mt-3 rounded-xl bg-rose-50 text-rose-600 px-3 py-2 text-sm">
                              This payment method is not available at the moment.
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      )}
    </MainLayout>
  );
};

export default Checkout;

