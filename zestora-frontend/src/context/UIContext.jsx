import { createContext, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE_KEYS.theme) || 'dark');
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2200);
  };

  const value = useMemo(
    () => ({ theme, toggleTheme, toasts, showToast }),
    [theme, toasts]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};
