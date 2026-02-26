import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClock, FaCheckCircle, FaTimesCircle, FaMotorcycle, FaUtensils } from 'react-icons/fa';
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

const Orders = () => {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { addToCart } = useCart();
  const { showToast } = useUI();
  const [filter, setFilter] = useState('all');

  const filteredOrders = useMemo(
    () => (filter === 'all' ? orders : orders.filter((order) => order.status === filter)),
    [orders, filter]
  );

  const handleReorder = (order) => {
    order.items.forEach((item) => addToCart(item));
    showToast('Items added to cart for reorder');
    navigate('/cart');
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-zest-text mb-2">Your Orders</h1>
        <p className="text-zest-muted mb-6">Track and reorder with one tap.</p>

        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {['all', ...Object.values(ORDER_STATUS)].map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-all ${
                filter === value ? 'bg-zest-orange text-white' : 'bg-zest-card text-zest-muted hover:text-zest-text'
              }`}
            >
              {value.replaceAll('_', ' ')}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order, index) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;
            const previewItems = order.items.slice(0, 4);

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="bg-zest-card rounded-2xl p-4 border border-zest-muted/10"
              >
                <div className="flex justify-between items-start gap-4 mb-2">
                  <div>
                    <h3 className="font-bold text-zest-text">{order.restaurantName}</h3>
                    <p className="text-zest-muted text-sm">{order.id}</p>
                  </div>
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${status.bg}`}>
                    <StatusIcon className={`${status.color} text-sm`} />
                    <span className={`${status.color} text-sm font-medium`}>{status.label}</span>
                  </div>
                </div>

                <p className="text-zest-muted text-sm mb-3 line-clamp-2">
                  {order.items.map((item) => item.name).join(', ')}
                </p>

                {previewItems.length > 0 && (
                  <div className="mb-4 grid grid-cols-4 gap-2">
                    {previewItems.map((item, photoIndex) => (
                      <div key={`${item.id}-${photoIndex}`} className="h-16 rounded-lg overflow-hidden bg-zest-dark">
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

                <div className="flex justify-between items-center">
                  <span className="text-zest-muted text-sm">{formatOrderDate(order.createdAt)}</span>
                  <span className="text-zest-orange font-bold">{formatCurrency(order.total)}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-zest-muted/10 flex gap-3">
                  <button
                    onClick={() => handleReorder(order)}
                    className="flex-1 py-2 text-sm font-medium text-zest-text bg-zest-dark/80 rounded-xl hover:bg-zest-dark transition-colors"
                  >
                    Reorder
                  </button>
                  <button
                    onClick={() => navigate('/home')}
                    className="flex-1 py-2 text-sm font-medium text-zest-orange border border-zest-orange rounded-xl hover:bg-zest-orange/10 transition-colors"
                  >
                    Browse More
                  </button>
                </div>
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
