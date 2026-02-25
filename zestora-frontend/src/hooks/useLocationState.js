import { useContext } from 'react';
import { LocationContext } from '../context/LocationContext';

export const useLocationState = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationState must be used within LocationProvider');
  }
  return context;
};
