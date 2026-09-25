import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('estatehub_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('estatehub_token');
    if (token && !user) {
      authService
        .getMe()
        .then((data) => setUser(data.user))
        .catch(() => {
          localStorage.removeItem('estatehub_token');
          localStorage.removeItem('estatehub_user');
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = (user, token) => {
    localStorage.setItem('estatehub_token', token);
    localStorage.setItem('estatehub_user', JSON.stringify(user));
    setUser(user);
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      persist(data.user, data.token);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const data = await authService.register(payload);
      persist(data.user, data.token);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('estatehub_token');
    localStorage.removeItem('estatehub_user');
    setUser(null);
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem('estatehub_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
