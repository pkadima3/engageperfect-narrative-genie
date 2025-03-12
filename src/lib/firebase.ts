
/**
 * Firebase Configuration
 * 
 * This file initializes Firebase services for authentication, Firestore database,
 * and Firebase Analytics. It exports initialized instances that can be used
 * throughout the application.
 * 
 * Interacts with:
 * - AuthContext (for user authentication)
 * - Firestore collections for user data
 * - Firebase Storage for user uploads
 */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAboJ3IB1MM3GkOBwC1RTjzgvAGo2ablTo",
  authDomain: "engperfecthlc.firebaseapp.com",
  projectId: "engperfecthlc",
  storageBucket: "engperfecthlc.appspot.com",
  messagingSenderId: "503333252583",
  appId: "1:503333252583:web:633b5ce3ba3619df572142",
  measurementId: "G-W98PHG26B4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics conditionally (only in browser environment)
export const initializeAnalytics = async () => {
  const analyticsSupported = await isSupported();
  if (analyticsSupported) {
    return getAnalytics(app);
  }
  return null;
};

export default app;
