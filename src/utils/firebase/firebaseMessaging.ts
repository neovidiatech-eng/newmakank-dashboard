import { getToken, MessagePayload, onMessage } from "firebase/messaging";
import { messaging } from "./firebaseConfig";

// Request notification permission and get FCM token
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
      return null;
    }

    // Request permission from the user
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      // Get token
      return await getFCMToken();
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

// Get FCM token
export const getFCMToken = async (): Promise<string | null> => {
  try {
    // Check if messaging is supported in this environment
    if (!messaging) {
      return null;
    }

    // Get token
    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
    });
    if (currentToken) {
      return currentToken;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

// Handle messaging - this now returns the unsubscribe function
export const onMessageListener = ({
  messagingPayload
}: {
  messagingPayload: (payload: MessagePayload) => void;
}) => {
  if (!messaging) {
    return {
      then: () => ({ catch: () => {} })
    };
  }

  return onMessage(messaging, payload => {
    messagingPayload(payload);
  });
};

// Display a notification
export const displayNotification = (title: string, body: string, icon: string = "/logo.png") => {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon
    });
  }
};
