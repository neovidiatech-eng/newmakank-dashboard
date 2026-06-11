import { getEnv, joinUrl } from "@/lib/env";

const baseUrl = getEnv("VITE_API_IMG_URL");

export default function handleImgUrl(url: string): string {
  return joinUrl(baseUrl, url);
}
