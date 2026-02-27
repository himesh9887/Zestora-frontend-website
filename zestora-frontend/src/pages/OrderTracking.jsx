import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FaArrowLeft,
  FaCheckCircle,
  FaHome,
  FaRedo,
  FaRegClock,
  FaShareAlt,
  FaSyncAlt,
} from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import MapView from '../components/tracking/MapView';
import OrderStatusCard from '../components/tracking/OrderStatusCard';
import ETAIndicator from '../components/tracking/ETAIndicator';
import DeliveryInfo from '../components/tracking/DeliveryInfo';
import ProgressTracker from '../components/tracking/ProgressTracker';
import { useOrders } from '../hooks/useOrders';
import { useUI } from '../hooks/useUI';
import { ORDER_STATUS } from '../utils/constants';
import { formatCurrency, formatOrderDate } from '../utils/helpers';

const TOTAL_MINUTES = 30;

const cityCoords = {
  Alwar: [27.55299, 76.63457],
  Jaipur: [26.91243, 75.78727],
  Delhi: [28.6139, 77.209],
  Gurugram: [28.4595, 77.0266],
  Noida: [28.5355, 77.391],
  Mumbai: [19.076, 72.8777],
};

const clampMove = (current, target, factor = 0.18) => [
  current[0] + (target[0] - current[0]) * factor,
  current[1] + (target[1] - current[1]) * factor,
];

const successParticles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${8 + i * 7}%`,
  delay: i * 0.05,
}));

const deriveEta = (createdAt) => {
  if (!createdAt) return TOTAL_MINUTES;
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const elapsedMins = Math.max(0, Math.floor(diffMs / 60000));
  return Math.max(0, TOTAL_MINUTES - elapsedMins);
};

const OrderTracking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId: orderParam } = useParams();
  const { orders, updateOrderStatus, cancelOrder } = useOrders();
  const { showToast } = useUI();

  const orderId = orderParam || location.state?.orderId;
  const order = useMemo(() => {
    const fromStore = orders.find((item) => item.id === orderId);
    return fromStore || location.state?.order || null;
  }, [location.state, orderId, orders]);

  const [etaMinutes, setEtaMinutes] = useState(TOTAL_MINUTES);
  const [status, setStatus] = useState(ORDER_STATUS.PREPARING);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showDeliveredFx, setShowDeliveredFx] = useState(false);

  const cityBase = cityCoords[order?.address?.city] || cityCoords.Alwar;
  const restaurantLocation = useMemo(() => [cityBase[0] + 0.018, cityBase[1] - 0.02], [cityBase]);
  const customerLocation = useMemo(() => [cityBase[0] - 0.01, cityBase[1] + 0.014], [cityBase]);
  const [partnerLocation, setPartnerLocation] = useState(() => [cityBase[0] + 0.03, cityBase[1] - 0.026]);

  const driver = useMemo(
    () => ({
      name: 'Aman Verma',
      rating: '4.9',
      vehicle: 'Bike',
      vehicleNo: 'RJ14 AX 2048',
      phone: '+919876543210',
    }),
    []
  );

  useEffect(() => {
    if (!order) return;
    const nextStatus = order.status || ORDER_STATUS.PREPARING;
    setStatus(nextStatus);
    if (nextStatus === ORDER_STATUS.CANCELLED || nextStatus === ORDER_STATUS.DELIVERED) {
      setEtaMinutes(0);
      return;
    }
    if (nextStatus === ORDER_STATUS.OUT_FOR_DELIVERY) {
      setEtaMinutes((prev) => Math.min(prev, Math.max(8, deriveEta(order.createdAt))));
      return;
    }
    setEtaMinutes(deriveEta(order.createdAt));
  }, [order]);

  useEffect(() => {
    if (!order || status === ORDER_STATUS.DELIVERED || status === ORDER_STATUS.CANCELLED) return undefined;
    const minuteTimer = window.setInterval(() => {
      setEtaMinutes((prev) => Math.max(0, prev - 1));
    }, 60000);
    return () => window.clearInterval(minuteTimer);
  }, [order, status]);

  useEffect(() => {
    if (!order || status === ORDER_STATUS.CANCELLED) return;

    if (etaMinutes <= 0 && status !== ORDER_STATUS.DELIVERED) {
      setStatus(ORDER_STATUS.DELIVERED);
      updateOrderStatus(order.id, ORDER_STATUS.DELIVERED);
      setShowDeliveredFx(true);
      showToast('Order delivered successfully');
      return;
    }

    if (etaMinutes <= TOTAL_MINUTES - 5 && status === ORDER_STATUS.PREPARING) {
      setStatus(ORDER_STATUS.OUT_FOR_DELIVERY);
      updateOrderStatus(order.id, ORDER_STATUS.OUT_FOR_DELIVERY);
    }
  }, [etaMinutes, order, showToast, status, updateOrderStatus]);

  useEffect(() => {
    if (status !== ORDER_STATUS.OUT_FOR_DELIVERY) return undefined;
    const movementTimer = window.setInterval(() => {
      setPartnerLocation((prev) => clampMove(prev, customerLocation));
    }, 4000);
    return () => window.clearInterval(movementTimer);
  }, [customerLocation, status]);

  useEffect(() => {
    if (!showDeliveredFx) return undefined;
    const doneTimer = window.setTimeout(() => setShowDeliveredFx(false), 12000);
    return () => window.clearTimeout(doneTimer);
  }, [showDeliveredFx]);

  const trackingSteps = useMemo(() => {
    if (!order) return [];
    const created = formatOrderDate(order.createdAt);
    const cancelled = order.cancelledAt ? formatOrderDate(order.cancelledAt) : '';

    if (status === ORDER_STATUS.CANCELLED) {
      return [
        { label: 'Order placed', time: created, done: true },
        { label: 'Cancellation requested', time: cancelled || 'Just now', done: true },
        { label: 'Refund initiated', time: 'Within 3-5 business days', done: true },
      ];
    }

    return [
      { label: 'Order confirmed', time: created, done: true },
      { label: 'Restaurant preparing your food', time: status !== ORDER_STATUS.PREPARING ? 'Completed' : 'In progress', done: true },
      {
        label: 'Rider picked up your order',
        time: status === ORDER_STATUS.OUT_FOR_DELIVERY || status === ORDER_STATUS.DELIVERED ? 'Completed' : 'Pending',
        done: status === ORDER_STATUS.OUT_FOR_DELIVERY || status === ORDER_STATUS.DELIVERED,
      },
      {
        label: 'Delivered at your location',
        time: status === ORDER_STATUS.DELIVERED ? 'Completed' : `ETA ${Math.max(0, etaMinutes)} mins`,
        done: status === ORDER_STATUS.DELIVERED,
      },
    ];
  }, [etaMinutes, order, status]);

  const handleCancelOrder = () => {
    if (!order || status !== ORDER_STATUS.PREPARING) return;
    setIsCancelling(true);
    cancelOrder(order.id, {
      reason: 'changed_mind',
      details: 'Cancelled from live tracking screen',
      refundPreference: 'original_source',
    });
    setStatus(ORDER_STATUS.CANCELLED);
    setEtaMinutes(0);
    setIsCancelling(false);
    showToast('Order cancelled');
  };

  const handleContactDriver = () => {
    window.location.href = `tel:${driver.phone}`;
  };

  const handleSupport = () => {
    navigate('/support', {
      state: {
        orderId: order?.id,
        source: 'tracking',
      },
    });
  };

  const handleRefresh = () => {
    if (status === ORDER_STATUS.CANCELLED || status === ORDER_STATUS.DELIVERED) {
      showToast('Order status already final');
      return;
    }
    showToast('Tracking refreshed');
  };

  const handleShare = async () => {
    if (!order) return;
    const shareText = `Track my order ${order.id} from ${order.restaurantName}. ETA ${Math.max(0, etaMinutes)} mins.`;
    try {
      if (navigator.share) {
        await navigator.share({ text: shareText });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        showToast('Tracking details copied');
      } else {
        showToast('Share not supported on this device', 'error');
      }
    } catch {
      showToast('Unable to share right now', 'error');
    }
  };

  if (!order) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-zest-card border border-zest-muted/20 rounded-2xl p-6 text-center">
            <p className="text-zest-text text-xl font-bold">Order not found</p>
            <p className="text-zest-muted mt-2">This tracking link is invalid or expired.</p>
            <button onClick={() => navigate('/orders')} className="mt-4 h-10 px-4 rounded-xl bg-zest-orange text-white font-semibold">
              Go to Orders
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto px-3 sm:px-4 py-4 md:py-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <button onClick={() => navigate('/orders')} className="h-10 px-3 rounded-xl border border-zest-muted/20 bg-zest-card text-zest-text inline-flex items-center gap-2">
            <FaArrowLeft />
            Back to Orders
          </button>
          <div className="inline-flex gap-2">
            <button onClick={handleRefresh} className="h-10 px-3 rounded-xl border border-zest-muted/20 bg-zest-card text-zest-text inline-flex items-center gap-2">
              <FaSyncAlt />
              Refresh
            </button>
            <button onClick={handleShare} className="h-10 px-3 rounded-xl border border-zest-muted/20 bg-zest-card text-zest-text inline-flex items-center gap-2">
              <FaShareAlt />
              Share
            </button>
          </div>
        </div>

        <div className="mb-4 rounded-2xl border border-zest-muted/15 bg-gradient-to-r from-zest-card via-zest-card to-zest-orange/10 p-4 shadow-lg">
          <p className="text-zest-muted text-xs uppercase tracking-[0.2em]">Live Tracking</p>
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-zest-text">{order.restaurantName}</h1>
              <p className="text-zest-muted text-sm">{order.address?.label || 'Delivery'} • {order.address?.city || 'City'}</p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zest-orange/40 bg-zest-orange/15 text-zest-orange text-sm font-semibold">
              ETA {Math.max(0, etaMinutes)} mins
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-5">
          <div className="lg:col-span-3 space-y-4">
            <MapView
              restaurantLocation={restaurantLocation}
              customerLocation={customerLocation}
              partnerLocation={partnerLocation}
              status={status}
            />
            <ETAIndicator etaMinutes={etaMinutes} totalMinutes={TOTAL_MINUTES} delivered={status === ORDER_STATUS.DELIVERED} />

            <div className="bg-zest-card border border-zest-muted/20 rounded-2xl p-4 shadow-lg">
              <p className="text-zest-muted text-xs uppercase tracking-[0.2em]">Tracking Timeline</p>
              <div className="mt-4 space-y-3">
                {trackingSteps.map((step, idx) => (
                  <div key={step.label} className="flex gap-3">
                    <div className="pt-0.5">
                      <span className={`w-3 h-3 rounded-full inline-block ${step.done ? 'bg-zest-success' : 'bg-zest-muted/40'}`} />
                      {idx !== trackingSteps.length - 1 && <span className="block w-px h-6 bg-zest-muted/30 mx-auto mt-1" />}
                    </div>
                    <div className="min-w-0 pb-1">
                      <p className={`text-sm font-semibold ${step.done ? 'text-zest-text' : 'text-zest-muted'}`}>{step.label}</p>
                      <p className="text-xs text-zest-muted inline-flex items-center gap-1 mt-0.5">
                        <FaRegClock className="text-[10px]" />
                        {step.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <OrderStatusCard order={order} status={status} onCancel={handleCancelOrder} cancelling={isCancelling} />
            <ProgressTracker status={status} />
            <DeliveryInfo
              driver={driver}
              etaMinutes={etaMinutes}
              delivered={status === ORDER_STATUS.DELIVERED}
              onContact={handleContactDriver}
              onSupport={handleSupport}
            />

            <div className="bg-zest-card border border-zest-muted/20 rounded-2xl p-4 shadow-lg">
              <p className="text-zest-muted text-xs uppercase tracking-[0.2em]">Order Summary</p>
              <div className="mt-3 space-y-2 text-sm">
                {order.items.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex items-start justify-between gap-3">
                    <p className="text-zest-text">{item.name} x {item.quantity}</p>
                    <p className="text-zest-muted">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-zest-muted/20 space-y-1.5 text-sm">
                <div className="flex justify-between text-zest-muted">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-zest-muted">
                  <span>Delivery Fee</span>
                  <span>{formatCurrency(order.deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-zest-muted">
                  <span>Platform Fee</span>
                  <span>{formatCurrency(order.platformFee)}</span>
                </div>
                <div className="flex justify-between text-zest-muted">
                  <span>GST</span>
                  <span>{formatCurrency(order.gst)}</span>
                </div>
                <div className="flex justify-between text-zest-orange font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {showDeliveredFx && status === ORDER_STATUS.DELIVERED && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative overflow-hidden bg-zest-success/10 border border-zest-success/35 rounded-2xl p-4"
                >
                  {successParticles.map((p) => (
                    <motion.span
                      key={p.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: [0, 1, 0], y: [-2, -24, -44] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.7, delay: p.delay }}
                      className="absolute text-zest-success"
                      style={{ left: p.left, bottom: '8px' }}
                    >
                      *
                    </motion.span>
                  ))}

                  <div className="relative">
                    <p className="inline-flex items-center gap-2 text-zest-success font-bold text-lg">
                      <FaCheckCircle />
                      Delivery Completed
                    </p>
                    <p className="text-zest-muted text-sm mt-1">Your food has arrived at your location.</p>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => navigate('/home')}
                        className="flex-1 h-10 rounded-xl bg-zest-orange text-white font-semibold inline-flex items-center justify-center gap-2"
                      >
                        <FaRedo />
                        Order Again
                      </button>
                      <button
                        onClick={() => navigate('/home')}
                        className="flex-1 h-10 rounded-xl border border-zest-muted/30 text-zest-text inline-flex items-center justify-center gap-2"
                      >
                        <FaHome />
                        Home
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default OrderTracking;
