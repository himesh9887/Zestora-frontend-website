import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaCheckCircle, FaTimesCircle, FaUtensils } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import { restaurants } from '../data/mockData';

const orders = [
  {
    id: 'ORD-1201',
    restaurant: restaurants[0].name,
    items: ['Matar Paneer Combo', 'Butter Naan', 'Lassi'],
    total: 203,
    status: 'delivered',
    date: '2026-02-20',
    image: restaurants[0].image,
  },
  {
    id: 'ORD-1202',
    restaurant: restaurants[2].name,
    items: ['Classic Chicken Burger', 'Peri Peri Fries'],
    total: 278,
    status: 'preparing',
    date: '2026-02-24',
    image: restaurants[2].image,
  },
  {
    id: 'ORD-1195',
    restaurant: restaurants[7].name,
    items: ['Hot Brownie Sundae', 'Donut Box'],
    total: 378,
    status: 'cancelled',
    date: '2026-02-16',
    image: restaurants[7].image,
  },
];

const statusConfig = {
  preparing: { color: 'text-zest-warning', bg: 'bg-zest-warning/10', icon: FaClock, label: 'Preparing' },
  delivered: { color: 'text-zest-success', bg: 'bg-zest-success/10', icon: FaCheckCircle, label: 'Delivered' },
  cancelled: { color: 'text-zest-danger', bg: 'bg-zest-danger/10', icon: FaTimesCircle, label: 'Cancelled' },
};

const Orders = () => {
  const [filter, setFilter] = useState('all');

  const filteredOrders = useMemo(
    () => (filter === 'all' ? orders : orders.filter((order) => order.status === filter)),
    [filter]
  );

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-2">Your Orders</h1>
        <p className="text-zest-muted mb-6">Track live orders and quickly reorder your favourites.</p>

        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {['all', 'preparing', 'delivered', 'cancelled'].map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-all ${
                filter === value
                  ? 'bg-zest-orange text-white'
                  : 'bg-zest-card text-zest-muted hover:text-white'
              }`}
            >
              {value}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order, index) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="bg-zest-card rounded-2xl p-4 border border-zest-muted/10"
              >
                <div className="flex gap-4">
                  <img src={order.image} alt={order.restaurant} className="w-20 h-20 rounded-xl object-cover" />

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <div>
                        <h3 className="font-bold text-white">{order.restaurant}</h3>
                        <p className="text-zest-muted text-sm">{order.id}</p>
                      </div>
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${status.bg}`}>
                        <StatusIcon className={`${status.color} text-sm`} />
                        <span className={`${status.color} text-sm font-medium`}>{status.label}</span>
                      </div>
                    </div>

                    <p className="text-zest-muted text-sm mb-3 line-clamp-1">{order.items.join(', ')}</p>

                    <div className="flex justify-between items-center">
                      <span className="text-zest-muted text-sm">{order.date}</span>
                      <span className="text-zest-orange font-bold">Rs{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {order.status === 'delivered' && (
                  <div className="mt-4 pt-4 border-t border-zest-muted/10 flex gap-3">
                    <button className="flex-1 py-2 text-sm font-medium text-white bg-zest-dark rounded-xl hover:bg-zest-card transition-colors">
                      Reorder
                    </button>
                    <button className="flex-1 py-2 text-sm font-medium text-zest-orange border border-zest-orange rounded-xl hover:bg-zest-orange/10 transition-colors">
                      Rate Order
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
