type AppEnvKey =
  | "VITE_API_URL"
  | "VITE_API_IMG_URL"
  | "VITE_GOOGLE_MAP_API_KEY"
  | "VITE_FIREBASE_API_KEY"
  | "VITE_FIREBASE_AUTH_DOMAIN"
  | "VITE_FIREBASE_PROJECT_ID"
  | "VITE_FIREBASE_STORAGE_BUCKET"
  | "VITE_FIREBASE_MESSAGING_SENDER_ID"
  | "VITE_FIREBASE_APP_ID"
  | "VITE_FIREBASE_VAPID_KEY";

export function getEnv(name: AppEnvKey, fallback = ""): string {
  return import.meta.env[name] || fallback;
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
