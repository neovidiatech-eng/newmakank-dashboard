// Storage persistence utility for PWA
export class PWAStorage {
  private static instance: PWAStorage;
  private isInitialized = false;

  static getInstance(): PWAStorage {
    if (!PWAStorage.instance) {
      PWAStorage.instance = new PWAStorage();
    }
    return PWAStorage.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Request persistent storage
      if ("storage" in navigator && "persist" in navigator.storage) {
        const persistent = await navigator.storage.persist();
        console.log("Persistent storage granted:", persistent);
      }

      // Estimate storage quota
      if ("storage" in navigator && "estimate" in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        console.log("Storage estimate:", estimate);
      }

      this.isInitialized = true;
    } catch (error) {
      console.warn("Storage initialization failed:", error);
    }
  }

  // Enhanced localStorage with error handling
  setItem(key: string, value: unknown): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
      return false;
    }
  }

  getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error("Failed to read from localStorage:", error);
      return defaultValue || null;
    }
  }

  removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Failed to remove from localStorage:", error);
      return false;
    }
  }

  // Enhanced cookie handling for PWA
  setCookie(name: string, value: string, days: number = 365): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict;Secure=${location.protocol === "https:"}`;
  }

  getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  deleteCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
  }

  // Check if running as PWA
  isPWA(): boolean {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ||
      document.referrer.includes("android-app://")
    );
  }

  // Backup data to multiple storage methods
  backupData(key: string, data: unknown): void {
    this.setItem(key, data);
    this.setCookie(`backup_${key}`, JSON.stringify(data), 365);
  }

  // Restore data with fallback
  restoreData<T>(key: string, defaultValue?: T): T | null {
    let data = this.getItem<T>(key);
    if (!data) {
      const cookieData = this.getCookie(`backup_${key}`);
      if (cookieData) {
        try {
          data = JSON.parse(cookieData);
          // Restore to localStorage
          this.setItem(key, data);
        } catch (error) {
          console.warn("Failed to parse cookie backup:", error);
        }
      }
    }
    return data || defaultValue || null;
  }
}

// Export singleton instance
export const pwaStorage = PWAStorage.getInstance();
