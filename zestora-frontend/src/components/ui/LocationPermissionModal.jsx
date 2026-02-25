import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaCrosshairs, FaTimes } from 'react-icons/fa';
import { useLocationState } from '../../hooks/useLocationState';
import Button from '../common/Button';

const LocationPermissionModal = () => {
  const { showPrompt, status, requestLocation, selectManualCity, dismissPrompt, cityOptions } = useLocationState();
  const [manualCity, setManualCity] = useState(cityOptions[0]);

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-black/55 backdrop-blur-sm p-4 flex items-end md:items-center justify-center"
        >
          <motion.div
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            className="w-full max-w-md rounded-2xl border border-zest-muted/20 bg-zest-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Allow location access?</h3>
              <button onClick={dismissPrompt} className="text-zest-muted hover:text-white">
                <FaTimes />
              </button>
            </div>
            <p className="text-zest-muted mb-5">
              Allow Zestora to detect your city for faster, location-based restaurant listings.
            </p>

            <Button className="w-full mb-3" onClick={requestLocation}>
              <FaCrosshairs /> Use current location
            </Button>

            {(status === 'denied' || status === 'unsupported') && (
              <p className="text-sm text-zest-warning mb-3">
                Location permission unavailable. Please select your city manually.
              </p>
            )}

            <div className="rounded-xl border border-zest-muted/20 p-3 mb-4">
              <label className="text-sm text-zest-muted mb-2 block">Choose city</label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-zest-muted" />
                  <select
                    value={manualCity}
                    onChange={(event) => setManualCity(event.target.value)}
                    className="w-full bg-zest-dark rounded-lg py-2.5 pl-9 pr-3 text-white border border-zest-muted/20 focus:outline-none"
                  >
                    {cityOptions.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <Button variant="secondary" onClick={() => selectManualCity(manualCity)}>
                  Save
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LocationPermissionModal;
