import { REFRESH_TOKEN, TOKEN } from "@/utils/config";

export async function setRefreshToken(refreshToken: string) {
  localStorage.setItem(REFRESH_TOKEN, refreshToken);
}

export async function removeToken() {
  localStorage.removeItem(TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
}

export async function setToken(token: string) {
  localStorage.setItem(TOKEN, token);
}

export async function getToken() {
  return localStorage.getItem(TOKEN);
}
