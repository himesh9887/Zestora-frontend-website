import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';
import ScrollToTop from './ScrollToTop';

// Pages
import Splash from '../pages/Splash';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import Home from '../pages/Home';
import RestaurantDetails from '../pages/RestaurantDetails';
import Checkout from '../pages/Checkout';
import Orders from '../pages/Orders';
import Profile from '../pages/Profile';
import EditProfile from '../pages/EditProfile';
import ProfileDetails from '../pages/ProfileDetails';
import Settings from '../pages/Settings';
import LocationPicker from '../pages/LocationPicker';
import AddressBook from '../pages/AddressBook';
import Support from '../pages/Support';
import OrderTracking from '../pages/OrderTracking';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Splash />} />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/home" replace /> : <Register />} 
        />
        <Route
          path="/forgot-password"
          element={isAuthenticated ? <Navigate to="/home" replace /> : <ForgotPassword />}
        />

        {/* Protected Routes */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/location" element={
          <ProtectedRoute>
            <LocationPicker />
          </ProtectedRoute>
        } />
        <Route path="/restaurant/:id" element={
          <ProtectedRoute>
            <RestaurantDetails />
          </ProtectedRoute>
        } />
        <Route path="/cart" element={
          <ProtectedRoute>
            <Navigate to="/checkout" replace />
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/profile/edit" element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        } />
        <Route path="/profile/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/profile/:slug" element={
          <ProtectedRoute>
            <ProfileDetails />
          </ProtectedRoute>
        } />
        <Route path="/profile/address-book" element={
          <ProtectedRoute>
            <AddressBook />
          </ProtectedRoute>
        } />
        <Route path="/support" element={
          <ProtectedRoute>
            <Support />
          </ProtectedRoute>
        } />
        <Route path="/tracking/:orderId" element={
          <ProtectedRoute>
            <OrderTracking />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
