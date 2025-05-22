// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "tech-b7265.firebaseapp.com",
  projectId: "tech-b7265",
 storageBucket: "interview-exp.appspot.com",
  messagingSenderId: "816174456756",
  appId: "1:816174456756:web:a15768a9a97805d60c5ce1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

export { app, auth };