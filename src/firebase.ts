// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIQJOb2-sG_sZ-xg87o5_167YudixqPIE",
  authDomain: "studyreco.firebaseapp.com",
  projectId: "studyreco",
  storageBucket: "studyreco.firebasestorage.app",
  messagingSenderId: "909520281920",
  appId: "1:909520281920:web:d756f63745faced2ed9aa5",
  measurementId: "G-1WHB6BZEWE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app);