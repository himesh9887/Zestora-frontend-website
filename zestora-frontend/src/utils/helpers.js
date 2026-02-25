export const formatCurrency = (value) => `Rs${Number(value).toFixed(2)}`;

export const formatOrderDate = (dateValue) => {
  const date = new Date(dateValue);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const generateOrderId = () => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ZST-${Date.now().toString().slice(-6)}-${random}`;
};

export const inferCityFromCoords = (latitude, longitude) => {
  if (latitude >= 26.8 && latitude <= 27.0 && longitude >= 76.5 && longitude <= 76.8) return 'Alwar';
  if (latitude >= 26.7 && latitude <= 26.98 && longitude >= 75.6 && longitude <= 75.95) return 'Jaipur';
  if (latitude >= 28.4 && latitude <= 28.9 && longitude >= 76.9 && longitude <= 77.4) return 'Delhi';
  if (latitude >= 28.3 && latitude <= 28.6 && longitude >= 76.9 && longitude <= 77.2) return 'Gurugram';
  if (latitude >= 28.4 && latitude <= 28.7 && longitude >= 77.2 && longitude <= 77.6) return 'Noida';
  if (latitude >= 18.8 && latitude <= 19.3 && longitude >= 72.7 && longitude <= 73.1) return 'Mumbai';
  return 'Alwar';
};

export const calculateCartTotals = (subtotal) => {
  const deliveryFee = subtotal > 299 ? 0 : 29;
  const platformFee = subtotal > 0 ? 5 : 0;
  const gst = subtotal * 0.05;
  const grandTotal = subtotal + deliveryFee + platformFee + gst;

  return {
    subtotal,
    deliveryFee,
    platformFee,
    gst,
    grandTotal,
  };
};
