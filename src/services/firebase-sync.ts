// Mock Firebase Config
// In a real app, you would replace these with values from your Firebase Console
export const firebaseConfig = {
  apiKey: "AIzaSyD-mock-api-key",
  authDomain: "apolo-sports.firebaseapp.com",
  projectId: "apolo-sports",
  storageBucket: "apolo-sports.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, update } from "firebase/database";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Data Sync Service
export const SyncService = {
  // Sync User Data
  syncUserData: (userId: string, data: any) => {
    // In Zalo Mini App, we might need to be careful with PII
    // But for app-specific data like points, package status, etc:
    const userRef = ref(db, 'users/' + userId);
    set(userRef, {
      ...data,
      lastSync: Date.now()
    }).catch(err => console.error("Sync failed", err));
  },

  // Listen for Admin Updates (e.g., package changes, notifications)
  subscribeToUpdates: (callback: (data: any) => void) => {
    const globalRef = ref(db, 'global_updates');
    onValue(globalRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        callback(data);
      }
    });
  },

  // Update Booking Status
  updateBooking: (bookingId: string, status: string) => {
    const bookingRef = ref(db, 'bookings/' + bookingId);
    update(bookingRef, { status });
  }
};
