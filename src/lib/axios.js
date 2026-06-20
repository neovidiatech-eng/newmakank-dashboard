import axios from "axios";
import { REFRESH_TOKEN, TOKEN } from "@/utils/config";
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

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem(TOKEN);
  const locale = localStorage.getItem("locale") || "ar";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers.Locale = locale;
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.result?.message ||
      error?.message ||
      "Request failed";

    if (status === 401) {
      localStorage.removeItem(TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      if (!error?.config?.skipAuthRedirect) {
        redirectToSigninOnce();
      }
      return Promise.reject(error);
    }

    if (typeof window !== "undefined" && !error?.config?.skipErrorToast) {
      if (!message || !message.includes("Unsupported type for boolean conversion")) {
        toast.error(message);
      }
    }

    return Promise.reject(new Error(message));
  }
);
