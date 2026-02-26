import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClock, FaCheckCircle, FaTimesCircle, FaMotorcycle, FaUtensils, FaFileInvoice, FaBan, FaRedoAlt, FaMapMarkedAlt } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import { useOrders } from '../hooks/useOrders';
import { useCart } from '../hooks/useCart';
import { ORDER_STATUS } from '../utils/constants';
import { formatCurrency, formatOrderDate } from '../utils/helpers';
import { useUI } from '../hooks/useUI';

const FALLBACK_FOOD_IMAGE = '/food/food-01.svg';

const statusConfig = {
  [ORDER_STATUS.PREPARING]: {
    color: 'text-zest-warning',
    bg: 'bg-zest-warning/10',
    icon: FaClock,
    label: 'Preparing',
  },
  [ORDER_STATUS.OUT_FOR_DELIVERY]: {
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    icon: FaMotorcycle,
    label: 'Out for Delivery',
  },
  [ORDER_STATUS.DELIVERED]: {
    color: 'text-zest-success',
    bg: 'bg-zest-success/10',
    icon: FaCheckCircle,
    label: 'Delivered',
  },
  [ORDER_STATUS.CANCELLED]: {
    color: 'text-zest-danger',
    bg: 'bg-zest-danger/10',
    icon: FaTimesCircle,
    label: 'Cancelled',
  },
};

const cancelReasonOptions = [
  { id: 'ordered_by_mistake', label: 'Ordered by mistake' },
  { id: 'delivery_too_late', label: 'Delivery taking too long' },
  { id: 'changed_mind', label: 'Changed my mind' },
  { id: 'found_better_price', label: 'Found better price elsewhere' },
  { id: 'other', label: 'Other reason' },
];

const refundPreferenceOptions = [
  { id: 'original_source', label: 'Refund to original payment source' },
  { id: 'wallet', label: 'Refund to app wallet' },
];

const Orders = () => {
  const navigate = useNavigate();
  const { orders, cancelOrder } = useOrders();
  const { addToCart } = useCart();
  const { showToast } = useUI();
  const [filter, setFilter] = useState('all');
  const [openInvoiceId, setOpenInvoiceId] = useState(null);
  const [openCancelId, setOpenCancelId] = useState(null);
  const [cancelForms, setCancelForms] = useState({});

  const filteredOrders = useMemo(
    () => (filter === 'all' ? orders : orders.filter((order) => order.status === filter)),
    [orders, filter]
  );
  const deliveredCount = useMemo(
    () => orders.filter((order) => order.status === ORDER_STATUS.DELIVERED).length,
    [orders]
  );
  const activeCount = useMemo(
    () =>
      orders.filter(
        (order) => order.status === ORDER_STATUS.PREPARING || order.status === ORDER_STATUS.OUT_FOR_DELIVERY
      ).length,
    [orders]
  );
  const cancelledCount = useMemo(
    () => orders.filter((order) => order.status === ORDER_STATUS.CANCELLED).length,
    [orders]
  );

  const updateCancelForm = (orderId, key, value) => {
    setCancelForms((prev) => ({
      ...prev,
      [orderId]: {
        reason: 'other',
        details: '',
        refundPreference: 'original_source',
        ...(prev[orderId] || {}),
        [key]: value,
      },
    }));
  };

  const handleReorder = (order) => {
    order.items.forEach((item) => addToCart(item));
    showToast('Items added to cart for reorder');
    navigate('/cart');
  };

  const handleCancelOrder = (order) => {
    const form = cancelForms[order.id] || {};
    const reason = form.reason || 'other';
    const details = (form.details || '').trim();
    const refundPreference = form.refundPreference || 'original_source';

    if (!details || details.length < 10) {
      showToast('Please add cancellation details (minimum 10 characters)', 'error');
      return;
    }

    cancelOrder(order.id, { reason, details, refundPreference });
    setOpenCancelId(null);
    showToast('Order cancelled successfully');
  };

  const canCancelOrder = (status) => status === ORDER_STATUS.PREPARING || status === ORDER_STATUS.OUT_FOR_DELIVERY;
  const canTrackOrder = (status) => status === ORDER_STATUS.PREPARING || status === ORDER_STATUS.OUT_FOR_DELIVERY || status === ORDER_STATUS.DELIVERED;
  const formatPaymentMethod = (method) => (method ? method.replaceAll('_', ' ').toUpperCase() : 'N/A');

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-5 md:py-8">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-zest-text mb-1.5">Your Orders</h1>
          <p className="text-zest-muted text-sm sm:text-base">Track, invoice and reorder in one place.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-5 sm:mb-6">
          <div className="rounded-2xl border border-zest-muted/15 bg-zest-card/80 px-3 py-2.5 sm:p-3">
            <p className="text-zest-muted text-xs sm:text-sm">Active</p>
            <p className="text-zest-text text-base sm:text-2xl font-bold">{activeCount}</p>
          </div>
          <div className="rounded-2xl border border-zest-muted/15 bg-zest-card/80 px-3 py-2.5 sm:p-3">
            <p className="text-zest-muted text-xs sm:text-sm">Delivered</p>
            <p className="text-zest-success text-base sm:text-2xl font-bold">{deliveredCount}</p>
          </div>
          <div className="rounded-2xl border border-zest-muted/15 bg-zest-card/80 px-3 py-2.5 sm:p-3 col-span-2 sm:col-span-1">
            <p className="text-zest-muted text-xs sm:text-sm">Cancelled</p>
            <p className="text-zest-danger text-base sm:text-2xl font-bold">{cancelledCount}</p>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3 mb-5 sm:mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {['all', ...Object.values(ORDER_STATUS)].map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium capitalize whitespace-nowrap transition-all border ${
                filter === value
                  ? 'bg-zest-orange text-white border-zest-orange'
                  : 'bg-zest-card text-zest-muted border-zest-muted/20 hover:text-zest-text'
              }`}
            >
              {value.replaceAll('_', ' ')}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order, index) => {
            const status = statusConfig[order.status] || statusConfig[ORDER_STATUS.PREPARING];
            const StatusIcon = status.icon;
            const previewItems = order.items.slice(0, 6);
            const cancelForm = cancelForms[order.id] || {};
            const isInvoiceOpen = openInvoiceId === order.id;
            const isCancelOpen = openCancelId === order.id;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="bg-zest-card rounded-2xl p-3 sm:p-4 md:p-5 border border-zest-muted/10 shadow-lg shadow-black/10"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2.5 mb-3">
                  <div className="min-w-0 max-w-full">
                    <h3 className="font-bold text-zest-text text-base sm:text-lg leading-tight">{order.restaurantName}</h3>
                    <p className="text-zest-muted text-xs sm:text-sm truncate">{order.id}</p>
                  </div>
                  <div className={`w-fit flex items-center gap-1 px-3 py-1 rounded-full ${status.bg}`}>
                    <StatusIcon className={`${status.color} text-sm`} />
                    <span className={`${status.color} text-sm font-medium`}>{status.label}</span>
                  </div>
                </div>

                <p className="text-zest-muted text-xs sm:text-sm mb-3 line-clamp-2">
                  {order.items.map((item) => item.name).join(', ')}
                </p>

                {previewItems.length > 0 && (
                  <div className="mb-4 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-1.5 sm:gap-2">
                    {previewItems.map((item, photoIndex) => (
                      <div key={`${item.id}-${photoIndex}`} className="h-14 sm:h-16 rounded-lg overflow-hidden bg-zest-dark">
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = FALLBACK_FOOD_IMAGE;
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm mb-4">
                  <div className="rounded-xl bg-zest-dark/35 px-2.5 sm:px-3 py-2">
                    <p className="text-zest-muted text-[11px] sm:text-xs">Date</p>
                    <p className="text-zest-text font-medium text-xs sm:text-sm">{formatOrderDate(order.createdAt)}</p>
                  </div>
                  <div className="rounded-xl bg-zest-dark/35 px-2.5 sm:px-3 py-2">
                    <p className="text-zest-muted text-[11px] sm:text-xs">Payment</p>
                    <p className="text-zest-text font-medium text-xs sm:text-sm truncate">{formatPaymentMethod(order.paymentMethod)}</p>
                  </div>
                  <div className="rounded-xl bg-zest-dark/35 px-2.5 sm:px-3 py-2 col-span-2 sm:col-span-1">
                    <p className="text-zest-muted text-[11px] sm:text-xs">Total</p>
                    <p className="text-zest-orange font-bold text-sm sm:text-base">{formatCurrency(order.total)}</p>
                  </div>
                </div>

                <div className="pt-3.5 sm:pt-4 border-t border-zest-muted/10 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleReorder(order)}
                    className="py-2.5 text-xs sm:text-sm font-medium text-zest-text bg-zest-dark/80 rounded-xl hover:bg-zest-dark transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <FaRedoAlt className="text-xs" /> Reorder
                  </button>
                  <button
                    onClick={() => setOpenInvoiceId(isInvoiceOpen ? null : order.id)}
                    className="py-2.5 text-xs sm:text-sm font-medium text-zest-text bg-zest-dark/80 rounded-xl hover:bg-zest-dark transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <FaFileInvoice className="text-xs" /> {isInvoiceOpen ? 'Hide Invoice' : 'View Invoice'}
                  </button>
                  {canCancelOrder(order.status) && (
                    <button
                      onClick={() => setOpenCancelId(isCancelOpen ? null : order.id)}
                      className="py-2.5 text-xs sm:text-sm font-medium text-zest-danger border border-zest-danger/60 rounded-xl hover:bg-zest-danger/10 transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <FaBan className="text-xs" /> {isCancelOpen ? 'Close Cancel Form' : 'Cancel Order'}
                    </button>
                  )}
                  {canTrackOrder(order.status) ? (
                    <button
                      onClick={() => navigate(`/tracking/${order.id}`, { state: { orderId: order.id, order } })}
                      className="py-2.5 text-xs sm:text-sm font-medium text-blue-400 border border-blue-400/60 rounded-xl hover:bg-blue-500/10 transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <FaMapMarkedAlt className="text-xs" /> Track Order
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/home')}
                      className="py-2.5 text-xs sm:text-sm font-medium text-zest-orange border border-zest-orange rounded-xl hover:bg-zest-orange/10 transition-colors"
                    >
                      Browse More
                    </button>
                  )}
                </div>

                {isInvoiceOpen && (
                  <div className="mt-4 rounded-xl border border-zest-muted/20 bg-zest-dark/40 p-3 sm:p-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-3">
                      <div>
                        <p className="text-zest-text font-semibold text-sm sm:text-base">Invoice</p>
                        <p className="text-zest-muted text-[11px] sm:text-xs break-all">Invoice ID: INV-{order.id}</p>
                      </div>
                      <p className="text-zest-muted text-[11px] sm:text-xs">Issued on {formatOrderDate(order.createdAt)}</p>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item, itemIndex) => (
                        <div key={`${item.id}-${itemIndex}`} className="flex items-start justify-between gap-2 text-xs sm:text-sm">
                          <p className="text-zest-text min-w-0">{item.name} x {item.quantity}</p>
                          <p className="text-zest-text font-medium">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-zest-muted/20 pt-3 space-y-2 text-xs sm:text-sm">
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
                        <span>Total Paid</span>
                        <span>{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {order.status === ORDER_STATUS.CANCELLED && order.cancellation && (
                  <div className="mt-4 rounded-xl border border-zest-danger/40 bg-zest-danger/10 p-3 sm:p-4">
                    <h4 className="font-semibold text-zest-danger mb-2 text-sm sm:text-base">Cancellation Details</h4>
                    <div className="space-y-1 text-xs sm:text-sm">
                      <p className="text-zest-text">
                        <span className="text-zest-muted">Reason:</span>{' '}
                        {cancelReasonOptions.find((reason) => reason.id === order.cancellation.reason)?.label || 'Other reason'}
                      </p>
                      <p className="text-zest-text">
                        <span className="text-zest-muted">Description:</span> {order.cancellation.details || 'Not provided'}
                      </p>
                      <p className="text-zest-text">
                        <span className="text-zest-muted">Refund Preference:</span>{' '}
                        {refundPreferenceOptions.find((option) => option.id === order.cancellation.refundPreference)?.label || 'Original source'}
                      </p>
                      <p className="text-zest-text">
                        <span className="text-zest-muted">Cancelled On:</span> {formatOrderDate(order.cancelledAt || order.cancellation.requestedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {isCancelOpen && canCancelOrder(order.status) && (
                  <div className="mt-4 rounded-xl border border-zest-danger/50 bg-zest-danger/5 p-3 sm:p-4 space-y-3">
                    <h4 className="font-semibold text-zest-danger text-sm sm:text-base">Cancel Order With Full Details</h4>
                    <div>
                      <label className="text-xs sm:text-sm text-zest-muted">Select reason</label>
                      <select
                        value={cancelForm.reason || 'other'}
                        onChange={(event) => updateCancelForm(order.id, 'reason', event.target.value)}
                        className="mt-1 w-full rounded-xl border border-zest-muted/30 bg-zest-card px-3 py-2 text-sm text-zest-text focus:outline-none focus:ring-2 focus:ring-zest-danger/40"
                      >
                        {cancelReasonOptions.map((reason) => (
                          <option key={reason.id} value={reason.id}>
                            {reason.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm text-zest-muted">Detailed description</label>
                      <textarea
                        rows={3}
                        value={cancelForm.details || ''}
                        onChange={(event) => updateCancelForm(order.id, 'details', event.target.value)}
                        placeholder="Please explain why you want to cancel this order..."
                        className="mt-1 w-full rounded-xl border border-zest-muted/30 bg-zest-card px-3 py-2 text-sm text-zest-text focus:outline-none focus:ring-2 focus:ring-zest-danger/40"
                      />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm text-zest-muted">Refund preference</label>
                      <select
                        value={cancelForm.refundPreference || 'original_source'}
                        onChange={(event) => updateCancelForm(order.id, 'refundPreference', event.target.value)}
                        className="mt-1 w-full rounded-xl border border-zest-muted/30 bg-zest-card px-3 py-2 text-sm text-zest-text focus:outline-none focus:ring-2 focus:ring-zest-danger/40"
                      >
                        {refundPreferenceOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => handleCancelOrder(order)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zest-danger text-white text-sm font-medium hover:bg-zest-danger/90 transition-colors"
                    >
                      Confirm Cancel Order
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <FaUtensils className="text-4xl text-zest-muted mx-auto mb-4" />
            <p className="text-zest-muted">No orders found</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Orders;
