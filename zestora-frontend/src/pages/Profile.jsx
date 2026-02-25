import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaUser, FaSignOutAlt, FaShoppingBag, FaMoon, FaSun, FaMapMarkerAlt } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useUI } from '../hooks/useUI';
import { useOrders } from '../hooks/useOrders';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme, showToast } = useUI();
  const { orders } = useOrders();

  const [addressForm, setAddressForm] = useState({ label: '', line1: '', city: '', pincode: '' });

  const orderCount = useMemo(() => orders.length, [orders]);

  const handleAddAddress = () => {
    if (!addressForm.label || !addressForm.line1 || !addressForm.city || !addressForm.pincode) {
      showToast('Please complete all address fields', 'error');
      return;
    }

    const updatedAddresses = [...(user?.addresses || []), { ...addressForm, id: Date.now() }];
    updateUser({ addresses: updatedAddresses });
    setAddressForm({ label: '', line1: '', city: '', pincode: '' });
    showToast('Address added');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          <aside className="bg-zest-card border border-zest-muted/10 rounded-2xl p-5 h-fit">
            <h1 className="text-xl font-bold text-zest-text mb-6">Profile</h1>
            <div className="space-y-3 text-sm">
              <button className="w-full text-left px-3 py-2 rounded-lg bg-zest-orange/15 text-zest-orange">
                Account Overview
              </button>
              <button
                onClick={() => navigate('/orders')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-zest-dark text-zest-text"
              >
                Order History ({orderCount})
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-zest-dark text-zest-text">
                Saved Addresses
              </button>
            </div>
          </aside>

          <div className="space-y-6">
            <section className="bg-zest-card border border-zest-muted/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-zest-text mb-4">User Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-zest-dark/60">
                  <FaUser className="text-zest-orange" />
                  <div>
                    <p className="text-zest-muted text-sm">Name</p>
                    <p className="text-zest-text font-medium">{user?.name || 'Guest User'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-zest-dark/60">
                  <FaEnvelope className="text-zest-orange" />
                  <div>
                    <p className="text-zest-muted text-sm">Email</p>
                    <p className="text-zest-text font-medium">{user?.email || 'Not available'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-zest-dark/60">
                  <FaShoppingBag className="text-zest-orange" />
                  <div>
                    <p className="text-zest-muted text-sm">Cart Items</p>
                    <p className="text-zest-text font-medium">{cartCount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-zest-dark/60">
                  <FaShoppingBag className="text-zest-orange" />
                  <div>
                    <p className="text-zest-muted text-sm">Total Orders</p>
                    <p className="text-zest-text font-medium">{orderCount}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-zest-card border border-zest-muted/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-zest-text">Saved Addresses</h2>
                <button
                  onClick={() => navigate('/orders')}
                  className="text-sm text-zest-orange hover:underline"
                >
                  Order history shortcut
                </button>
              </div>

              <div className="space-y-3 mb-5">
                {(user?.addresses || []).map((address) => (
                  <div key={address.id} className="p-3 rounded-xl border border-zest-muted/15 bg-zest-dark/50">
                    <p className="text-zest-text font-semibold flex items-center gap-2">
                      <FaMapMarkerAlt className="text-zest-orange" /> {address.label}
                    </p>
                    <p className="text-zest-muted text-sm">{address.line1}</p>
                    <p className="text-zest-muted text-sm">
                      {address.city} - {address.pincode}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  value={addressForm.label}
                  onChange={(event) => setAddressForm({ ...addressForm, label: event.target.value })}
                  placeholder="Label"
                  className="bg-zest-dark border border-zest-muted/20 rounded-xl px-3 py-2 text-zest-text"
                />
                <input
                  value={addressForm.city}
                  onChange={(event) => setAddressForm({ ...addressForm, city: event.target.value })}
                  placeholder="City"
                  className="bg-zest-dark border border-zest-muted/20 rounded-xl px-3 py-2 text-zest-text"
                />
                <input
                  value={addressForm.line1}
                  onChange={(event) => setAddressForm({ ...addressForm, line1: event.target.value })}
                  placeholder="Address line"
                  className="md:col-span-2 bg-zest-dark border border-zest-muted/20 rounded-xl px-3 py-2 text-zest-text"
                />
                <input
                  value={addressForm.pincode}
                  onChange={(event) => setAddressForm({ ...addressForm, pincode: event.target.value })}
                  placeholder="Pincode"
                  className="bg-zest-dark border border-zest-muted/20 rounded-xl px-3 py-2 text-zest-text"
                />
                <Button variant="secondary" className="md:w-fit" onClick={handleAddAddress}>
                  Add Address
                </Button>
              </div>
            </section>

            <section className="bg-zest-card border border-zest-muted/10 rounded-2xl p-6 flex flex-wrap gap-3 justify-between">
              <Button variant="secondary" onClick={toggleTheme}>
                {theme === 'dark' ? <FaSun /> : <FaMoon />} {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Button>
              <Button onClick={handleLogout} className="bg-zest-danger hover:bg-red-600 text-white">
                <FaSignOutAlt /> Logout
              </Button>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
