import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgagSabNpD4qBQy6UuPj6dgDYMSfcMljw",
  authDomain: "react-chat-app-fd103.firebaseapp.com",
  projectId: "react-chat-app-fd103",
  storageBucket: "react-chat-app-fd103.appspot.com",
  messagingSenderId: "62101282916",
  appId: "1:62101282916:web:8d380d67fb3c3ab220bf71",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// gets a reference to the firebase authentication service
export const auth = getAuth();
// gets a reference to the storage service
export const storage = getStorage();
// gets a reference to the cloud firestore database
export const db = getFirestore();
