import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getMessaging, getToken, onMessage, type Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);
const app: FirebaseApp | null = hasFirebaseConfig ? getApps()[0] ?? initializeApp(firebaseConfig) : null;
let messaging: Messaging | null = null;

if (app && typeof window !== "undefined" && "Notification" in window) {
  try {
    messaging = getMessaging(app);
  } catch {
    messaging = null;
  }
}

export { getToken, messaging, onMessage };
