import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, CollectorProfile, CollectorAvailability } from '../types';
import { authApi, LoginPayload, RegisterPayload } from '../api/authApi';
import { collectorApi } from '../api/collectorApi';

interface AuthContextType {
  currentUser: User | null;
  currentCollector: CollectorProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateAvailability: (availability: CollectorAvailability) => Promise<void>;
  updateProfile: (updates: Partial<CollectorProfile>) => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentCollector, setCurrentCollector] = useState<CollectorProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('kc_auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshAuth = useCallback(async () => {
    const storedToken = localStorage.getItem('kc_auth_token');
    if (!storedToken) {
      setCurrentUser(null);
      setCurrentCollector(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.getMe();
      setCurrentUser(response.user);
      setCurrentCollector(response.collector);
    } catch {
      localStorage.removeItem('kc_auth_token');
      setToken(null);
      setCurrentUser(null);
      setCurrentCollector(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(payload);
      localStorage.setItem('kc_auth_token', res.token);
      setToken(res.token);
      setCurrentUser(res.user);
      setCurrentCollector(res.collector);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(payload);
      localStorage.setItem('kc_auth_token', res.token);
      setToken(res.token);
      setCurrentUser(res.user);
      setCurrentCollector(res.collector);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('kc_auth_token');
      setToken(null);
      setCurrentUser(null);
      setCurrentCollector(null);
    }
  };

  const updateAvailability = async (availability: CollectorAvailability) => {
    if (!currentCollector) return;
    try {
      const res = await collectorApi.updateAvailability(availability);
      setCurrentCollector((prev) => (prev ? { ...prev, availability: res.availability } : null));
    } catch (err) {
      console.error('Failed to update availability', err);
      throw err;
    }
  };

  const updateProfile = async (updates: Partial<CollectorProfile>) => {
    if (!currentCollector) return;
    try {
      const updated = await collectorApi.updateProfile(updates);
      setCurrentCollector(updated);
      if (updates.name && currentUser) {
        setCurrentUser({ ...currentUser, name: updates.name });
      }
    } catch (err) {
      console.error('Failed to update profile', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentCollector,
        token,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        register,
        logout,
        updateAvailability,
        updateProfile,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
