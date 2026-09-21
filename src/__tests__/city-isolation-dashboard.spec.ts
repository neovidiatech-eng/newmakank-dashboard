/**
 * city-isolation-dashboard.spec.ts
 * Automated tests for Multi-City Isolation, City Store & Selector logic in Dashboard.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { useCityStore } from "../store/cityStore";

// ─── Pure functions & helpers used across Dashboard ──────────────────────────

export function validateCityId(value: any): number | null {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0 || !Number.isInteger(num)) return null;
  return num;
}

export function buildCityQueryParams<T extends Record<string, any>>(
  selectedCityId: number | null | undefined,
  baseParams: T = {} as T,
): T & { cityId?: number } {
  const validCityId = validateCityId(selectedCityId);
  if (validCityId !== null) {
    return { ...baseParams, cityId: validCityId };
  }
  const clean = { ...baseParams };
  delete (clean as any).cityId;
  return clean as T;
}

export function getCityLocalizedName(
  city: any,
  locale: "ar" | "en" = "ar",
): string {
  if (!city) return "—";
  if (typeof city === "string") return city.trim() || "—";
  if (typeof city.name === "string") return city.name.trim() || "—";
  if (typeof city.name === "object" && city.name) {
    return (
      (locale === "ar" ? city.name.ar : city.name.en) ||
      city.name.ar ||
      city.name.en ||
      "—"
    );
  }
  if (city.id) return String(city.id);
  return "—";
}

export function validateZoneCityPayload(payload: {
  nameAr: string;
  nameEn: string;
  cityId?: any;
}): { isValid: boolean; error?: string } {
  if (!payload.nameAr?.trim() || !payload.nameEn?.trim()) {
    return { isValid: false, error: "Zone name is required in Arabic and English" };
  }
  const validCityId = validateCityId(payload.cityId);
  if (!validCityId) {
    return { isValid: false, error: "Valid city selection is required for zone isolation" };
  }
  return { isValid: true };
}

export interface DashboardStoreItem {
  id: number;
  name: string;
  cityId: number | null;
}

export function filterStoresByCity(
  stores: DashboardStoreItem[],
  selectedCityId: number | null | undefined,
): DashboardStoreItem[] {
  const validCityId = validateCityId(selectedCityId);
  if (validCityId === null) {
    // "All Cities" mode in dashboard
    return stores;
  }
  return stores.filter((store) => store.cityId === validCityId);
}

// ─── Vitest Test Suite ────────────────────────────────────────────────────────

describe("Dashboard Multi-City Isolation & Validation Suite", () => {
  beforeEach(() => {
    useCityStore.getState().clearCity();
  });

  describe("1. City Store (Zustand state management)", () => {
    it("initializes with selectedCityId and selectedCityName as null", () => {
      const state = useCityStore.getState();
      expect(state.selectedCityId).toBeNull();
      expect(state.selectedCityName).toBeNull();
    });

    it("setCity updates selectedCityId and selectedCityName properly", () => {
      useCityStore.getState().setCity(5, "طنطا");
      const state = useCityStore.getState();
      expect(state.selectedCityId).toBe(5);
      expect(state.selectedCityName).toBe("طنطا");
    });

    it("clearCity resets both selectedCityId and selectedCityName back to null", () => {
      useCityStore.getState().setCity(10, "المحلة الكبرى");
      expect(useCityStore.getState().selectedCityId).toBe(10);

      useCityStore.getState().clearCity();
      expect(useCityStore.getState().selectedCityId).toBeNull();
      expect(useCityStore.getState().selectedCityName).toBeNull();
    });
  });

  describe("2. validateCityId Input Sanitation", () => {
    it("accepts valid positive integer numbers and strings", () => {
      expect(validateCityId(1)).toBe(1);
      expect(validateCityId(42)).toBe(42);
      expect(validateCityId("5")).toBe(5);
    });

    it("rejects non-positive numbers (0, negative)", () => {
      expect(validateCityId(0)).toBeNull();
      expect(validateCityId(-1)).toBeNull();
      expect(validateCityId("-10")).toBeNull();
    });

    it("rejects invalid, NaN, empty or non-numeric types", () => {
      expect(validateCityId(null)).toBeNull();
      expect(validateCityId(undefined)).toBeNull();
      expect(validateCityId("")).toBeNull();
      expect(validateCityId("abc")).toBeNull();
      expect(validateCityId(NaN)).toBeNull();
      expect(validateCityId(1.5)).toBeNull(); // cityId must be integer
    });
  });

  describe("3. buildCityQueryParams Request Isolation", () => {
    it("appends cityId when a valid city is selected in dashboard", () => {
      const params = buildCityQueryParams(3, { page: 1, limit: 10 });
      expect(params).toEqual({ page: 1, limit: 10, cityId: 3 });
    });

    it("does NOT append cityId or null/undefined when All Cities is selected", () => {
      const params = buildCityQueryParams(null, { page: 1, limit: 10 });
      expect(params).toEqual({ page: 1, limit: 10 });
      expect(params).not.toHaveProperty("cityId");
    });

    it("safely ignores invalid cityId values without corrupting existing query params", () => {
      const params = buildCityQueryParams(-5 as any, { isVerified: true });
      expect(params).toEqual({ isVerified: true });
      expect(params).not.toHaveProperty("cityId");
    });
  });

  describe("4. getCityLocalizedName", () => {
    it("extracts Arabic name when locale is 'ar'", () => {
      const city = { id: 1, name: { ar: "دمنهور", en: "Damanhur" } };
      expect(getCityLocalizedName(city, "ar")).toBe("دمنهور");
    });

    it("extracts English name when locale is 'en'", () => {
      const city = { id: 1, name: { ar: "دمنهور", en: "Damanhur" } };
      expect(getCityLocalizedName(city, "en")).toBe("Damanhur");
    });

    it("falls back gracefully when translation object or name is partial", () => {
      const cityArOnly = { id: 2, name: { ar: "المنصورة" } };
      expect(getCityLocalizedName(cityArOnly, "en")).toBe("المنصورة");

      const cityString = { id: 3, name: "الإسكندرية" };
      expect(getCityLocalizedName(cityString, "ar")).toBe("الإسكندرية");
    });

    it("returns placeholder em dash when city is null or empty", () => {
      expect(getCityLocalizedName(null)).toBe("—");
      expect(getCityLocalizedName(undefined)).toBe("—");
      expect(getCityLocalizedName({ name: "" })).toBe("—");
    });
  });

  describe("5. Zone Creation City Validation", () => {
    it("validates zone with proper cityId", () => {
      const result = validateZoneCityPayload({
        nameAr: "حي النصر",
        nameEn: "El Nasr District",
        cityId: 2,
      });
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("rejects zone without valid cityId to prevent orphan/cross-city zone leaks", () => {
      const result = validateZoneCityPayload({
        nameAr: "حي النصر",
        nameEn: "El Nasr District",
        cityId: null,
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Valid city selection is required");
    });
  });

  describe("6. filterStoresByCity (Dashboard Catalog Isolation)", () => {
    const mockStores: DashboardStoreItem[] = [
      { id: 101, name: "مطعم البرنس", cityId: 1 },
      { id: 102, name: "بيك اسطنبول", cityId: 2 },
      { id: 103, name: "أبو شقرة", cityId: 1 },
      { id: 104, name: "كنتاكي طنطا", cityId: 2 },
      { id: 105, name: "متجر غير محدد", cityId: null },
    ];

    it("returns only stores belonging to City 1 when City 1 is selected", () => {
      const filtered = filterStoresByCity(mockStores, 1);
      expect(filtered).toHaveLength(2);
      expect(filtered.map((s) => s.id)).toEqual([101, 103]);
      expect(filtered.every((s) => s.cityId === 1)).toBe(true);
    });

    it("returns only stores belonging to City 2 when City 2 is selected", () => {
      const filtered = filterStoresByCity(mockStores, 2);
      expect(filtered).toHaveLength(2);
      expect(filtered.map((s) => s.id)).toEqual([102, 104]);
      expect(filtered.every((s) => s.cityId === 2)).toBe(true);
    });

    it("returns all stores when 'All Cities' (null/undefined) is selected", () => {
      const filtered = filterStoresByCity(mockStores, null);
      expect(filtered).toHaveLength(5);
    });
  });
});
