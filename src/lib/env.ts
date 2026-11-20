type AppEnvKey =
  | "VITE_API_URL"
  | "VITE_API_IMG_URL"
  | "VITE_GOOGLE_MAP_API_KEY";

const DEFAULT_ENV_MAP: Partial<Record<AppEnvKey, string>> = {
  VITE_API_URL: "https://api.makanak-app.com",
  VITE_API_IMG_URL: "https://api.makanak-app.com/api/media?media="
};

export function getEnv(name: AppEnvKey, fallback = ""): string {
  let val = import.meta.env[name] || DEFAULT_ENV_MAP[name] || fallback;
  if (name === "VITE_API_URL") {
    if (!val || typeof val !== "string" || !val.startsWith("http")) {
      return DEFAULT_ENV_MAP.VITE_API_URL || "https://api.makanak-app.com";
    }
  }
  if (name === "VITE_API_IMG_URL") {
    if (!val || typeof val !== "string" || !val.startsWith("http")) {
      return DEFAULT_ENV_MAP.VITE_API_IMG_URL || "https://api.makanak-app.com/api/media?media=";
    }
  }
  return val;
}

export function requireEnv(name: AppEnvKey): string {
  const value = getEnv(name);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function joinUrl(base: string, path: string): string {
  if (!base) return path;
  if (!path) return base;

  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}
