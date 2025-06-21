// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzejALeMCCQHdixP4tNQCLtEJBIs5-RFY",
  authDomain: "rodella-ecommerce-app.firebaseapp.com",
  projectId: "rodella-ecommerce-app",
  storageBucket: "rodella-ecommerce-app.firebasestorage.app",
  messagingSenderId: "126496275268",
  appId: "1:126496275268:web:7d3be0ff59df5034283511"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firedb = getFirestore(app);
const auth = getAuth(app);

export { firedb, auth }; 