'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  demoLogin: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      }
    } catch (err) {
      console.error('Session check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (emailOrUsername, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrUsername, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to login');
    }

    setUser(data.user);
    return data.user;
  };

  const register = async ({ username, email, password, name, bio, avatar }) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, name, bio, avatar }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to register');
    }

    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
    }
  };

  const demoLogin = async (type = 'admin') => {
    const credentials = type === 'admin'
      ? { emailOrUsername: 'alex@example.com', password: 'password123' }
      : { emailOrUsername: 'sophia@example.com', password: 'password123' };

    return login(credentials.emailOrUsername, credentials.password);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, demoLogin, refreshUser: fetchSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
