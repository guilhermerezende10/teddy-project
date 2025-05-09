// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhKj7yPWQpbltHGmbYtJGR1GU3bo6LTH4",
  authDomain: "teddy-project-da264.firebaseapp.com",
  projectId: "teddy-project-da264",
  storageBucket: "teddy-project-da264.firebasestorage.app",
  messagingSenderId: "95498088989",
  appId: "1:95498088989:web:0d2033cf94101d15408cf4",
  measurementId: "G-JR6VHVC1TJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
