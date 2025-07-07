// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, orderBy, getDocs } from "firebase/firestore";
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

// Save order to Firestore
export const saveOrder = async (orderData) => {
  if (!orderData || !orderData.uid) return null;
  
  const order = {
    ...orderData,
    createdAt: new Date(),
    status: orderData.status || 'Processing'
  };
  
  try {
    const ordersRef = collection(firedb, "orders");
    const docRef = await addDoc(ordersRef, order);
    return docRef.id;
  } catch (error) {
    console.error("Error saving order:", error);
    throw error;
  }
};

// Fetch orders for a specific user
export const fetchUserOrders = async (uid) => {
  if (!uid) return [];
  
  try {
    const ordersRef = collection(firedb, "orders");
    const q = query(
      ordersRef, 
      where("uid", "==", uid)
      // Removed orderBy to avoid index requirement - we'll sort in JavaScript
    );
    
    const querySnapshot = await getDocs(q);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Sort orders by createdAt in JavaScript (newest first)
    orders.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB - dateA; // Descending order (newest first)
    });
    
    console.log(`✅ Orders fetched successfully for uid: ${uid}`, orders);
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  if (!orderId || !status) return;
  
  try {
    const orderRef = doc(firedb, "orders", orderId);
    await setDoc(orderRef, { 
      status: status,
      updatedAt: new Date()
    }, { merge: true });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// Sample function to create test orders (for demonstration purposes)
export const createSampleOrder = async (uid) => {
  if (!uid) return null;
  
  const sampleOrder = {
    uid: uid,
    items: [
      {
        id: "1",
        name: "Carbon Fiber Sheet 200GSM",
        price: 299.99,
        quantity: 2,
        image: "/assets/carbon-fiber-sheet.jpg"
      },
      {
        id: "2", 
        name: "Epoxy Resin System",
        price: 149.50,
        quantity: 1,
        image: "/assets/Epoxy.png"
      }
    ],
    total: 749.48,
    status: "Completed",
    shippingAddress: {
      street: "123 Main St",
      city: "Anytown", 
      state: "CA",
      zipCode: "12345",
      country: "USA"
    },
    paymentMethod: "Credit Card",
    orderNotes: "Sample order for testing"
  };
  
  return await saveOrder(sampleOrder);
};

export { firedb, auth }; 