/**
 * fortune-wheel-utils.spec.ts
 * Pure function tests extracted from FortuneWheelClient.tsx
 * These run in node environment with no DOM/React required.
 */

import { describe, it, expect } from "vitest";

// ─── Pure functions (copy from FortuneWheelClient.tsx) ───────────────────────

type LocalizedText = string | { ar?: string; en?: string } | null | undefined;
type RewardType = "DISCOUNT" | "FREE_DELIVERY" | "FIXED_AMOUNT" | "NONE" | "CUSTOM";

function getLocalizedText(value: LocalizedText, locale: string): string {
  if (!value) return "—";
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object") {
        return parsed[locale as "ar" | "en"] || parsed.ar || parsed.en || value;
      }
    } catch {
      // ignore
    }
    return value;
  }
  return value[locale as "ar" | "en"] || value.ar || value.en || "—";
}

function getNumberOrNull(value: string): number | null {
  if (value === "") return null;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

const fixedRewardValues: Partial<Record<RewardType, string>> = {
  FREE_DELIVERY: "Free",
  NONE: "Try again",
};

function validate(form: {
  displayNameAr: string;
  displayNameEn: string;
  rewardType: RewardType;
  rewardValue: string;
  minOrderAmount: string;
  maxOrderAmount: string;
}): string {
  if (!form.displayNameAr.trim() || !form.displayNameEn.trim()) return "fortuneNameRequired";
  if (form.rewardType === "DISCOUNT") {
    const value = Number(form.rewardValue);
    if (!value || value < 1 || value > 100) return "fortuneDiscountRequired";
  }
  if (form.rewardType === "FIXED_AMOUNT" && (!Number(form.rewardValue) || Number(form.rewardValue) <= 0)) {
    return "fortuneFixedAmountRequired";
  }
  const min = getNumberOrNull(form.minOrderAmount);
  const max = getNumberOrNull(form.maxOrderAmount);
  if (min !== null && max !== null && min > max) return "fortuneMinMaxInvalid";
  return "";
}

function buildPayload(form: {
  displayNameAr: string;
  displayNameEn: string;
  rewardType: RewardType;
  rewardValue: string;
  weight: string;
  maxDiscount: string;
  minOrderAmount: string;
  maxOrderAmount: string;
  rewardExpiryHours: string;
  storeId: string;
}) {
  return {
    displayName: JSON.stringify({ ar: form.displayNameAr, en: form.displayNameEn }),
    rewardType: form.rewardType,
    rewardValue: ["FREE_DELIVERY", "NONE"].includes(form.rewardType)
      ? null
      : getNumberOrNull(form.rewardValue),
    weight: getNumberOrNull(form.weight) ?? 1,
    maxDiscount: getNumberOrNull(form.maxDiscount),
    minOrderAmount: getNumberOrNull(form.minOrderAmount),
    maxOrderAmount: getNumberOrNull(form.maxOrderAmount),
    rewardExpiryHours: getNumberOrNull(form.rewardExpiryHours) ?? 24,
    storeId: form.storeId === "all" ? null : Number(form.storeId) || null,
    isActive: true,
    sortOrder: 0,
  };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("getLocalizedText()", () => {
  it("returns Arabic text for locale=ar", () => {
    expect(getLocalizedText({ ar: "خصم", en: "Discount" }, "ar")).toBe("خصم");
  });

  it("returns English text for locale=en", () => {
    expect(getLocalizedText({ ar: "خصم", en: "Discount" }, "en")).toBe("Discount");
  });

  it("falls back to ar when en is missing", () => {
    expect(getLocalizedText({ ar: "خصم" }, "en")).toBe("خصم");
  });

  it("parses JSON string", () => {
    expect(getLocalizedText(JSON.stringify({ ar: "مجاني", en: "Free" }), "ar")).toBe("مجاني");
  });

  it("returns plain string as-is", () => {
    expect(getLocalizedText("plain", "ar")).toBe("plain");
  });

  it("returns em dash for null", () => {
    expect(getLocalizedText(null, "ar")).toBe("—");
  });

  it("returns em dash for undefined", () => {
    expect(getLocalizedText(undefined, "ar")).toBe("—");
  });

  it("returns em dash for empty object", () => {
    expect(getLocalizedText({}, "ar")).toBe("—");
  });
});

describe("getNumberOrNull()", () => {
  it("returns null for empty string", () => {
    expect(getNumberOrNull("")).toBeNull();
  });

  it("returns number for valid string", () => {
    expect(getNumberOrNull("20")).toBe(20);
  });

  it("returns null for non-numeric string", () => {
    expect(getNumberOrNull("abc")).toBeNull();
  });

  it("returns 0 for '0'", () => {
    expect(getNumberOrNull("0")).toBe(0);
  });

  it("returns decimal for decimal string", () => {
    expect(getNumberOrNull("3.14")).toBeCloseTo(3.14);
  });
});

describe("validate() - fortune wheel form", () => {
  const baseForm = {
    displayNameAr: "خصم",
    displayNameEn: "Discount",
    rewardType: "DISCOUNT" as RewardType,
    rewardValue: "20",
    minOrderAmount: "",
    maxOrderAmount: "",
  };

  it("passes valid DISCOUNT form", () => {
    expect(validate(baseForm)).toBe("");
  });

  it("fails when Arabic name is empty", () => {
    expect(validate({ ...baseForm, displayNameAr: "" })).toBe("fortuneNameRequired");
  });

  it("fails when English name is empty", () => {
    expect(validate({ ...baseForm, displayNameEn: "" })).toBe("fortuneNameRequired");
  });

  it("fails when DISCOUNT value is 0", () => {
    expect(validate({ ...baseForm, rewardValue: "0" })).toBe("fortuneDiscountRequired");
  });

  it("fails when DISCOUNT value > 100", () => {
    expect(validate({ ...baseForm, rewardValue: "101" })).toBe("fortuneDiscountRequired");
  });

  it("passes DISCOUNT with value exactly 1", () => {
    expect(validate({ ...baseForm, rewardValue: "1" })).toBe("");
  });

  it("passes DISCOUNT with value exactly 100", () => {
    expect(validate({ ...baseForm, rewardValue: "100" })).toBe("");
  });

  it("fails when FIXED_AMOUNT value is 0", () => {
    expect(validate({ ...baseForm, rewardType: "FIXED_AMOUNT", rewardValue: "0" })).toBe("fortuneFixedAmountRequired");
  });

  it("passes when FIXED_AMOUNT value > 0", () => {
    expect(validate({ ...baseForm, rewardType: "FIXED_AMOUNT", rewardValue: "50" })).toBe("");
  });

  it("fails when minOrderAmount > maxOrderAmount", () => {
    expect(validate({ ...baseForm, minOrderAmount: "200", maxOrderAmount: "100" })).toBe("fortuneMinMaxInvalid");
  });

  it("passes when min <= max", () => {
    expect(validate({ ...baseForm, minOrderAmount: "50", maxOrderAmount: "200" })).toBe("");
  });

  it("passes FREE_DELIVERY with no value required", () => {
    expect(validate({ ...baseForm, rewardType: "FREE_DELIVERY", rewardValue: "" })).toBe("");
  });

  it("passes NONE with no value required", () => {
    expect(validate({ ...baseForm, rewardType: "NONE", rewardValue: "" })).toBe("");
  });
});

describe("buildPayload()", () => {
  const baseForm = {
    displayNameAr: "خصم",
    displayNameEn: "Discount",
    rewardType: "DISCOUNT" as RewardType,
    rewardValue: "20",
    weight: "5",
    maxDiscount: "30",
    minOrderAmount: "100",
    maxOrderAmount: "500",
    rewardExpiryHours: "48",
    storeId: "all",
  };

  it("serializes displayName as JSON with ar and en", () => {
    const payload = buildPayload(baseForm);
    expect(JSON.parse(payload.displayName as string)).toEqual({ ar: "خصم", en: "Discount" });
  });

  it("returns storeId=null when form storeId is 'all'", () => {
    const payload = buildPayload(baseForm);
    expect(payload.storeId).toBeNull();
  });

  it("returns storeId as number when specific store selected", () => {
    const payload = buildPayload({ ...baseForm, storeId: "7" });
    expect(payload.storeId).toBe(7);
  });

  it("sets rewardValue=null for FREE_DELIVERY", () => {
    const payload = buildPayload({ ...baseForm, rewardType: "FREE_DELIVERY", rewardValue: "" });
    expect(payload.rewardValue).toBeNull();
  });

  it("sets rewardValue=null for NONE", () => {
    const payload = buildPayload({ ...baseForm, rewardType: "NONE", rewardValue: "" });
    expect(payload.rewardValue).toBeNull();
  });

  it("sets rewardValue to number for DISCOUNT", () => {
    const payload = buildPayload(baseForm);
    expect(payload.rewardValue).toBe(20);
  });

  it("sets maxDiscount from string", () => {
    const payload = buildPayload(baseForm);
    expect(payload.maxDiscount).toBe(30);
  });

  it("sets maxDiscount=null when empty", () => {
    const payload = buildPayload({ ...baseForm, maxDiscount: "" });
    expect(payload.maxDiscount).toBeNull();
  });

  it("defaults rewardExpiryHours to 24 when empty", () => {
    const payload = buildPayload({ ...baseForm, rewardExpiryHours: "" });
    expect(payload.rewardExpiryHours).toBe(24);
  });

  it("defaults weight to 1 when empty", () => {
    const payload = buildPayload({ ...baseForm, weight: "" });
    expect(payload.weight).toBe(1);
  });
});
