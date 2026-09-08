import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiUrl } from "./utils";

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(
    message: string,
    status: number,
    code?: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
  headers?: Record<string, string>;
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, token, headers, method } = options;

  const response = await fetch(`${getApiUrl()}${path}`, {
    method: method ?? (body !== undefined ? "POST" : "GET"),
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = data?.error;
    throw new ApiError(
      error?.message || "Something went wrong",
      response.status,
      error?.code,
      error,
    );
  }

  return data as T;
}

/** Token storage helpers (AsyncStorage-backed). */
export const tokenStore = {
  async getAccess(): Promise<string | null> {
    return AsyncStorage.getItem("accessToken");
  },
  async getRefresh(): Promise<string | null> {
    return AsyncStorage.getItem("refreshToken");
  },
  async set(access: string, refresh: string): Promise<void> {
    await AsyncStorage.multiSet([
      ["accessToken", access],
      ["refreshToken", refresh],
    ]);
  },
  async clear(): Promise<void> {
    await AsyncStorage.multiRemove(["accessToken", "refreshToken", "user"]);
  },
};

/** Authenticated request helper that attaches the stored access token. */
export async function authedRequest<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const token = await tokenStore.getAccess();
  return apiRequest<T>(path, { ...options, token });
}
