import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaBell,
  FaCreditCard,
  FaGlobe,
  FaMapMarkedAlt,
  FaMoon,
  FaSearch,
  FaSms,
} from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import { useUI } from '../hooks/useUI';

const SETTINGS_KEY = 'zestora_settings';

const defaultSettings = {
  orderUpdates: true,
  promoAlerts: true,
  emailReceipts: true,
  smsAlerts: false,
  saveRecentSearches: true,
  appTheme: 'dark',
  language: 'English',
  defaultPayment: 'UPI',
  mapService: 'Google Maps',
};

const toggleRows = [
  { key: 'orderUpdates', icon: FaBell, label: 'Order status updates', hint: 'Get real-time notifications for all order stages.' },
  { key: 'promoAlerts', icon: FaBell, label: 'Offers and promo alerts', hint: 'Receive discount and coupon notifications.' },
  { key: 'emailReceipts', icon: FaBell, label: 'Email invoices', hint: 'Send invoices to your email after each order.' },
  { key: 'smsAlerts', icon: FaSms, label: 'SMS updates', hint: 'Share critical delivery updates over SMS.' },
  { key: 'saveRecentSearches', icon: FaSearch, label: 'Save recent searches', hint: 'Store your recent restaurant and dish searches.' },
];

const selectRows = [
  { key: 'appTheme', icon: FaMoon, label: 'App theme', options: ['dark', 'light'] },
  { key: 'language', icon: FaGlobe, label: 'Language', options: ['English', 'Hindi'] },
  { key: 'defaultPayment', icon: FaCreditCard, label: 'Default payment', options: ['UPI', 'Card', 'Cash on Delivery'] },
  { key: 'mapService', icon: FaMapMarkedAlt, label: 'Map provider', options: ['Google Maps', 'OpenStreetMap'] },
];

const SectionCard = ({ title, description, children }) => (
  <section className="mt-4 rounded-2xl border border-zest-muted/15 bg-zest-card/95 overflow-hidden">
    <div className="px-4 py-3 border-b border-zest-muted/10 bg-zest-dark/25">
      <h2 className="text-base font-semibold text-zest-text">{title}</h2>
      <p className="text-xs text-zest-muted mt-1">{description}</p>
    </div>
    <div>{children}</div>
  </section>
);

const ToggleField = ({ icon: Icon, label, hint, enabled, onToggle, isLast }) => (
  <button
    type="button"
    onClick={onToggle}
    className={`w-full px-4 py-4 text-left flex items-center justify-between gap-3 hover:bg-zest-dark/20 transition-colors ${
      !isLast ? 'border-b border-zest-muted/10' : ''
    }`}
  >
    <div className="flex items-start gap-3 min-w-0">
      <div className="w-9 h-9 rounded-xl bg-zest-dark/40 border border-zest-muted/20 text-zest-text/80 flex items-center justify-center shrink-0">
        <Icon />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-zest-text leading-tight">{label}</p>
        <p className="text-sm text-zest-muted mt-1 leading-snug">{hint}</p>
      </div>
    </div>
    <div className={`w-12 h-7 rounded-full p-1 transition-colors shrink-0 ${enabled ? 'bg-emerald-500/80' : 'bg-zest-muted/30'}`}>
      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  </button>
);

const SelectField = ({ icon: Icon, label, value, options, onChange }) => (
  <div className="rounded-2xl border border-zest-muted/15 bg-zest-card p-3">
    <label className="text-sm text-zest-muted inline-flex items-center gap-2">
      <Icon className="text-zest-text/70" />
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="mt-2 w-full rounded-xl border border-zest-muted/30 bg-zest-dark/50 px-3 py-2.5 text-zest-text focus:outline-none focus:ring-2 focus:ring-zest-orange/40"
    >
      {options.map((option) => (
        <option key={option} value={option} className="bg-zest-card text-zest-text">
          {option}
        </option>
      ))}
    </select>
  </div>
);

const Settings = () => {
  const navigate = useNavigate();
  const { showToast, theme, toggleTheme } = useUI();

  const initialSettings = useMemo(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (!stored) return { ...defaultSettings, appTheme: theme };
      return { ...defaultSettings, ...JSON.parse(stored) };
    } catch {
      return { ...defaultSettings, appTheme: theme };
    }
  }, [theme]);

  const [settings, setSettings] = useState(initialSettings);

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectSetting = (key) => (event) => {
    setSettings((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSave = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    if (settings.appTheme !== theme) {
      toggleTheme();
    }
    showToast('Settings saved successfully');
  };

  const handleReset = () => {
    const reset = { ...defaultSettings, appTheme: theme };
    setSettings(reset);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(reset));
    showToast('Settings reset to default');
  };

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
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="mt-1 text-sm text-zest-muted">Manage notifications, preferences, and app behavior.</p>

            <SectionCard
              title="Notifications"
              description="Control how and when Zestora sends alerts."
            >
              {toggleRows.map((row, index) => (
                <ToggleField
                  key={row.key}
                  icon={row.icon}
                  label={row.label}
                  hint={row.hint}
                  enabled={Boolean(settings[row.key])}
                  onToggle={() => toggleSetting(row.key)}
                  isLast={index === toggleRows.length - 1}
                />
              ))}
            </SectionCard>

            <SectionCard
              title="Preferences"
              description="Choose your default app experience."
            >
              <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectRows.map((row) => (
                <SelectField
                  key={row.key}
                  icon={row.icon}
                  label={row.label}
                  value={settings[row.key]}
                  options={row.options}
                  onChange={selectSetting(row.key)}
                />
              ))}
              </div>
            </SectionCard>

            <div className="mt-4 rounded-2xl border border-zest-muted/15 bg-zest-dark/20 p-3 text-xs text-zest-muted">
              Changes are saved on this device. Use Save settings after modifying values.
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 h-12 rounded-2xl border border-zest-muted/20 text-zest-text/80 hover:text-zest-text hover:border-zest-muted/40"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 h-12 rounded-2xl bg-zest-orange text-white font-semibold hover:bg-orange-600"
              >
                Save settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
