export type LocalizedText = string | { ar?: string; en?: string } | null | undefined;

export type DriverLevel = {
  id: number;
  name: LocalizedText;
  minPoints: number;
  rewardAmount: number;
  color?: string | null;
};

export type DriverPointsSettings = {
  enabled: boolean;
  perOrder: number;
  goodRating: number;
  badRating: number;
  fastMinutes: number;
  fast: number;
  lateMinutes: number;
  late: number;
  reject: number;
  timeout: number;
};

export type LeaderboardRow = {
  rank: number;
  deliveryId: number;
  name: string;
  image?: string | null;
  phone?: string | null;
  rating: number;
  points: number;
  totalPoints: number;
  level: DriverLevel | null;
};

export type DriverPointsType =
  | "ORDER_DELIVERED"
  | "FAST_DELIVERY"
  | "LATE_DELIVERY"
  | "GOOD_RATING"
  | "BAD_RATING"
  | "ASSIGNMENT_REJECTED"
  | "ASSIGNMENT_TIMEOUT"
  | "ORDER_REVERSED"
  | "ADMIN_ADJUST";

export function localized(value: LocalizedText, locale: string): string {
  if (!value) return "—";
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object") return parsed[locale] || parsed.ar || parsed.en || value;
    } catch {
      // plain string
    }
    return value;
  }
  return (value as any)[locale] || value.ar || value.en || "—";
}

export function extractList<T>(response: any): T[] {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
}

export function extractTotal(response: any): number {
  return Number(response?.total ?? response?.meta?.total ?? response?.data?.total ?? 0) || 0;
}

export function formatDate(value: string, locale: string) {
  try {
    return new Date(value).toLocaleString(locale === "ar" ? "ar-EG" : "en-GB", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return value;
  }
}
