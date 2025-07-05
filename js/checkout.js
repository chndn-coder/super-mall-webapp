import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDAmDD9JL4p6apWhKUkN-zNTBFtQZzHpUc",
  authDomain: "supermallapp-439f7.firebaseapp.com",
  databaseURL: "https://supermallapp-439f7-default-rtdb.firebaseio.com",
  projectId: "supermallapp-439f7",
  storageBucket: "supermallapp-439f7.appspot.com",
  messagingSenderId: "913726155207",
  appId: "1:913726155207:web:d73892c97507f046a011e2"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// 🛒 Cart
function getCart() {
  return JSON.parse(localStorage.getItem("superMallCart") || "[]");
}

function calculateTotal(cart) {
  return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
}

let userLocation = null;

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userLocation = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };
    },
    (err) => console.warn("⚠️ Location access denied.", err)
  );
}

document.getElementById("checkoutForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const cart = getCart();
  if (cart.length === 0) return alert("❌ Cart is empty.");

  const name = document.getElementById("name").value.trim();
  const address = document.getElementById("address").value.trim();
  const paymentMethod = document.querySelector("input[name='paymentMethod']:checked")?.value || "COD";

  onAuthStateChanged(auth, async (user) => {
    if (!user) return alert("❌ Please login first.");

    const total = calculateTotal(cart);
    const orderRef = ref(db, "orders");
    const newOrderRef = push(orderRef);
    const orderId = newOrderRef.key;

    const enrichedCart = cart.map(item => ({
      ...item,
      merchant: item.merchant || "unknown"
    }));

    const order = {
      orderId,
      user: user.email,
      items: enrichedCart,
      total,
      status: paymentMethod === "COD" ? "Pending" : "Paid",
      paymentMethod,
      billingInfo: {
        name,
        address,
        email: user.email
      },
      geoLocation: userLocation,
      timestamp: new Date().toISOString()
    };

    if (paymentMethod === "COD") {
      await set(newOrderRef, order);
      localStorage.removeItem("superMallCart");
      window.location.href = `checkout-success.html?orderId=${orderId}`;
    } else {
      const confirmPayment = confirm(`💳 Pay ₹${total} using GPay (Simulation)?`);
      if (confirmPayment) {
        await set(newOrderRef, {
          ...order,
          status: "Paid",
          simulatedPayment: true
        });
        localStorage.removeItem("superMallCart");
        window.location.href = `checkout-success.html?orderId=${orderId}`;
      } else {
        alert("❌ Payment cancelled.");
      }
    }
  });
});
