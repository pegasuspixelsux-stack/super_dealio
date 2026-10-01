import { getApp, getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const env = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** True once the NEXT_PUBLIC_FIREBASE_* variables are present. */
export const isFirebaseConfigured = Boolean(env.apiKey && env.projectId && env.appId);

// Placeholders keep the SDK from throwing at import time (build, prerender)
// when the environment is not configured yet. Gate network use on
// `isFirebaseConfigured`.
const firebaseConfig: FirebaseOptions = {
  apiKey: env.apiKey ?? "missing-api-key",
  authDomain: env.authDomain,
  projectId: env.projectId ?? "missing-project-id",
  storageBucket: env.storageBucket,
  messagingSenderId: env.messagingSenderId,
  appId: env.appId ?? "missing-app-id",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
