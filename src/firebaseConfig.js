// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAlEbtGF8WjxzpQg80OeJ64pZK3UQaDy6Q",
  authDomain: "ticket-raise.firebaseapp.com",
  projectId: "ticket-raise",
  storageBucket: "ticket-raise.firebasestorage.app",
  messagingSenderId: "875507367143",
  appId: "1:875507367143:web:76985e3ee8755d16a27642",
  measurementId: "G-T93XX49TPK"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export { createUserWithEmailAndPassword, signInWithEmailAndPassword };