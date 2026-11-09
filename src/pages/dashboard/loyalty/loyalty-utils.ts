export type LocalizedText = string | { ar?: string; en?: string } | null | undefined;

export type LoyaltyRewardType = "WALLET_CREDIT" | "DISCOUNT" | "FREE_DELIVERY" | "FREE_PRODUCT";
export type LoyaltyDiscountType = "PERCENT" | "FIXED";
export type LoyaltyTransactionType =
  | "EARN_ORDER"
  | "EARN_BONUS"
  | "REVERSE_ORDER"
  | "REVERSE_BONUS"
  | "REDEEM"
  | "ADMIN_ADJUST";

export type LoyaltySettings = {
  enabled: boolean;
  pointsPerOrder: number;
  bonusEveryOrders: number;
  bonusPoints: number;
};

export type LoyaltyReward = {
  id: number;
  name: LocalizedText;
  description?: LocalizedText;
  type: LoyaltyRewardType;
  pointsCost: number;
  value?: number | null;
  discountType?: LoyaltyDiscountType | null;
  maxDiscount?: number | null;
  minOrderAmount?: number | null;
  storeId?: number | null;
  validityDays?: number | null;
  isActive: boolean;
  sortOrder?: number;
  serviceId?: number | null;
  Store?: { id: number; name: LocalizedText } | null;
  Service?: { id: number; name: LocalizedText } | null;
};

export type LoyaltyTransaction = {
  id: number;
  userId: number;
  points: number;
  balanceAfter: number;
  type: LoyaltyTransactionType;
  orderId?: number | null;
  walletAmount?: number | null;
  note?: string | null;
  createdAt: string;
  User?: { id: number; name?: string; phone?: string } | null;
  Reward?: { id: number; name: LocalizedText; type: LoyaltyRewardType } | null;
};

export const rewardTypes: LoyaltyRewardType[] = ["WALLET_CREDIT", "DISCOUNT", "FREE_DELIVERY", "FREE_PRODUCT"];

export const transactionTypes: LoyaltyTransactionType[] = [
  "EARN_ORDER",
  "EARN_BONUS",
  "REDEEM",
  "ADMIN_ADJUST",
  "REVERSE_ORDER",
  "REVERSE_BONUS"
];

export function localized(value: LocalizedText, locale: string): string {
  if (!value) return "—";
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object") {
        return parsed[locale] || parsed.ar || parsed.en || value;
      }
    } catch {
      // plain string
    }
    return value;
  }
  return (value as any)[locale] || value.ar || value.en || "—";
}

// API lists come back either as `data: [...]` or `data: { data: [...] }`.
export function extractList<T>(response: any): T[] {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
}

export function extractTotal(response: any): number {
  return Number(response?.total ?? response?.meta?.total ?? response?.data?.total ?? 0) || 0;
}

export function numberOrNull(value: string): number | null {
  if (value === "" || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function formatDate(value: string, locale: string) {
  try {
    return new Date(value).toLocaleString(locale === "ar" ? "ar-EG" : "en-GB", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  } catch {
    return value;
  }
}
