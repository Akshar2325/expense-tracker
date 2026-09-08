import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest, tokenStore } from "./api";

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
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const token = await tokenStore.getAccess();
      if (!token) {
        setUser(null);
        return;
      }
      const data = await apiRequest<User>("/users/me", { token });
      setUser(data);
      await AsyncStorage.setItem("user", JSON.stringify(data));
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("user");
        if (stored) {
          setUser(JSON.parse(stored));
        }
        const token = await tokenStore.getAccess();
        if (token) {
          await refreshUser();
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiRequest<{
      user: User;
      accessToken: string;
      refreshToken: string;
    }>("/auth/login", { body: { email, password } });
    await tokenStore.set(data.accessToken, data.refreshToken);
    setUser(data.user);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
  }, []);

  const register = useCallback(
    async (input: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    }) => {
      const data = await apiRequest<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>("/auth/register", { body: input });
      await tokenStore.set(data.accessToken, data.refreshToken);
      setUser(data.user);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      const token = await tokenStore.getAccess();
      if (token) {
        await apiRequest("/auth/logout", {
          method: "POST",
          body: {},
          token,
        }).catch(() => {});
      }
    } catch {
      /* ignore */
    }
    await tokenStore.clear();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshUser }),
    [user, loading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
