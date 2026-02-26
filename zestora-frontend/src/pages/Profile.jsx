import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaBookmark,
  FaClipboardList,
  FaCreditCard,
  FaEnvelopeOpenText,
  FaExclamationTriangle,
  FaGift,
  FaHandHoldingHeart,
  FaLeaf,
  FaLock,
  FaMapMarkerAlt,
  FaMedal,
  FaMoneyCheckAlt,
  FaPalette,
  FaPlane,
  FaQuestionCircle,
  FaReceipt,
  FaShoppingBag,
  FaSlidersH,
  FaTicketAlt,
  FaTrain,
  FaUniversalAccess,
  FaUser,
  FaUserCircle,
  FaUsers,
  FaUtensils,
  FaWallet,
} from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';
import ProfileHeaderCard from '../components/profile/ProfileHeaderCard';
import ProfileSection from '../components/profile/ProfileSection';
import ProfileRow from '../components/profile/ProfileRow';
import ProfileToggleRow from '../components/profile/ProfileToggleRow';
import ProfileTile from '../components/profile/ProfileTile';

const STORAGE_KEYS = {
  vegMode: 'zestora_veg_mode',
};

const Profile = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, showToast } = useUI();
  const navigate = useNavigate();
  const [vegMode, setVegMode] = useState(() => localStorage.getItem(STORAGE_KEYS.vegMode) === 'on');

  const handleVegToggle = () => {
    const next = !vegMode;
    setVegMode(next);
    localStorage.setItem(STORAGE_KEYS.vegMode, next ? 'on' : 'off');
    showToast(`Veg Mode ${next ? 'enabled' : 'disabled'}`);
  };

  const tiles = useMemo(
    () => [
      { icon: FaWallet, title: 'Zestora Money', subtitle: 'Rs 0', to: '/profile/zestora-money' },
      { icon: FaTicketAlt, title: 'Your coupons', to: '/profile/coupons' },
    ],
    []
  );

  const go = (path) => () => navigate(path);

  return (
    <MainLayout>
      <div className="min-h-screen bg-zest-dark text-zest-text">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-zest-text/80 hover:text-zest-text"
          >
            <FaArrowLeft />
          </button>

          <ProfileHeaderCard
            initial={user?.name?.[0] || 'U'}
            name={user?.name || 'User'}
            onEdit={go('/profile/edit')}
            onGold={go('/profile/redeem-gold')}
          />

          <div className="mt-4 grid grid-cols-2 gap-3">
            {tiles.map((tile) => (
              <ProfileTile
                key={tile.title}
                icon={tile.icon}
                title={tile.title}
                subtitle={tile.subtitle}
                onClick={go(tile.to)}
              />
            ))}
          </div>

          <ProfileSection title="Your preferences">
            <ProfileToggleRow
              icon={FaLeaf}
              label="Veg Mode"
              valueLabel={vegMode ? 'On' : 'Off'}
              enabled={vegMode}
              onToggle={handleVegToggle}
            />
            <ProfileToggleRow
              icon={FaPalette}
              label="Appearance"
              valueLabel={theme === 'dark' ? 'Dark' : 'Light'}
              enabled={theme === 'dark'}
              onToggle={toggleTheme}
            />
            <ProfileRow icon={FaCreditCard} label="Payment methods" onClick={go('/profile/payment-methods')} />
          </ProfileSection>

          <ProfileSection title="Food delivery">
            <ProfileRow icon={FaClipboardList} label="Your orders" onClick={go('/orders')} />
            <ProfileRow icon={FaMapMarkerAlt} label="Address book" onClick={go('/profile/address-book')} />
            <ProfileRow icon={FaBookmark} label="Your collections" onClick={go('/profile/collections')} />
            <ProfileRow icon={FaSlidersH} label="Manage recommendations" onClick={go('/profile/recommendations')} />
            <ProfileRow icon={FaTrain} label="Order on train" onClick={go('/profile/order-train')} />
          </ProfileSection>

          <ProfileSection title="Gift cards & credits">
            <ProfileRow icon={FaGift} label="Buy Gift Card" onClick={go('/profile/gift-card-buy')} />
            <ProfileRow icon={FaTicketAlt} label="Claim Gift Card" onClick={go('/profile/gift-card-claim')} />
            <ProfileRow icon={FaMoneyCheckAlt} label="Zestora Credits" onClick={go('/profile/credits')} />
          </ProfileSection>

          <ProfileSection title="Zestora For Enterprise">
            <ProfileRow icon={FaUsers} label="For employers" onClick={go('/profile/enterprise-employers')} />
            <ProfileRow icon={FaUserCircle} label="For employees" onClick={go('/profile/enterprise-employees')} />
          </ProfileSection>

          <ProfileSection title="Feeding India">
            <ProfileRow icon={FaHandHoldingHeart} label="Your impact" onClick={go('/profile/feeding-impact')} />
            <ProfileRow icon={FaReceipt} label="Get Feeding India receipt" onClick={go('/profile/feeding-receipt')} />
          </ProfileSection>

          <ProfileSection title="Memberships & rewards">
            <ProfileRow icon={FaPlane} label="Air India Maharaja Club" onClick={go('/profile/maharaja-club')} />
            <ProfileRow icon={FaMedal} label="Redeem Gold coupon" onClick={go('/profile/redeem-gold')} />
          </ProfileSection>

          <ProfileSection title="Help & support">
            <ProfileRow icon={FaQuestionCircle} label="Online ordering help" onClick={go('/support')} />
            <ProfileRow icon={FaLock} label="Hidden Restaurants" onClick={go('/profile/hidden-restaurants')} />
            <ProfileRow icon={FaEnvelopeOpenText} label="Hear from restaurants" onClick={go('/profile/hear-restaurants')} />
          </ProfileSection>

          <ProfileSection title="Dining & experiences">
            <ProfileRow icon={FaUtensils} label="Your dining transactions" onClick={go('/profile/dining-transactions')} />
            <ProfileRow icon={FaMedal} label="Your dining rewards" onClick={go('/profile/dining-rewards')} />
            <ProfileRow icon={FaBookmark} label="Your bookings" onClick={go('/profile/dining-bookings')} />
            <ProfileRow icon={FaBookmark} label="Your collections" onClick={go('/profile/dining-collections')} />
            <ProfileRow icon={FaQuestionCircle} label="Dining help" onClick={go('/profile/dining-help')} />
            <ProfileRow icon={FaShoppingBag} label="Claim invite code" onClick={go('/profile/invite-code')} />
          </ProfileSection>

          <ProfileSection title="More">
            <ProfileRow icon={FaUser} label="Your feedback" onClick={go('/profile/feedback')} />
            <ProfileRow icon={FaQuestionCircle} label="About" onClick={go('/profile/about')} />
            <ProfileRow icon={FaEnvelopeOpenText} label="Send feedback" onClick={go('/profile/send-feedback')} />
            <ProfileRow icon={FaExclamationTriangle} label="Report a safety emergency" onClick={go('/profile/safety-emergency')} />
            <ProfileRow icon={FaUniversalAccess} label="Accessibility" onClick={go('/profile/accessibility')} />
            <ProfileRow icon={FaSlidersH} label="Settings" onClick={go('/profile/settings')} />
            <ProfileRow icon={FaUserCircle} label="Log out" onClick={logout} />
          </ProfileSection>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
