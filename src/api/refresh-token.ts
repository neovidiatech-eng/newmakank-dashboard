import { apiClient } from "@/lib/axios";
import { REFRESH_TOKEN, TOKEN } from "@/utils/config";
import { endpoints } from "@/utils/endpoints";

export async function newRefreshToken() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN);
  const response = await apiClient.post(
    endpoints.refreshToken,
    undefined,
    {
      headers: {
        Authorization: refreshToken ? `Bearer ${refreshToken}` : undefined,
        Locale: localStorage.getItem("locale") || "ar",
        isLocalized: "true"
      }
    }
  );

  const result = response.data;
  const accessToken = result?.data?.user?.AccessToken || result?.data?.AccessToken;

  if (accessToken) {
    localStorage.setItem(TOKEN, accessToken);
  }

  return {
    ...result,
    success: response.status >= 200 && response.status < 300,
    status: response.status,
    accessToken
  };
}
