/**
 * Pure utility functions for Delivery Promotions logic.
 * Extracted here so they can be imported by Vitest without requiring
 * any React / browser / shadcn dependencies.
 */

export type PromoScope = "GLOBAL" | "STORE" | "ZONE" | "STORE_ZONE";
export type DiscountType = "FIXED_PRICE" | "DISCOUNT_AMOUNT";

export interface DeliveryPromotion {
  id: number;
  name: string;
  badgeText: string | null;
  scope: PromoScope;
  discountType: DiscountType;
  promoValue: number;
  storeId?: number | null;
  zoneId?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  isActive: boolean;
}

/** Default Arabic badge text used when badgeText is null/empty. */
export const DEFAULT_BADGE_TEXT = "توصيل مخفض لفترة محدودة";

/**
 * Resolve the badge text, falling back to the Arabic default when the stored
 * value is null, undefined, or an empty string.
 */
export function resolveBadgeText(badgeText: string | null | undefined): string {
  return badgeText && badgeText.trim().length > 0
    ? badgeText.trim()
    : DEFAULT_BADGE_TEXT;
}

/**
 * Apply a delivery promotion to a base delivery price.
 *
 * - FIXED_PRICE  → the promoValue IS the new delivery price (floor at 0)
 * - DISCOUNT_AMOUNT → subtract promoValue from base (floor at 0)
 * - null promo   → return base unchanged
 */
export function applyPromotion(
  basePrice: number,
  promo: Pick<DeliveryPromotion, "discountType" | "promoValue"> | null
): number {
  if (!promo) return basePrice;
  if (promo.discountType === "FIXED_PRICE") {
    return Math.max(0, promo.promoValue);
  }
  // DISCOUNT_AMOUNT
  return Math.max(0, basePrice - promo.promoValue);
}

/**
 * Resolve the scope priority for a given order context.
 * Higher-specificity scope wins.  Returns null if no promo matches.
 *
 * Priority: STORE_ZONE > STORE > ZONE > GLOBAL
 */
export function resolveScopePriority(
  promos: DeliveryPromotion[],
  context: { storeId?: number; zoneId?: number }
): DeliveryPromotion | null {
  const active = promos.filter((p) => p.isActive);

  const storeZone = active.find(
    (p) =>
      p.scope === "STORE_ZONE" &&
      p.storeId === context.storeId &&
      p.zoneId === context.zoneId
  );
  if (storeZone) return storeZone;

  const store = active.find(
    (p) => p.scope === "STORE" && p.storeId === context.storeId
  );
  if (store) return store;

  const zone = active.find(
    (p) => p.scope === "ZONE" && p.zoneId === context.zoneId
  );
  if (zone) return zone;

  return active.find((p) => p.scope === "GLOBAL") ?? null;
}

/** Badge CSS classes per scope (exported for component use). */
export const SCOPE_BADGE_CLASS: Record<PromoScope, string> = {
  GLOBAL: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  STORE: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  ZONE: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200",
  STORE_ZONE: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200",
};

/** Human-readable Arabic scope labels (backward-compat). */
export const SCOPE_LABEL: Record<PromoScope, string> = {
  GLOBAL: "عام",
  STORE: "متجر",
  ZONE: "منطقة",
  STORE_ZONE: "متجر + منطقة",
};

/** Get localized scope label depending on language / t function */
export function getScopeLabel(
  scope: PromoScope,
  locale?: string,
  t?: (key: string) => string
): string {
  if (t) {
    const map: Record<PromoScope, string> = {
      GLOBAL: t("promoScopeGlobal"),
      STORE: t("promoScopeStore"),
      ZONE: t("promoScopeZone"),
      STORE_ZONE: t("promoScopeStoreZone"),
    };
    if (map[scope] && map[scope] !== `promoScope${scope}`) return map[scope];
  }

  if (locale === "en") {
    const enMap: Record<PromoScope, string> = {
      GLOBAL: "Global",
      STORE: "Store",
      ZONE: "Zone",
      STORE_ZONE: "Store + Zone",
    };
    return enMap[scope];
  }

  return SCOPE_LABEL[scope] || scope;
}
