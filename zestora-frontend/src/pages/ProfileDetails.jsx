import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';

const pageMap = {
  'address-book': { title: 'Address book', description: 'Manage your saved delivery addresses.' },
  'collections': { title: 'Your collections', description: 'Your saved restaurants and lists.' },
  'recommendations': { title: 'Manage recommendations', description: 'Control personalized suggestions.' },
  'order-train': { title: 'Order on train', description: 'Order food for your train journey.' },
  'gift-card-buy': { title: 'Buy Gift Card', description: 'Purchase gift cards for friends and family.' },
  'gift-card-claim': { title: 'Claim Gift Card', description: 'Redeem your gift card code.' },
  'credits': { title: 'Zestora Credits', description: 'View and manage your credits.' },
  'enterprise-employers': { title: 'For employers', description: 'Company food benefits and tools.' },
  'enterprise-employees': { title: 'For employees', description: 'Employee benefits and credits.' },
  'feeding-impact': { title: 'Your impact', description: 'Track your Feeding India impact.' },
  'feeding-receipt': { title: 'Feeding India receipt', description: 'Download donation receipts.' },
  'maharaja-club': { title: 'Air India Maharaja Club', description: 'Link your membership.' },
  'redeem-gold': { title: 'Redeem Gold coupon', description: 'Redeem membership benefits.' },
  'hidden-restaurants': { title: 'Hidden Restaurants', description: 'Manage hidden restaurant list.' },
  'hear-restaurants': { title: 'Hear from restaurants', description: 'Communication preferences.' },
  'dining-transactions': { title: 'Dining transactions', description: 'Your dining history and bills.' },
  'dining-rewards': { title: 'Dining rewards', description: 'Your dining rewards summary.' },
  'dining-bookings': { title: 'Your bookings', description: 'Reservations and table bookings.' },
  'dining-collections': { title: 'Dining collections', description: 'Your dining lists and picks.' },
  'dining-help': { title: 'Dining help', description: 'Help with dining experiences.' },
  'invite-code': { title: 'Claim invite code', description: 'Redeem your invite offers.' },
  'feedback': { title: 'Your feedback', description: 'View and manage feedback.' },
  'about': { title: 'About', description: 'App version and company info.' },
  'send-feedback': { title: 'Send feedback', description: 'Share suggestions or issues.' },
  'safety-emergency': { title: 'Report a safety emergency', description: 'Get help in emergencies.' },
  'accessibility': { title: 'Accessibility', description: 'Accessibility settings and support.' },
  'settings': { title: 'Settings', description: 'Profile and app preferences.' },
  'zestora-money': { title: 'Zestora Money', description: 'Balance and transaction history.' },
  'coupons': { title: 'Your coupons', description: 'Active coupons and offers.' },
  'payment-methods': { title: 'Payment methods', description: 'Manage saved payment methods.' },
};

const ProfileDetails = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const page = useMemo(
    () => pageMap[slug] || { title: 'Details', description: 'This page is under construction.' },
    [slug]
  );

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [slug]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-zest-dark text-zest-text">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-zest-text/80 hover:text-zest-text"
          >
            <FaArrowLeft />
            Back
          </button>

          <div className="mt-4 bg-zest-card rounded-3xl border border-zest-muted/10 p-5">
            <h1 className="text-2xl font-bold">{page.title}</h1>
            <p className="mt-2 text-zest-muted">{page.description}</p>
            <div className="mt-4 rounded-2xl border border-dashed border-zest-muted/30 p-4 text-sm text-zest-muted">
              This section is ready for integration with real data.
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfileDetails;
