import { apiClient } from "@/lib/axios";
import { endpointName, endpoints, endpointType } from "@/utils/endpoints";
import { extractSearchParams } from "@/utils/extractSearchParams";
import type { AxiosRequestConfig } from "axios";

type DashboardAxiosRequestConfig = AxiosRequestConfig & {
  skipAuthRedirect?: boolean;
};

export function buildEndpointUrl(endPoint: endpointType, params?: unknown) {
  const path = endPoint
    .map((item: endpointName | number | string) => {
      if (typeof item === "number" || Boolean(Number(item))) return `/${item}`;
      return endpoints[item as endpointName] ?? item;
    })
    .join("");

  const query = params && typeof params === "object"
    ? extractSearchParams(params as Record<string, unknown>)
    : "";
  return `${path}${query ? (query.startsWith("?") ? query : `?${query}`) : ""}`;
}

export async function request<T = unknown>({
  endPoint,
  method = "GET",
  body,
  params,
  headers,
  isLocalized,
  redirectOnUnauthorized
}: {
  endPoint: endpointType;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  params?: unknown;
  headers?: Record<string, string>;
  isLocalized?: boolean;
  redirectOnUnauthorized?: boolean;
}) {
  if (!apiClient.defaults.baseURL) {
    throw new Error(
      `Missing VITE_API_URL. Set it in dashboard-react/.env.local (copy from .env.example).`
    );
  }

  const isFormData = body instanceof FormData;
  const config: DashboardAxiosRequestConfig = {
    url: buildEndpointUrl(endPoint, params),
    method,
    data: body,
    skipAuthRedirect: redirectOnUnauthorized === false,
    headers: {
      ...(isFormData ? { "Content-Type": undefined } : {}),
      isLocalized: isLocalized ? "true" : "false",
      ...headers
    }
  };

  const response = await apiClient.request<T>(config);

  return response.data;
}
