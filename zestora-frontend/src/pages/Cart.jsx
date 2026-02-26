import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { useCart } from '../hooks/useCart';
import Button from '../components/common/Button';
import { calculateCartTotals, formatCurrency } from '../utils/helpers';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const totals = calculateCartTotals(cartTotal);

  if (cartItems.length === 0) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-zest-dark">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-zest-card rounded-full flex items-center justify-center mb-6"
          >
            <FaShoppingCart className="text-4xl text-zest-muted" />
          </motion.div>
          <h2 className="text-2xl font-bold text-zest-text mb-2">Your cart is empty</h2>
          <p className="text-zest-muted mb-8 text-center">Add a few dishes and continue to checkout.</p>
          <Button onClick={() => navigate('/home')}>Browse Restaurants</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="sticky top-0 z-30 bg-zest-card/95 backdrop-blur-xl border-b border-zest-muted/20 px-4 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-zest-dark rounded-xl transition-colors">
          <FaArrowLeft className="text-zest-text" />
        </button>
        <h1 className="text-lg font-bold text-zest-text">Your Cart</h1>
        <button onClick={clearCart} className="ml-auto text-sm text-zest-danger hover:underline">
          Clear All
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 pb-44 md:pb-6 bg-zest-dark min-h-screen">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </div>

          <div className="hidden lg:block">
            <CartSummary subtotal={cartTotal} onCheckout={() => navigate('/checkout')} />
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-[104px] left-4 right-4 bg-zest-card border border-zest-muted/20 rounded-2xl p-4 z-[70] shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <span className="text-zest-muted">To Pay</span>
          <span className="text-2xl font-bold text-zest-text">{formatCurrency(totals.grandTotal)}</span>
        </div>
        <Button onClick={() => navigate('/checkout')} className="w-full bg-zest-orange hover:bg-orange-600 text-white" size="lg">
          Proceed to Checkout
        </Button>
      </div>
    </MainLayout>
  );
};

export default Cart;
