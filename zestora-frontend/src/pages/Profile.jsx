import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaChevronRight,
  FaCrown,
  FaMapMarkerAlt,
  FaMoon,
  FaRegCreditCard,
  FaRegMoneyBillAlt,
  FaSignOutAlt,
  FaSun,
  FaTicketAlt,
  FaToggleOff,
  FaToggleOn,
  FaUserCircle,
  FaListAlt,
  FaBookmark,
  FaTrain,
  FaLocationArrow,
} from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useUI } from '../hooks/useUI';
import { useOrders } from '../hooks/useOrders';

const InfoRow = ({ icon, label, value, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between py-3 border-b border-zest-muted/20 last:border-b-0"
  >
    <div className="flex items-center gap-3 text-zest-text">
      <span className="text-zest-muted text-xl">{icon}</span>
      <span className="text-[18px] font-medium">{label}</span>
    </div>
    <div className="flex items-center gap-2 text-zest-muted">
      {value ? <span className="text-[17px]">{value}</span> : null}
      <FaChevronRight className="text-base" />
    </div>
  </button>
);

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme, showToast } = useUI();
  const { orders } = useOrders();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [vegMode, setVegMode] = useState(Boolean(user?.preferences?.vegMode));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const userInitial = useMemo(() => (user?.name || 'Guest').charAt(0).toUpperCase(), [user?.name]);
  const addressCount = user?.addresses?.length || 0;
  const orderCount = orders.length;
  const rewardPoints = (orderCount * 12) + 50;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleToggleVegMode = () => {
    const nextValue = !vegMode;
    setVegMode(nextValue);
    updateUser({ preferences: { ...(user?.preferences || {}), vegMode: nextValue } });
    showToast(nextValue ? 'Veg mode enabled' : 'Veg mode disabled');
  };

  const renderMobile = () => (
    <div className="min-h-screen bg-zest-dark px-4 py-5">
      <button onClick={() => navigate('/home')} className="text-3xl text-zest-text mb-4">
        <FaArrowLeft />
      </button>

      <div className="bg-zest-card rounded-3xl overflow-hidden shadow-sm border border-zest-muted/20">
        <div className="p-4 flex gap-4 items-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-5xl text-blue-600 font-semibold">{userInitial}</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-zest-text">{user?.name || 'Himesh'}</h1>
            <button className="text-rose-500 text-base mt-1 font-medium">Edit profile</button>
          </div>
        </div>
        <button className="w-full bg-[#151522] text-amber-200 px-4 py-4 flex items-center justify-between">
          <span className="flex items-center gap-3 text-[18px] font-semibold">
            <FaCrown className="text-amber-300" />
            Join Zestora Gold
          </span>
          <FaChevronRight className="text-xl" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-zest-card rounded-2xl p-4 border border-zest-muted/20">
          <p className="text-zest-muted text-sm flex items-center gap-2">
            <FaRegMoneyBillAlt /> Zestora Money
          </p>
          <p className="text-emerald-600 text-3xl font-bold mt-2">Rs0</p>
        </div>
        <div className="bg-zest-card rounded-2xl p-4 border border-zest-muted/20">
          <p className="text-zest-muted text-sm flex items-center gap-2">
            <FaTicketAlt /> Your coupons
          </p>
          <p className="text-zest-text text-3xl font-bold mt-2">{Math.max(2, Math.floor(orderCount / 2))}</p>
        </div>
      </div>

      <div className="bg-zest-card rounded-3xl mt-4 p-4 border border-zest-muted/20">
        <h2 className="text-[18px] font-bold text-zest-text mb-2">Your preferences</h2>
        <InfoRow
          icon={vegMode ? <FaToggleOn className="text-emerald-600" /> : <FaToggleOff />}
          label="Veg Mode"
          value={vegMode ? 'On' : 'Off'}
          onClick={handleToggleVegMode}
        />
        <InfoRow
          icon={theme === 'dark' ? <FaMoon /> : <FaSun />}
          label="Appearance"
          value={theme === 'dark' ? 'Dark' : 'Light'}
          onClick={toggleTheme}
        />
        <InfoRow
          icon={<FaRegCreditCard />}
          label="Payment methods"
          onClick={() => showToast('Payment methods coming soon')}
        />
      </div>

      <div className="bg-zest-card rounded-3xl mt-4 p-4 border border-zest-muted/20">
        <h2 className="text-[18px] font-bold text-zest-text mb-2">Food delivery</h2>
        <InfoRow icon={<FaListAlt />} label="Your orders" value={String(orderCount)} onClick={() => navigate('/orders')} />
        <InfoRow
          icon={<FaMapMarkerAlt />}
          label="Address book"
          value={`${addressCount}`}
          onClick={() => showToast('Addresses can be managed below')}
        />
        <InfoRow icon={<FaBookmark />} label="Your collections" onClick={() => showToast('Collections feature coming soon')} />
        <InfoRow
          icon={<FaLocationArrow />}
          label="Manage recommendations"
          onClick={() => showToast('Recommendations refreshed')}
        />
        <InfoRow icon={<FaTrain />} label="Order on train" onClick={() => showToast('Train delivery not available yet')} />
      </div>

      <div className="bg-zest-card rounded-3xl mt-4 p-4 border border-zest-muted/20">
        <h2 className="text-[18px] font-bold text-zest-text mb-3">Account details</h2>
        <div className="space-y-2 text-[18px] text-zest-muted">
          <p><span className="font-semibold">Email:</span> {user?.email || 'Not available'}</p>
          <p><span className="font-semibold">Phone:</span> {user?.phone || '+91 98XXXXXX10'}</p>
          <p><span className="font-semibold">City:</span> {user?.addresses?.[0]?.city || 'Alwar'}</p>
          <p><span className="font-semibold">Cart Items:</span> {cartCount}</p>
          <p><span className="font-semibold">Reward Points:</span> {rewardPoints}</p>
        </div>
        <Button onClick={handleLogout} className="mt-4 w-full bg-rose-500 hover:bg-rose-600 text-white">
          <FaSignOutAlt /> Logout
        </Button>
      </div>
    </div>
  );

  const renderDesktop = () => (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
      <div className="grid lg:grid-cols-[320px_1fr] gap-5 md:gap-6">
        <aside className="bg-zest-card border border-zest-muted/15 rounded-3xl p-5 md:p-6 h-fit shadow-xl shadow-black/10">
          <div className="flex items-center gap-3 mb-5 pb-5 border-b border-zest-muted/15">
            <FaUserCircle className="text-5xl text-zest-orange" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-zest-text">{user?.name || 'Guest User'}</h1>
              <p className="text-zest-muted text-sm truncate max-w-[190px]">{user?.email || 'Email unavailable'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-5">
            <div className="rounded-2xl border border-zest-muted/15 bg-zest-dark/45 p-3">
              <p className="text-zest-muted text-xs">Orders</p>
              <p className="text-zest-text text-lg font-bold">{orderCount}</p>
            </div>
            <div className="rounded-2xl border border-zest-muted/15 bg-zest-dark/45 p-3">
              <p className="text-zest-muted text-xs">Points</p>
              <p className="text-zest-orange text-lg font-bold">{rewardPoints}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <button
              onClick={() => navigate('/orders')}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-zest-dark text-zest-text transition-colors"
            >
              Order History
            </button>
            <button className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-zest-dark text-zest-text transition-colors">
              Saved Addresses
            </button>
            <button className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-zest-dark text-zest-text transition-colors">
              Reward Points
            </button>
          </div>
        </aside>

        <div className="space-y-6">
          <section className="bg-zest-card border border-zest-muted/15 rounded-3xl p-5 md:p-6 shadow-xl shadow-black/10">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-zest-text">Profile Overview</h2>
              <button
                onClick={() => navigate('/home')}
                className="text-sm px-3 py-1.5 rounded-xl border border-zest-orange/40 text-zest-orange hover:bg-zest-orange/10 transition-colors"
              >
                Back to Home
              </button>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
              <div className="rounded-2xl border border-zest-muted/15 bg-zest-dark/40 p-4">
                <p className="text-zest-muted text-xs">Total Orders</p>
                <p className="text-zest-text text-xl font-bold mt-1">{orderCount}</p>
              </div>
              <div className="rounded-2xl border border-zest-muted/15 bg-zest-dark/40 p-4">
                <p className="text-zest-muted text-xs">Cart Items</p>
                <p className="text-zest-text text-xl font-bold mt-1">{cartCount}</p>
              </div>
              <div className="rounded-2xl border border-zest-muted/15 bg-zest-dark/40 p-4">
                <p className="text-zest-muted text-xs">Addresses</p>
                <p className="text-zest-text text-xl font-bold mt-1">{addressCount}</p>
              </div>
              <div className="rounded-2xl border border-zest-muted/15 bg-zest-dark/40 p-4">
                <p className="text-zest-muted text-xs">Reward Points</p>
                <p className="text-zest-orange text-xl font-bold mt-1">{rewardPoints}</p>
              </div>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-5">
            <section className="bg-zest-card border border-zest-muted/15 rounded-3xl p-5 md:p-6 shadow-xl shadow-black/10">
              <h2 className="text-xl font-bold text-zest-text mb-4">Preferences</h2>
              <div className="space-y-3">
                <button
                  onClick={handleToggleVegMode}
                  className="w-full text-left p-4 rounded-2xl bg-zest-dark/60 hover:bg-zest-dark transition-colors"
                >
                  <p className="text-zest-muted text-sm">Veg Mode</p>
                  <p className="text-zest-text text-lg font-semibold">{vegMode ? 'Enabled' : 'Disabled'}</p>
                </button>
                <button
                  onClick={toggleTheme}
                  className="w-full text-left p-4 rounded-2xl bg-zest-dark/60 hover:bg-zest-dark transition-colors"
                >
                  <p className="text-zest-muted text-sm">Appearance</p>
                  <p className="text-zest-text text-lg font-semibold">{theme === 'dark' ? 'Dark' : 'Light'}</p>
                </button>
              </div>
            </section>

            <section className="bg-zest-card border border-zest-muted/15 rounded-3xl p-5 md:p-6 shadow-xl shadow-black/10">
              <h2 className="text-xl font-bold text-zest-text mb-4">Account Details</h2>
              <div className="space-y-2.5 text-sm md:text-base">
                <p className="text-zest-text">Email: <span className="text-zest-muted">{user?.email || 'Not available'}</span></p>
                <p className="text-zest-text">Phone: <span className="text-zest-muted">{user?.phone || '+91 98XXXXXX10'}</span></p>
                <p className="text-zest-text">Primary City: <span className="text-zest-muted">{user?.addresses?.[0]?.city || 'Alwar'}</span></p>
                <p className="text-zest-text">Member Since: <span className="text-zest-muted">2026</span></p>
              </div>
            </section>
          </div>

          <section className="bg-zest-card border border-zest-muted/15 rounded-3xl p-5 md:p-6 shadow-xl shadow-black/10">
            <h2 className="text-xl font-bold text-zest-text mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => navigate('/orders')}>
                <FaListAlt /> Open Orders
              </Button>
              <Button variant="secondary" onClick={() => showToast('Coupons coming soon')}>
                <FaTicketAlt /> My Coupons
              </Button>
              <Button variant="secondary" onClick={() => showToast('Gold membership coming soon')}>
                <FaCrown /> Zestora Gold
              </Button>
              <Button onClick={handleLogout} className="bg-zest-danger hover:bg-red-600 text-white">
                <FaSignOutAlt /> Logout
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  return <MainLayout>{isMobile ? renderMobile() : renderDesktop()}</MainLayout>;
};

export default Profile;
