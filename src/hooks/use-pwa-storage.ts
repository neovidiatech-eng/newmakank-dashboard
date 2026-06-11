import { pwaStorage } from "@/lib/pwa-storage";
import { useEffect, useState } from "react";

export function usePWAStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load initial value
    const storedValue = pwaStorage.restoreData<T>(key, defaultValue);
    if (storedValue !== null) {
      setValue(storedValue);
    }
    setIsLoaded(true);
  }, [key, defaultValue]);

  const setStoredValue = (newValue: T | ((prev: T) => T)) => {
    setValue(prev => {
      const actualValue =
        typeof newValue === "function" ? (newValue as (prev: T) => T)(prev) : newValue;

      // Save to both localStorage and cookie backup
      pwaStorage.backupData(key, actualValue);
      return actualValue;
    });
  };

  return [value, setStoredValue, isLoaded] as const;
}

export function usePWACookie(name: string, defaultValue: string = "", days: number = 365) {
  const [value, setValue] = useState<string>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const cookieValue = pwaStorage.getCookie(name);
    if (cookieValue !== null) {
      setValue(cookieValue);
    }
    setIsLoaded(true);
  }, [name]);

  const setCookieValue = (newValue: string) => {
    setValue(newValue);
    pwaStorage.setCookie(name, newValue, days);
  };

  return [value, setCookieValue, isLoaded] as const;
}
