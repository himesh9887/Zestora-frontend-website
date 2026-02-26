import { createContext, useState } from 'react';
import { CITY_OPTIONS, STORAGE_KEYS } from '../utils/constants';
import { inferCityFromCoords } from '../utils/helpers';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const savedCity = localStorage.getItem(STORAGE_KEYS.city) || '';
  const savedLocation = localStorage.getItem(STORAGE_KEYS.location);
  const locationPrompted = localStorage.getItem(STORAGE_KEYS.locationPrompted) === 'true';

  const [city, setCity] = useState(savedCity || 'Alwar');
  const [coords, setCoords] = useState(savedLocation ? JSON.parse(savedLocation) : null);
  const [status, setStatus] = useState('idle');
  const [showPrompt, setShowPrompt] = useState(!locationPrompted);

  const persistLocation = (nextCity, nextCoords = null) => {
    setCity(nextCity);
    setCoords(nextCoords);
    localStorage.setItem(STORAGE_KEYS.city, nextCity);
    if (nextCoords) {
      localStorage.setItem(STORAGE_KEYS.location, JSON.stringify(nextCoords));
    }
    localStorage.setItem(STORAGE_KEYS.locationPrompted, 'true');
    setShowPrompt(false);
  };

  const requestLocation = () => {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (window.location.protocol !== 'https:' && !isLocalhost) {
      setStatus('insecure');
      return;
    }

    if (!navigator.geolocation) {
      setStatus('unsupported');
      return;
    }

    setStatus('loading');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        const detectedCity = inferCityFromCoords(nextCoords.latitude, nextCoords.longitude);
        persistLocation(detectedCity, nextCoords);
        setStatus('granted');
      },
      () => {
        setStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const selectManualCity = (nextCity) => {
    persistLocation(nextCity);
    setStatus('manual');
  };

  const dismissPrompt = () => {
    localStorage.setItem(STORAGE_KEYS.locationPrompted, 'true');
    setShowPrompt(false);
    if (!city) {
      setCity(CITY_OPTIONS[0]);
      localStorage.setItem(STORAGE_KEYS.city, CITY_OPTIONS[0]);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        city,
        coords,
        status,
        showPrompt,
        requestLocation,
        selectManualCity,
        dismissPrompt,
        setShowPrompt,
        cityOptions: CITY_OPTIONS,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
