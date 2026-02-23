import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiError } from "@/types/api";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
});

// ── Request interceptor ────────────────────────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const raw = localStorage.getItem("auth_tokens");
    if (raw) {
      try {
        const tokens = JSON.parse(raw) as { accessToken: string };
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
      } catch {
        // malformed token — ignore
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor ──────────────────────────────────────────────────
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (error.response?.status === 401 && original && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const raw = localStorage.getItem("auth_tokens");
        if (!raw) throw new Error("No refresh token");
        const { refreshToken } = JSON.parse(raw) as { refreshToken: string };

        const { data } = await axios.post<{
          accessToken: string;
          refreshToken: string;
        }>(`${BASE_URL}/auth/refresh`, { refreshToken });

        const updatedTokens = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
        localStorage.setItem("auth_tokens", JSON.stringify(updatedTokens));

        refreshQueue.forEach((cb) => cb(data.accessToken));
        refreshQueue = [];

        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem("auth_tokens");
        window.location.href = "/login";
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    // Normalize error shape
    let message: string;
    if (!error.response) {
      // No response at all — server is down, wrong URL, or CORS preflight blocked
      message =
        "Unable to reach the server. Please check your internet connection or try again later.";
    } else {
      message =
        (error.response.data as Record<string, string>)?.message ??
        error.message;
    }

    const apiError: ApiError = {
      message,
      statusCode: error.response?.status ?? 0,
      errors: (error.response?.data as Record<string, Record<string, string[]>>)
        ?.errors,
    };
    return Promise.reject(apiError);
  },
);

export default api;
