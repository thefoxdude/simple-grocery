import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAnLaHT25iTrbYpMASqRQIBGyAAjR4bsqw",
    // authDomain: "simple-grocery-fox.firebaseapp.com",
    authDomain: "localhost",
    projectId: "simple-grocery-fox",
    storageBucket: "simple-grocery-fox.firebasestorage.app",
    messagingSenderId: "863301808340",
    appId: "1:863301808340:web:516e40ba6cf0eaaab6cb41",
    measurementId: "G-B3QFV7CKZC"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
// const analytics = getAnalytics(app);