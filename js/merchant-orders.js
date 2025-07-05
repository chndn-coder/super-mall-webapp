// js/merchant-orders.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDAmDD9JL4p6apWhKUkN-zNTBFtQZzHpUc",
  authDomain: "supermallapp-439f7.firebaseapp.com",
  projectId: "supermallapp-439f7",
  storageBucket: "supermallapp-439f7.appspot.com",
  messagingSenderId: "913726155207",
  appId: "1:913726155207:web:d73892c97507f046a011e2",
  databaseURL: "https://supermallapp-439f7-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// DOM Elements
const ordersList = document.getElementById("ordersList");
const merchantEmailDisplay = document.getElementById("merchantEmailDisplay");

// Auth listener
onAuthStateChanged(auth, (user) => {
  if (!user) {
    ordersList.innerHTML = "❌ Please log in as a merchant.";
    return;
  }

  const merchantEmail = user.email;
  merchantEmailDisplay.textContent = `👤 Logged in as: ${merchantEmail}`;

  // Fetch orders
  onValue(ref(db, "orders"), (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      ordersList.innerHTML = "❌ No orders found.";
      return;
    }

    const matchingOrders = Object.entries(data).filter(([_, order]) =>
      order.items?.some(item => item.merchant === merchantEmail)
    );

    if (matchingOrders.length === 0) {
      ordersList.innerHTML = "🧾 No orders placed for your products yet.";
      return;
    }

    ordersList.innerHTML = matchingOrders.map(([orderId, order]) => {
      const itemsForMerchant = order.items.filter(i => i.merchant === merchantEmail);
      return `
        <div class="order-card">
          <h3>🆔 Order ID: ${orderId}</h3>
          <p><strong>Placed on:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
          <p><strong>Payment:</strong> ${order.paymentMethod}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Total:</strong> ₹${order.total}</p>
          <div class="item-summary">
            <strong>Items for You:</strong>
            ${itemsForMerchant.map(item => `
              <p>• ${item.productName} (${item.quantity || 1} × ₹${item.price})</p>
            `).join("")}
          </div>
        </div>
      `;
    }).join("");
  });
});
