import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaChevronDown,
  FaClock,
  FaCrosshairs,
  FaEllipsisH,
  FaMapMarkerAlt,
  FaPlus,
  FaSearch,
  FaShareAlt,
} from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../hooks/useAuth';
import { useLocationState } from '../hooks/useLocationState';
import { useUI } from '../hooks/useUI';

const LocationPicker = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { city, cityOptions, requestLocation, selectManualCity, status } = useLocationState();
  const { showToast } = useUI();
  const [query, setQuery] = useState('');

  const savedAddresses = useMemo(
    () => user?.addresses?.map((address) => ({ ...address, distance: '0 m' })) || [],
    [user]
  );

  const nearbyLocations = useMemo(
    () => [
      { id: 'near-1', label: 'Alwar Junction', line1: 'Naru Marg, Mungshka, Indra Colony, Alwar, Rajasthan', distance: '693 m', city: 'Alwar' },
      { id: 'near-2', label: 'Hope Circus', line1: 'Hope Circus, Alwar, Rajasthan', distance: '1.1 km', city: 'Alwar' },
    ],
    []
  );

  const recentLocations = useMemo(
    () => [
      { id: 'recent-1', label: 'Work', line1: 'Tips G, Madhuban Bank Colony, Alwar, Rajasthan, India', distance: '0 m', city: 'Alwar' },
    ],
    []
  );

  const filteredCities = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cityOptions;
    return cityOptions.filter((option) => option.toLowerCase().includes(q));
  }, [query, cityOptions]);

  const handleSelectCity = (nextCity) => {
    selectManualCity(nextCity);
    showToast(`Location set to ${nextCity}`);
  };

  const handleSelectFromCard = (nextCity, label) => {
    if (!nextCity) return;
    selectManualCity(nextCity);
    showToast(`${label} selected`);
  };

  const lastStatusRef = useRef(null);

  useEffect(() => {
    if (status === lastStatusRef.current) return;
    lastStatusRef.current = status;

    if (status === 'granted') {
      showToast('Current location set');
    }
    if (status === 'denied') {
      showToast('Location permission denied', 'error');
    }
    if (status === 'unsupported') {
      showToast('Location not supported', 'error');
    }
    if (status === 'insecure') {
      showToast('Location requires HTTPS or localhost', 'error');
    }
  }, [status, showToast]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-zest-dark text-zest-text">
        <div className="max-w-4xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center gap-3 text-lg md:text-xl font-semibold">
            <button onClick={() => navigate(-1)} className="text-zest-text/70 hover:text-zest-text">
              <FaChevronDown />
            </button>
            <span>Select a location</span>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-3 h-12 px-4 rounded-2xl border border-zest-muted/15 bg-zest-card">
              <FaSearch className="text-emerald-600" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for area, street name..."
                className="flex-1 bg-transparent text-zest-text placeholder:text-zest-muted focus:outline-none"
              />
            </div>

            {query.trim().length > 0 && (
              <div className="mt-3 bg-zest-card border border-zest-muted/10 rounded-2xl overflow-hidden">
                {filteredCities.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelectCity(option)}
                    className={`w-full px-4 py-3 text-left border-t border-zest-muted/10 hover:bg-zest-dark/5 ${
                      option === city ? 'text-emerald-500 font-semibold' : 'text-zest-text'
                    }`}
                  >
                    {option}
                  </button>
                ))}
                {!filteredCities.length && (
                  <div className="px-4 py-3 text-sm text-zest-muted">No results found.</div>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 bg-zest-card rounded-2xl border border-zest-muted/10 overflow-hidden">
            <button
              onClick={requestLocation}
              className="w-full px-4 py-4 flex items-center justify-between border-b border-zest-muted/10"
            >
              <div className="flex items-center gap-3 text-emerald-600 font-semibold">
                <FaCrosshairs />
                Use current location
              </div>
              <FaChevronDown className="rotate-[-90deg]" />
            </button>
            <button
              onClick={() => navigate('/profile/address-book')}
              className="w-full px-4 py-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 text-emerald-600 font-semibold">
                <FaPlus />
                Add Address
              </div>
              <FaChevronDown className="rotate-[-90deg]" />
            </button>
          </div>

          {(status === 'denied' || status === 'unsupported' || status === 'insecure') && (
            <div className="mt-3 rounded-2xl border border-zest-warning/30 bg-zest-warning/10 px-4 py-3 text-sm text-zest-warning">
              {status === 'denied' && (
                <>Location permission is denied. Please enable location access in your browser settings and try again.</>
              )}
              {status === 'unsupported' && (
                <>Location is not supported on this device/browser. Please select a location manually.</>
              )}
              {status === 'insecure' && (
                <>Location needs HTTPS. Open the site on `https://` or use `localhost` in development.</>
              )}
            </div>
          )}

          <Section title="Saved addresses">
            <div className="grid gap-3 md:grid-cols-2">
              {savedAddresses.length ? (
                savedAddresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    icon={<FaMapMarkerAlt />}
                    label={address.label}
                    distance={address.distance}
                    line1={`${address.line1}, ${address.city}`}
                    phone={address.phone}
                    onSelect={() => handleSelectFromCard(address.city, address.label)}
                  />
                ))
              ) : (
                <EmptyCard text="No saved addresses yet." />
              )}
            </div>
          </Section>

          <Section title="Nearby locations">
            <div className="grid gap-3 md:grid-cols-2">
              {nearbyLocations.map((place) => (
                <AddressCard
                  key={place.id}
                  icon={<FaMapMarkerAlt />}
                  label={place.label}
                  distance={place.distance}
                  line1={place.line1}
                  onSelect={() => handleSelectFromCard(place.city, place.label)}
                />
              ))}
            </div>
          </Section>

          <Section title="Recent locations">
            <div className="grid gap-3 md:grid-cols-2">
              {recentLocations.map((place) => (
                <AddressCard
                  key={place.id}
                  icon={<FaClock />}
                  label={place.label}
                  distance={place.distance}
                  line1={place.line1}
                  onSelect={() => handleSelectFromCard(place.city, place.label)}
                />
              ))}
            </div>
          </Section>

          <div className="mt-6 text-center text-xs text-zest-muted">
            powered by <span className="font-semibold text-zest-text">Google</span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const Section = ({ title, children }) => (
  <div className="mt-6">
    <div className="text-xs uppercase tracking-[0.2em] text-zest-muted mb-3">{title}</div>
    {children}
  </div>
);

const AddressCard = ({ icon, label, line1, distance, phone, onSelect }) => (
  <div className="bg-zest-card rounded-2xl border border-zest-muted/10 p-4">
    <button onClick={onSelect} className="w-full text-left">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-zest-dark/10 flex items-center justify-center text-zest-text/70">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="font-semibold text-zest-text">{label}</div>
            <span className="text-xs text-zest-muted">{distance}</span>
          </div>
          <div className="text-sm text-zest-muted mt-1">{line1}</div>
          {phone && <div className="text-sm text-zest-muted mt-1">Phone number: {phone}</div>}
        </div>
      </div>
    </button>

    <div className="mt-4 flex items-center gap-3">
      <button className="w-9 h-9 rounded-full border border-zest-muted/20 flex items-center justify-center text-zest-text/60">
        <FaEllipsisH />
      </button>
      <button className="w-9 h-9 rounded-full border border-zest-muted/20 flex items-center justify-center text-emerald-600">
        <FaShareAlt />
      </button>
    </div>
  </div>
);

const EmptyCard = ({ text }) => (
  <div className="bg-zest-card rounded-2xl border border-dashed border-zest-muted/20 p-4 text-sm text-zest-muted">
    {text}
  </div>
);

export default LocationPicker;
