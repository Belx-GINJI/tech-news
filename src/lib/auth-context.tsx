'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

type AuthState = {
  userId: string | null;
  nickname: string | null;
  isCloud: boolean;
};

const AuthContext = createContext<{
  auth: AuthState;
  logout: () => void;
  refreshFavorites: () => void;
} | null>(null);

function parseCookie(): { userId: string; nickname: string } | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(/tech-news-user=([^;]+)/);
  if (!m) return null;
  try {
    const data = JSON.parse(decodeURIComponent(m[1]));
    return data?.userId && data?.nickname ? data : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    userId: null,
    nickname: null,
    isCloud: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  });

  useEffect(() => {
    const c = parseCookie();
    if (c) {
      setAuth((prev) => ({ ...prev, userId: c.userId, nickname: c.nickname }));
    }
  }, []);

  const logout = useCallback(() => {
    document.cookie = 'tech-news-user=; path=/; max-age=0';
    setAuth((prev) => ({ ...prev, userId: null, nickname: null }));
    window.location.href = '/login';
  }, []);

  const refreshFavorites = useCallback(() => {}, []);

  return (
    <AuthContext.Provider value={{ auth, logout, refreshFavorites }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
