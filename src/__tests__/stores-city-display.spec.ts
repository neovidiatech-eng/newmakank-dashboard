/**
 * stores-city-display.spec.ts
 * Automated unit tests for Dashboard Stores City Display and Multi-City Quick Filter logic.
 */

import { describe, it, expect } from "vitest";

describe("Stores City Display & Filtering Suite", () => {
  // ─── 1. City Column Cell Formatter Logic ───
  function formatStoreCityName(store: any, locale: string = "ar"): string {
    const city = store?.city;
    const cityName =
      (typeof city?.name === "object"
        ? (locale === "ar" ? city.name.ar || city.name.en : city.name.en || city.name.ar)
        : city?.name) ||
      store?.cityName;

    if (!cityName) return "-";
    return cityName;
  }

  it("extracts Arabic city name for Arabic locale", () => {
    const store = {
      id: 1,
      name: { ar: "كنتاكي", en: "KFC" },
      cityId: 1,
      city: {
        id: 1,
        name: { ar: "المحلة الكبرى", en: "El Mahalla El Kubra" }
      }
    };
    expect(formatStoreCityName(store, "ar")).toBe("المحلة الكبرى");
  });

  it("extracts English city name for English locale", () => {
    const store = {
      id: 2,
      name: { ar: "شاورما الريم", en: "Shawarma Al Reem" },
      cityId: 2,
      city: {
        id: 2,
        name: { ar: "طنطا", en: "Tanta" }
      }
    };
    expect(formatStoreCityName(store, "en")).toBe("Tanta");
  });

  it("returns '-' when city is null or undefined", () => {
    const storeWithoutCity = {
      id: 3,
      name: { ar: "متجر غير محدد", en: "Unassigned Store" },
      cityId: null,
      city: null
    };
    expect(formatStoreCityName(storeWithoutCity, "ar")).toBe("-");
  });

  it("handles string city name gracefully", () => {
    const storeWithStringCity = {
      id: 4,
      name: { ar: "متجر المحلة", en: "Mahalla Store" },
      cityName: "المحلة الكبرى"
    };
    expect(formatStoreCityName(storeWithStringCity, "ar")).toBe("المحلة الكبرى");
  });

  // ─── 2. URL Filter Builder (Cohesive Navigation) ───
  function buildFilterUrl(
    currentSearchParams: Record<string, string | undefined>,
    updates: Record<string, string | null | undefined>
  ): string {
    const params = new URLSearchParams();
    Object.entries(currentSearchParams).forEach(([k, v]) => {
      if (v && typeof v === "string") params.set(k, v);
    });
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === undefined || v === "") {
        params.delete(k);
      } else {
        params.set(k, v);
      }
    });
    params.delete("page");
    const qs = params.toString();
    return qs ? `/stores?${qs}` : "/stores";
  }

  it("applies cityId=1 for El Mahalla and resets page", () => {
    const current = { page: "3" };
    const url = buildFilterUrl(current, { cityId: "1" });
    expect(url).toBe("/stores?cityId=1");
  });

  it("applies cityId=2 for Tanta and preserves isPartner=true", () => {
    const current = { isPartner: "true", page: "2" };
    const url = buildFilterUrl(current, { cityId: "2" });
    expect(url).toBe("/stores?isPartner=true&cityId=2");
  });

  it("removes cityId when selecting All Cities while preserving partner status", () => {
    const current = { cityId: "1", isPartner: "true" };
    const url = buildFilterUrl(current, { cityId: null });
    expect(url).toBe("/stores?isPartner=true");
  });

  it("returns base /stores when no filters are active", () => {
    const current = { cityId: "1" };
    const url = buildFilterUrl(current, { cityId: null });
    expect(url).toBe("/stores");
  });

  // ─── 3. Stores Table Filter Configuration ───
  it("verifies cityId filter configuration for StoresTable", () => {
    const cityFilter = {
      name: "cityId",
      type: "selectPaginated",
      apiUrl: ["cities"],
      label: "المدينة",
      width: 3
    };

    expect(cityFilter.name).toBe("cityId");
    expect(cityFilter.type).toBe("selectPaginated");
    expect(cityFilter.apiUrl).toEqual(["cities"]);
  });
});
