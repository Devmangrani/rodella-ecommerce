// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
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

// Add or update user in Firestore
export const createOrUpdateUser = async (user) => {
  if (!user) return;
  const userRef = doc(firedb, "users", user.uid);
  // Only send non-empty fields
  const filteredUser = Object.fromEntries(
    Object.entries(user).filter(([_, v]) => v !== undefined && v !== null && v !== "")
  );
  await setDoc(userRef, filteredUser, { merge: true });
};

// Save cart to Firestore
export const saveUserCart = async (uid, cartItems) => {
  if (!uid) return;
  const cartRef = doc(firedb, "carts", uid);
  await setDoc(cartRef, { items: cartItems }, { merge: true });
};

// Fetch cart from Firestore
export const fetchUserCart = async (uid) => {
  if (!uid) return [];
  const cartRef = doc(firedb, "carts", uid);
  const cartSnap = await getDoc(cartRef);
  if (cartSnap.exists()) {
    return cartSnap.data().items || [];
  }
  return [];
};

export { firedb, auth }; 