import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FaArrowLeft, FaCheckCircle, FaHome, FaRedo } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import MapView from '../components/tracking/MapView';
import OrderStatusCard from '../components/tracking/OrderStatusCard';
import ETAIndicator from '../components/tracking/ETAIndicator';
import DeliveryInfo from '../components/tracking/DeliveryInfo';
import ProgressTracker from '../components/tracking/ProgressTracker';
import { useOrders } from '../hooks/useOrders';
import { useUI } from '../hooks/useUI';
import { ORDER_STATUS } from '../utils/constants';

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
    }),
    []
  );

  useEffect(() => {
    if (!order) return;
    if (order.status === ORDER_STATUS.CANCELLED) {
      setStatus(ORDER_STATUS.CANCELLED);
      setEtaMinutes(0);
      return;
    }
    setStatus(order.status || ORDER_STATUS.PREPARING);
    if (order.status === ORDER_STATUS.DELIVERED) setEtaMinutes(0);
    if (order.status === ORDER_STATUS.OUT_FOR_DELIVERY) setEtaMinutes((prev) => Math.min(prev, 14));
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

    if (etaMinutes <= 0) {
      if (status !== ORDER_STATUS.DELIVERED) {
        setStatus(ORDER_STATUS.DELIVERED);
        updateOrderStatus(order.id, ORDER_STATUS.DELIVERED);
        setShowDeliveredFx(true);
        showToast('Order delivered successfully');
      }
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
          <p className="text-zest-muted text-sm">Tracking ID: {order.id}</p>
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
          </div>

          <div className="lg:col-span-2 space-y-4">
            <OrderStatusCard order={order} status={status} onCancel={handleCancelOrder} cancelling={isCancelling} />
            <ProgressTracker status={status} />
            <DeliveryInfo driver={driver} etaMinutes={etaMinutes} delivered={status === ORDER_STATUS.DELIVERED} />

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
