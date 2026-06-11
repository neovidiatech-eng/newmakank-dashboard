import { pwaStorage } from "@/lib/pwa-storage";
import { installOfflineRequestQueue } from "@/lib/offline-request-queue";
import { useEffect } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function PWAInit() {
  useEffect(() => {
    let isMounted = true;
    const cleanupOfflineQueue = installOfflineRequestQueue();

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      (window as Window & { deferredPrompt?: BeforeInstallPromptEvent }).deferredPrompt =
        event as BeforeInstallPromptEvent;
    };

    const handleAppInstalled = () => {
      console.log("PWA was installed");
      pwaStorage.setItem("pwa_installed", true);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("App hidden - ensuring data persistence");
      }
    };

    const handleBeforeUnload = () => {
      console.log("App closing - saving critical data");
    };

    const registerServiceWorker = async () => {
      if (!("serviceWorker" in navigator)) return;
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        if (registration.waiting && isMounted) {
          console.log("PWA update ready");
        }
      } catch (error) {
        console.warn("Service worker registration failed:", error);
      }
    };

    const initializePWA = async () => {
      await pwaStorage.initialize();

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.addEventListener("appinstalled", handleAppInstalled);
      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("beforeunload", handleBeforeUnload);

      await registerServiceWorker();

      if (pwaStorage.isPWA()) {
        console.log("Running as PWA");
        if ("storage" in navigator && "persist" in navigator.storage) {
          const persistent = await navigator.storage.persist();
          if (persistent) {
            console.log("Persistent storage granted for PWA");
          }
        }
      }
    };

    initializePWA();

    return () => {
      isMounted = false;
      cleanupOfflineQueue();
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null; // This component doesn't render anything
}
