import axios from "axios";
import { REFRESH_TOKEN, TOKEN } from "@/utils/config";
import { endpoints } from "@/utils/endpoints";
import { getEnv } from "@/lib/env";
import { localizePath } from "@/lib/navigation";
import { toast } from "sonner";

export const apiClient = axios.create({
  baseURL: getEnv("VITE_API_URL"),
  headers: {
    "Content-Type": "application/json"
  }
});

let authRedirectInProgress = false;

function redirectToSigninOnce() {
  if (authRedirectInProgress || typeof window === "undefined") return;

  const target = localizePath("/signin");
  if (window.location.pathname === target) return;

  authRedirectInProgress = true;
  window.location.replace(target);
}

function clearAuthAndRedirect(error) {
  localStorage.removeItem(TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  if (!error?.config?.skipAuthRedirect) {
    redirectToSigninOnce();
  }
}

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem(TOKEN);
  const locale = localStorage.getItem("locale") || "ar";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers.Locale = locale;
  return config;
});

// Shared in-flight refresh promise so concurrent 401s trigger a single refresh call, not one per request.
let refreshPromise = null;

function performTokenRefresh() {
  if (!refreshPromise) {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    refreshPromise = apiClient
      .post(endpoints.refreshToken, undefined, {
        headers: {
          Authorization: refreshToken ? `Bearer ${refreshToken}` : undefined,
          Locale: localStorage.getItem("locale") || "ar",
          isLocalized: "true"
        },
        skipAuthRedirect: true,
        skipErrorToast: true
      })
      .then(response => {
        const accessToken =
          response?.data?.data?.user?.AccessToken || response?.data?.data?.AccessToken;
        if (!accessToken) throw new Error("No access token in refresh response");
        localStorage.setItem(TOKEN, accessToken);
        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.result?.message ||
      error?.message ||
      "Request failed";

    const originalRequest = error?.config;
    const isRefreshCall = originalRequest?.url === endpoints.refreshToken;

    if (status === 401 && !isRefreshCall && !originalRequest?._retry) {
      const hasRefreshToken = Boolean(localStorage.getItem(REFRESH_TOKEN));
      if (hasRefreshToken) {
        try {
          originalRequest._retry = true;
          const accessToken = await performTokenRefresh();
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${accessToken}`
          };
          return apiClient.request(originalRequest);
        } catch {
          clearAuthAndRedirect(error);
          return Promise.reject(error);
        }
      }

      clearAuthAndRedirect(error);
      return Promise.reject(error);
    }

    if (status === 401) {
      clearAuthAndRedirect(error);
      return Promise.reject(error);
    }

    if (typeof window !== "undefined" && !error?.config?.skipErrorToast) {
      toast.error(message);
    }

    return Promise.reject(new Error(message));
  }
);
