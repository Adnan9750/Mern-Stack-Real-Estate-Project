// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIEBASE_API_KEY,
  authDomain: "mern-estate-5cdbd.firebaseapp.com",
  projectId: "mern-estate-5cdbd",
  storageBucket: "mern-estate-5cdbd.appspot.com",
  messagingSenderId: "105933164099",
  appId: "1:105933164099:web:83cf549f4a52961933cef6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);