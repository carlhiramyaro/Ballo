import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCyVgxs5ghtAXHt7nzJZ5WDV6Utl5kN4To",
  authDomain: "your-auth-domain",
  projectId: "ballo-6a80a",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "171403231138",
  appId: "your-app-id",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
