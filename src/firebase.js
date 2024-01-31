// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTW-ST26Jo_VklANf8XAJieKK_gF3tDOM",
  authDomain: "chatapplication-73863.firebaseapp.com",
  projectId: "chatapplication-73863",
  storageBucket: "chatapplication-73863.appspot.com",
  messagingSenderId: "859402117062",
  appId: "1:859402117062:web:ac6a5d229971525caf5cc7",
  measurementId: "G-7F8M23JCGT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth=getAuth()
export const storage = getStorage();
export const db = getFirestore()