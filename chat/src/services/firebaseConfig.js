import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBblszYv_ElcgkIIewDKocvKDpYAs7JaPk",
  authDomain: "chat-test-76e21.firebaseapp.com",
  projectId: "chat-test-76e21",
  storageBucket: "chat-test-76e21.appspot.com",
  messagingSenderId: "976364720589",
  appId: "1:976364720589:web:b2b195a3c858c518b9b484",
  measurementId: "G-MHSNR23VNH"
};

export const app = initializeApp(firebaseConfig);
export const databaseApp = getFirestore(app);
