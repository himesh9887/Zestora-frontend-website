export const STORAGE_KEYS = {
  token: 'zestora_token',
  user: 'zestora_user',
  cart: 'zestora_cart',
  orders: 'zestora_orders',
  city: 'zestora_city',
  location: 'zestora_location',
  locationPrompted: 'zestora_location_prompted',
  theme: 'zestora_theme',
};

export const CITY_OPTIONS = ['Alwar', 'Jaipur', 'Delhi', 'Gurugram', 'Noida', 'Mumbai'];

export const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery' },
  { id: 'upi', label: 'UPI' },
  { id: 'card', label: 'Card' },
];

export const ORDER_STATUS = {
  PREPARING: 'preparing',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};
