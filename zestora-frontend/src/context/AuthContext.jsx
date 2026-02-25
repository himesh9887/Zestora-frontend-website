import { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('zestora_token');
    const userData = localStorage.getItem('zestora_user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData, token) => {
    localStorage.setItem('zestora_token', token);
    localStorage.setItem('zestora_user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const register = useCallback((userData, token) => {
    localStorage.setItem('zestora_token', token);
    localStorage.setItem('zestora_user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('zestora_token');
    localStorage.removeItem('zestora_user');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const updateUser = useCallback((updatedData) => {
    const newUserData = { ...user, ...updatedData };
    localStorage.setItem('zestora_user', JSON.stringify(newUserData));
    setUser(newUserData);
  }, [user]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      register, 
      logout, 
      updateUser,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};  