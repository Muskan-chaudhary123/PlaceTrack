import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { authApi } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const res = await authApi.getMe();
          if (res && res.success) {
            setUser({
              id: res.data.id,
              fullName: res.data.name,
              email: res.data.email
            });
          } else {
            authService.logout();
            setUser(null);
          }
        } catch (error) {
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = await authService.login(email, password);
      setUser(loggedUser);
      return loggedUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (fullName, email, password) => {
    setLoading(true);
    try {
      const newUser = await authService.signup(fullName, email, password);
      setUser(newUser);
      return newUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
