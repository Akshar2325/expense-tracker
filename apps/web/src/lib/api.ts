"use client";

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

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  token?: string | null;
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, token, headers, ...rest } = options;

  const response = await fetch(`${getApiUrl()}${path}`, {
    ...rest,
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

/** Token storage helpers (localStorage-backed) */
export const tokenStore = {
  get access() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  },
  get refresh() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refreshToken");
  },
  set(access: string, refresh: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
  },
  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },
};

/** Authenticated request helper */
export async function authedRequest<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const token = tokenStore.access;
  if (!token) {
    throw new ApiError("Not authenticated", 401, "UNAUTHENTICATED");
  }
  return apiRequest<T>(path, { ...options, token });
}
