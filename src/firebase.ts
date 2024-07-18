import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth, createUserWithEmailAndPassword } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIfO-BXjKMrYTYB9poQScQ5tWXoDRhMQU",
  authDomain: "pengajian-3ac47.firebaseapp.com",
  projectId: "pengajian-3ac47",
  storageBucket: "pengajian-3ac47.appspot.com",
  messagingSenderId: "1074474962115",
  appId: "1:1074474962115:web:93b5233753ae1cd8a62676",
  measurementId: "G-GCYVRFRQP5"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore database
const db: Firestore = getFirestore(app);

// Initialize Firebase authentication
const auth: Auth = getAuth(app);

export { app, db, auth, createUserWithEmailAndPassword };
