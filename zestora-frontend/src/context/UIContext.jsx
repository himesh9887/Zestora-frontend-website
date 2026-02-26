import { createContext, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;
    return 'dark';
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3200);
  };

  const value = useMemo(
    () => ({ theme, toggleTheme, toasts, showToast }),
    [theme, toasts]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};
