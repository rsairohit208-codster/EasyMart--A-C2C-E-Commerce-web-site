import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Google Firebase configuration block provided for live Firestore Cloud Database
export const firebaseConfig = {
  apiKey: "AIzaSyDVXb2e3HMivOXv_mMgtkPRMWQDKpsp4Ug",
  authDomain: "easymart-8a580.firebaseapp.com",
  projectId: "easymart-8a580",
  storageBucket: "easymart-8a580.firebasestorage.app",
  messagingSenderId: "972599422130",
  appId: "1:972599422130:web:5d9e9498801799e479edab",
  measurementId: "G-FVMZZKLFJB"
};

// Initialize Firebase App singleton safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Cloud Firestore database instance
export const db = getFirestore(app);

export default app;
