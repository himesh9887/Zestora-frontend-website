import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaChevronRight } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';

const detailsMap = {
  'address-book': {
    title: 'Address Book',
    description: 'Manage delivery addresses for faster checkout.',
    items: ['Add Home, Work, and Other addresses', 'Set default address for every order', 'Update landmark and pincode details'],
    metrics: [{ label: 'Saved addresses', value: '1' }, { label: 'Default', value: 'Work' }],
  },
  collections: {
    title: 'Your Collections',
    description: 'Organize favorite restaurants into custom lists.',
    items: ['Create unlimited collections', 'Save restaurants for quick repeat orders', 'Share collection links with friends'],
    metrics: [{ label: 'Collections', value: '4' }, { label: 'Saved places', value: '23' }],
  },
  recommendations: {
    title: 'Manage Recommendations',
    description: 'Control personalized suggestions shown on your home feed.',
    items: ['Hide cuisines you do not prefer', 'Tune recommendations by diet type', 'Refresh suggestion model anytime'],
    metrics: [{ label: 'Preferred cuisine', value: 'North Indian' }, { label: 'Diet mode', value: 'Mixed' }],
  },
  'order-train': {
    title: 'Order on Train',
    description: 'Book meals by PNR and get delivery to your seat.',
    items: ['Search station-wise food partners', 'Add coach and seat details', 'Track train order separately'],
    metrics: [{ label: 'Station coverage', value: '300+' }, { label: 'Avg prep time', value: '25 min' }],
  },
  'gift-card-buy': {
    title: 'Buy Gift Card',
    description: 'Purchase digital gift cards for friends and family.',
    items: ['Choose custom amount from Rs100 to Rs10,000', 'Add personal message before sending', 'Pay via UPI, card, or wallet'],
    metrics: [{ label: 'Min amount', value: 'Rs100' }, { label: 'Delivery', value: 'Instant' }],
  },
  'gift-card-claim': {
    title: 'Claim Gift Card',
    description: 'Redeem gift card and move balance to credits.',
    items: ['Enter 16-digit gift code', 'Apply balance automatically on checkout', 'View claim history in credits tab'],
    metrics: [{ label: 'Claim status', value: 'Ready' }, { label: 'Processing', value: '< 5 sec' }],
  },
  credits: {
    title: 'Zestora Credits',
    description: 'Track promotional and referral credits.',
    items: ['Check active and expiring credits', 'Use credits in one tap at checkout', 'View full transaction history'],
    metrics: [{ label: 'Available', value: 'Rs120' }, { label: 'Expiring soon', value: 'Rs40' }],
  },
  'enterprise-employers': {
    title: 'For Employers',
    description: 'Set up meal benefits for your organization.',
    items: ['Invite employees by work email', 'Set spending limits and policy rules', 'Download monthly reimbursement reports'],
    metrics: [{ label: 'Teams onboarded', value: '250+' }, { label: 'Policy templates', value: '12' }],
  },
  'enterprise-employees': {
    title: 'For Employees',
    description: 'Access corporate meal plans and benefits.',
    items: ['Link office email to activate benefits', 'Use allocated meal budget for orders', 'Track personal and company spending'],
    metrics: [{ label: 'Benefit status', value: 'Active' }, { label: 'This month used', value: 'Rs0' }],
  },
  'feeding-impact': {
    title: 'Your Impact',
    description: 'See how your contributions help Feeding India.',
    items: ['Every eligible order contributes meals', 'Track total meals supported', 'Share impact summary card'],
    metrics: [{ label: 'Meals supported', value: '18' }, { label: 'Last contribution', value: '2 days ago' }],
  },
  'feeding-receipt': {
    title: 'Feeding India Receipt',
    description: 'Download receipts for tax or records.',
    items: ['Get receipts by month and year', 'Receive PDF copy on email', 'Download all-time statement'],
    metrics: [{ label: 'Last receipt', value: 'Jan 2026' }, { label: 'Format', value: 'PDF' }],
  },
  'maharaja-club': {
    title: 'Air India Maharaja Club',
    description: 'Link account and unlock loyalty benefits.',
    items: ['Connect loyalty account in seconds', 'Earn points on eligible orders', 'Track point credit status'],
    metrics: [{ label: 'Linked', value: 'No' }, { label: 'Eligible orders', value: 'All prepaid' }],
  },
  'redeem-gold': {
    title: 'Redeem Gold Coupon',
    description: 'Apply membership coupon and unlock free delivery benefits.',
    items: ['Enter promo code for Gold membership', 'Preview plan validity before confirming', 'Auto-renew can be managed in settings'],
    metrics: [{ label: 'Current plan', value: 'Free' }, { label: 'Gold validity', value: 'Not active' }],
  },
  'hidden-restaurants': {
    title: 'Hidden Restaurants',
    description: 'Control restaurants hidden from your feed.',
    items: ['Unhide restaurants anytime', 'Hide based on cuisine preference', 'Reset hidden list from settings'],
    metrics: [{ label: 'Hidden list', value: '2' }, { label: 'Last updated', value: 'This week' }],
  },
  'hear-restaurants': {
    title: 'Hear from Restaurants',
    description: 'Manage direct updates from partner restaurants.',
    items: ['Allow menu launch notifications', 'Enable order-specific messages only', 'Mute all promotional communication'],
    metrics: [{ label: 'Communication', value: 'Limited' }, { label: 'Muted partners', value: '5' }],
  },
  'dining-transactions': {
    title: 'Dining Transactions',
    description: 'Review dine-in payments and bills.',
    items: ['View transaction amount and date', 'Download payment receipts', 'Flag unexpected charge quickly'],
    metrics: [{ label: 'Total visits', value: '6' }, { label: 'This month spend', value: 'Rs2,430' }],
  },
  'dining-rewards': {
    title: 'Dining Rewards',
    description: 'Track rewards earned from dining bookings.',
    items: ['See pending and confirmed rewards', 'Redeem credits for next booking', 'Check reward expiry dates'],
    metrics: [{ label: 'Reward points', value: '780' }, { label: 'Expiring', value: '120' }],
  },
  'dining-bookings': {
    title: 'Your Bookings',
    description: 'Manage table bookings and reservation details.',
    items: ['Reschedule upcoming booking', 'Cancel booking within policy window', 'View guest and occasion details'],
    metrics: [{ label: 'Upcoming', value: '1' }, { label: 'Completed', value: '9' }],
  },
  'dining-collections': {
    title: 'Dining Collections',
    description: 'Save curated dine-in places for special occasions.',
    items: ['Create city-based dining lists', 'Add notes for each place', 'Share collection with contacts'],
    metrics: [{ label: 'Lists created', value: '3' }, { label: 'Saved dining spots', value: '16' }],
  },
  'dining-help': {
    title: 'Dining Help',
    description: 'Get quick support for reservations and offers.',
    items: ['Raise booking issue from order ID', 'Chat with support in real time', 'Track resolution timeline'],
    metrics: [{ label: 'Avg response', value: '< 2 min' }, { label: 'Support hours', value: '24 x 7' }],
  },
  'invite-code': {
    title: 'Claim Invite Code',
    description: 'Redeem invite codes and unlock referral bonuses.',
    items: ['Enter valid invite code once', 'Apply reward instantly to account', 'Track referral bonus usage'],
    metrics: [{ label: 'Claim window', value: '30 days' }, { label: 'Bonus credit', value: 'Up to Rs200' }],
  },
  feedback: {
    title: 'Your Feedback',
    description: 'View feedback submitted by you.',
    items: ['Review all submitted feedback', 'Track whether feedback was resolved', 'Continue previous feedback thread'],
    metrics: [{ label: 'Submitted', value: '4' }, { label: 'Resolved', value: '3' }],
  },
  about: {
    title: 'About Zestora',
    description: 'App and platform information.',
    items: ['App version and release notes', 'Terms, privacy, and policy links', 'Business and support details'],
    metrics: [{ label: 'Version', value: 'v1.2.4' }, { label: 'Build', value: 'Stable' }],
  },
  'send-feedback': {
    title: 'Send Feedback',
    description: 'Share your suggestions to improve the app.',
    items: ['Submit bug report with screenshots', 'Share feature requests', 'Rate your experience with comments'],
    metrics: [{ label: 'Submission', value: 'Open' }, { label: 'Expected reply', value: '24 hours' }],
  },
  'safety-emergency': {
    title: 'Report a Safety Emergency',
    description: 'Reach support quickly in urgent situations.',
    items: ['Direct connect to emergency support', 'Share order and live location details', 'Escalate to priority resolution queue'],
    metrics: [{ label: 'Priority', value: 'High' }, { label: 'Help response', value: '< 60 sec' }],
  },
  accessibility: {
    title: 'Accessibility',
    description: 'Configure app for better readability and navigation.',
    items: ['Increase text readability mode', 'Reduce motion and transition effects', 'Enable high-contrast visual support'],
    metrics: [{ label: 'Readable mode', value: 'Off' }, { label: 'Contrast mode', value: 'Standard' }],
  },
  settings: {
    title: 'Settings',
    description: 'Manage app-level configuration and preferences.',
    items: ['Notification and communication controls', 'Theme and language options', 'Payment and map provider defaults'],
    metrics: [{ label: 'Configured', value: '9 options' }, { label: 'Status', value: 'Synced locally' }],
  },
  'zestora-money': {
    title: 'Zestora Money',
    description: 'Wallet balance and transaction logs.',
    items: ['Add money securely using UPI/card', 'Track debits and refunds by order', 'Enable low-balance auto-alert'],
    metrics: [{ label: 'Current balance', value: 'Rs0' }, { label: 'Last transaction', value: 'No recent activity' }],
  },
  coupons: {
    title: 'Your Coupons',
    description: 'Check active discounts and coupon status.',
    items: ['View coupon eligibility by cart value', 'Save high-value coupons for later', 'See used and expired coupon history'],
    metrics: [{ label: 'Active coupons', value: '7' }, { label: 'Best discount', value: '40% OFF' }],
  },
  'payment-methods': {
    title: 'Payment Methods',
    description: 'Add and manage your preferred payment options.',
    items: ['Save UPI IDs and cards securely', 'Set a default payment method', 'Enable one-tap prepaid checkout'],
    metrics: [{ label: 'Saved methods', value: '2' }, { label: 'Default', value: 'UPI' }],
  },
};

const fallbackPage = {
  title: 'Profile Details',
  description: 'Manage and review information for this section.',
  items: ['See current status for this profile area', 'Update data through linked screens', 'Contact support for advanced help'],
  metrics: [{ label: 'Status', value: 'Available' }, { label: 'Mode', value: 'Interactive' }],
};

const primaryActionMap = {
  settings: { label: 'Open settings page', path: '/profile/settings' },
  'address-book': { label: 'Open address book', path: '/profile/address-book' },
  'send-feedback': { label: 'Send feedback now', path: '/support' },
  'safety-emergency': { label: 'Get emergency help', path: '/support' },
  'dining-help': { label: 'Open dining support', path: '/support' },
  'order-train': { label: 'Need train order help', path: '/support' },
};

const ProfileDetails = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const page = useMemo(() => detailsMap[slug] || fallbackPage, [slug]);
  const primaryAction = primaryActionMap[slug];

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
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h1 className="text-2xl font-bold">{page.title}</h1>
              <span className="text-xs rounded-full px-2.5 py-1 bg-emerald-500/15 text-emerald-500 font-semibold">
                Active
              </span>
            </div>
            <p className="mt-2 text-zest-muted">{page.description}</p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {page.metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-zest-muted/20 bg-zest-dark/30 p-3">
                  <p className="text-xs uppercase tracking-wide text-zest-muted">{metric.label}</p>
                  <p className="mt-1 font-semibold text-zest-text">{metric.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-zest-muted/20 bg-zest-dark/20 p-4">
              <p className="text-sm font-semibold text-zest-text">What you can do here</p>
              <div className="mt-3 space-y-2">
                {page.items.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-zest-muted">
                    <FaCheckCircle className="mt-0.5 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              {primaryAction ? (
                <button
                  onClick={() => navigate(primaryAction.path)}
                  className="flex-1 h-11 rounded-2xl bg-zest-orange text-white font-semibold hover:bg-orange-600"
                >
                  {primaryAction.label}
                </button>
              ) : null}

              <button
                onClick={() => navigate('/support')}
                className={`${primaryAction ? 'flex-1' : 'w-full'} h-11 rounded-2xl border border-zest-muted/30 text-zest-text/90 inline-flex items-center justify-center gap-2`}
              >
                Need help
                <FaChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfileDetails;
