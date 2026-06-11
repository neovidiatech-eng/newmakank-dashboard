export function objectToQueryString(params?: { [key: string]: unknown | unknown[] }): string {
  if (!params) return "";
  const searchParams = new URLSearchParams();

  // Loop through the object and append each key-value pair
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const value = params[key];
      if (Array.isArray(value)) {
        value.forEach(val => {
          searchParams.append(key, String(val));
        });
      } else {
        searchParams.append(key, String(value));
      }
    }
  }

  // Convert to string and return
  return searchParams.toString();
}

export function extractSearchParams(params?: { [key: string]: unknown | unknown[] }): string {
  return objectToQueryString(params);
}
