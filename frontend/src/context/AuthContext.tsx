import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api, { setAuthToken } from '../utils/api';
import { AuthResponse, Settings, User } from '../types';

type AuthContextValue = {
  user: User | null;
  settings: Settings | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string, alias: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'dlab_gantt_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  const applyAuthResponse = useCallback((response: AuthResponse) => {
    setAuthToken(response.token);
    setUser(response.user);
    setSettings(response.settings);
    localStorage.setItem(TOKEN_KEY, response.token);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await api.post<AuthResponse>('/api/auth/login', { email, password });
      applyAuthResponse(data);
      return data;
    },
    [applyAuthResponse]
  );

  const register = useCallback(async (email: string, password: string, alias: string) => {
    await api.post('/api/auth/register', { email, password, alias });
  }, []);

  const logout = useCallback(async () => {
    await api.post('/api/auth/logout');
    setUser(null);
    setSettings(null);
    localStorage.removeItem(TOKEN_KEY);
    setAuthToken();
  }, []);

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get<{ user: User; settings: Settings }>('/api/auth/me');
      setUser(data.user);
      setSettings(data.settings);
    } catch (error) {
      setUser(null);
      setSettings(null);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      setAuthToken(token);
    }
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const value = useMemo(
    () => ({ user, settings, loading, login, register, logout, refresh }),
    [user, settings, loading, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
