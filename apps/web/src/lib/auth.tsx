"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { apiRequest, tokenStore, type ApiError } from "./api";

export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  defaultCurrency: string;
  timezone: string;
  locale: string;
  emailVerified: boolean;
  createdAt: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiRequest<User>("/users/me", {
        token: tokenStore.access,
      });
      setUser(data);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(data));
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    }
    if (tokenStore.access) {
      refreshUser();
    }
    setLoading(false);
  }, [refreshUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await apiRequest<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      tokenStore.set(data.accessToken, data.refreshToken);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    },
    [router],
  );

  const register = useCallback(
    async (data: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    }) => {
      const res = await apiRequest<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>("/auth/register", {
        method: "POST",
        body: data,
      });
      tokenStore.set(res.accessToken, res.refreshToken);
      setUser(res.user);
      localStorage.setItem("user", JSON.stringify(res.user));
      router.push("/dashboard");
    },
    [router],
  );

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

export type { ApiError };
