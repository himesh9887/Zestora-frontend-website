import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';
import { OrderProvider } from './context/OrderContext';
import { UIProvider } from './context/UIContext';
import ToastContainer from './components/ui/ToastContainer';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <UIProvider>
        <AuthProvider>
          <LocationProvider>
            <OrderProvider>
              <CartProvider>
                <AppRoutes />
                <ToastContainer />
              </CartProvider>
            </OrderProvider>
          </LocationProvider>
        </AuthProvider>
      </UIProvider>
    </BrowserRouter>
  );
}

export default App;
