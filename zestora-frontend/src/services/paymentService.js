import { generateOrderId } from '../utils/helpers';
import { ORDER_STATUS } from '../utils/constants';

export const simulatePayment = ({ method, amount }) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: `TXN-${Date.now()}`,
        orderId: generateOrderId(),
        provider: method === 'card' ? 'Stripe/Razorpay-ready' : 'Internal',
        amount,
      });
    }, 1800);
  });

export const initialPaymentConfig = {
  razorpay: {
    enabled: false,
    keyId: '',
  },
  stripe: {
    enabled: false,
    publishableKey: '',
  },
  fallbackMode: 'mock',
  defaultStatus: ORDER_STATUS.PREPARING,
};
