
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKNbEQPyzIwO7iBMT786rUSJTfgzKPbqE",
  authDomain: "local-library-lore.firebaseapp.com",
  projectId: "local-library-lore",
  storageBucket: "local-library-lore.appspot.com",
  messagingSenderId: "32992905775",
  appId: "1:32992905775:web:db05d00519b1fc1c3e54da"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
