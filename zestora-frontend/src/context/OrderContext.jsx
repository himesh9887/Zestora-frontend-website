import { createContext, useEffect, useMemo, useState } from 'react';
import { ORDER_STATUS, STORAGE_KEYS } from '../utils/constants';
import { generateOrderId } from '../utils/helpers';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.orders);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
  }, [orders]);

  const placeOrder = ({ items, totals, paymentMethod, address }) => {
    const newOrder = {
      id: generateOrderId(),
      status: ORDER_STATUS.PREPARING,
      createdAt: new Date().toISOString(),
      items,
      paymentMethod,
      address,
      subtotal: totals.subtotal,
      deliveryFee: totals.deliveryFee,
      platformFee: totals.platformFee,
      gst: totals.gst,
      total: totals.grandTotal,
      restaurantName: items[0]?.restaurantName || 'Zestora Kitchen',
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, nextStatus) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: nextStatus } : order)));
  };

  const cancelOrder = (orderId, cancellation = {}) => {
    const cancelledAt = new Date().toISOString();

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: ORDER_STATUS.CANCELLED,
              cancelledAt,
              cancellation: {
                reason: cancellation.reason || 'other',
                details: cancellation.details?.trim() || '',
                requestedBy: 'customer',
                refundPreference: cancellation.refundPreference || 'original_source',
                requestedAt: cancelledAt,
              },
            }
          : order
      )
    );
  };

  const value = useMemo(
    () => ({
      orders,
      placeOrder,
      updateOrderStatus,
      cancelOrder,
    }),
    [orders]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};
