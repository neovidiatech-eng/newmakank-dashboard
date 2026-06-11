import { getFCMToken, requestNotificationPermission } from "@/utils/firebase/firebaseMessaging";
import { useCallback, useEffect, useState } from "react";

export function useFcmToken() {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const getLoginFcmToken = useCallback(async (): Promise<string | null> => {
    if (typeof window === "undefined") {
      return null;
    }

    if (!("Notification" in window)) {
      return null;
    }

    const currentPermission = Notification.permission;
    setNotificationPermission(currentPermission);

    if (currentPermission === "granted") {
      return getFCMToken();
    }

    if (currentPermission === "default") {
      return requestNotificationPermission();
    }

    return null;
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);

    if (permission === "granted") {
      // Optionally, you can get the token here if needed
    }
  }, []);

  return {
    getLoginFcmToken,
    notificationPermission,
    requestPermission
  };
}
