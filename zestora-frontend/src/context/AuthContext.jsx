import { createContext, useState } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

export const AuthContext = createContext();

const defaultAddresses = [
  {
    id: 1,
    label: 'Work',
    line1: 'Tips G, Madhuban Bank Colony',
    city: 'Alwar',
    pincode: '301001',
  },
];

export const AuthProvider = ({ children }) => {
  const savedToken = localStorage.getItem(STORAGE_KEYS.token);
  const savedUser = localStorage.getItem(STORAGE_KEYS.user);

  const [user, setUser] = useState(() => {
    if (!savedUser) return null;
    try {
      const parsed = JSON.parse(savedUser);
      return { ...parsed, addresses: parsed.addresses?.length ? parsed.addresses : defaultAddresses };
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(savedToken && savedUser));
  const [loading] = useState(false);

  const persistUser = (nextUser) => {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const login = (userData, token) => {
    const normalizedUser = {
      ...userData,
      addresses: userData.addresses?.length ? userData.addresses : defaultAddresses,
    };
    localStorage.setItem(STORAGE_KEYS.token, token);
    persistUser(normalizedUser);
    setIsAuthenticated(true);
  };

  const register = (userData, token) => {
    const normalizedUser = {
      ...userData,
      addresses: defaultAddresses,
    };
    localStorage.setItem(STORAGE_KEYS.token, token);
    persistUser(normalizedUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.cart);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedData) => {
    const nextUser = { ...user, ...updatedData };
    persistUser(nextUser);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
