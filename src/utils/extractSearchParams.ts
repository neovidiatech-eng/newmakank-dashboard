export function cleanQueryParams<T extends Record<string, unknown>>(params?: T): Record<string, unknown> {
  if (!params || typeof params !== "object") return {};
  const cleaned: Record<string, unknown> = {};

  for (const key of Object.keys(params)) {
    const value = params[key];
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== "undefined" &&
      value !== "null"
    ) {
      if (Array.isArray(value)) {
        const cleanedArr = value.filter(
          val =>
            val !== undefined &&
            val !== null &&
            val !== "" &&
            val !== "undefined" &&
            val !== "null"
        );
        if (cleanedArr.length > 0) {
          cleaned[key] = cleanedArr;
        }
      } else {
        cleaned[key] = value;
      }
    }
  }

  return cleaned;
}

export function objectToQueryString(params?: { [key: string]: unknown | unknown[] }): string {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  const cleaned = cleanQueryParams(params as Record<string, unknown>);

  for (const key in cleaned) {
    if (Object.prototype.hasOwnProperty.call(cleaned, key)) {
      const value = cleaned[key];
      if (Array.isArray(value)) {
        value.forEach(val => {
          searchParams.append(key, String(val));
        });
      } else {
        searchParams.append(key, String(value));
      }
    }
  }

  return searchParams.toString();
}

export function extractSearchParams(params?: { [key: string]: unknown | unknown[] }): string {
  return objectToQueryString(params);
}
