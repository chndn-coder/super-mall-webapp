// js/view-orders.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
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
const orderList = document.getElementById("orderList");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    orderList.innerHTML = "<p>🔒 Please login to view orders.</p>";
    return;
  }

  onValue(ref(db, "orders"), (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      orderList.innerHTML = "<p>❌ No orders found.</p>";
      return;
    }

    const orders = Object.entries(data).filter(([_, order]) =>
      order.billingInfo?.email === user.email || order.items?.some(item => item.merchant === user.email)
    );

    if (orders.length === 0) {
      orderList.innerHTML = "<p>🔍 No orders related to you.</p>";
      return;
    }

    orderList.innerHTML = orders.map(([orderId, order]) => {
      const isCustomer = order.billingInfo?.email === user.email;
      const isMerchant = order.items?.some(item => item.merchant === user.email);
      const statusOptions = ["Pending", "Shipped", "Delivered", "Cancelled"];

      return `
        <div class="order-card">
          <h3>📦 Order ID: ${orderId}</h3>
          <p><strong>Status:</strong> ${
            isMerchant
              ? `<select class="status-select" data-id="${orderId}">
                  ${statusOptions.map(s => `<option ${s === order.status ? "selected" : ""}>${s}</option>`).join("")}
                </select>`
              : `<span>${order.status}</span>`
          }</p>
          <p><strong>Total:</strong> ₹${order.total}</p>
          <p><strong>Payment:</strong> ${order.paymentMethod}</p>
          <p><strong>Customer:</strong> ${order.billingInfo?.name || "N/A"} (${order.billingInfo?.email || "N/A"})</p>
          <p><strong>Address:</strong> ${order.billingInfo?.address || "N/A"}</p>
          <div class="order-items">
            <strong>Items:</strong>
            <ul>${order.items.map(i => `<li>${i.productName} x ${i.quantity || 1}</li>`).join("")}</ul>
          </div>
          ${isCustomer && order.status === "Pending"
            ? `<button class="cancel-btn" data-id="${orderId}">❌ Cancel Order</button>`
            : ""}
        </div>
      `;
    }).join("");

    // 🔄 Handle status change
    document.querySelectorAll(".status-select").forEach(select => {
      select.addEventListener("change", (e) => {
        const orderId = select.dataset.id;
        update(ref(db, `orders/${orderId}`), { status: select.value });
      });
    });

    // ❌ Handle cancel
    document.querySelectorAll(".cancel-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        if (confirm("Cancel this order?")) {
          update(ref(db, `orders/${id}`), { status: "Cancelled" });
        }
      });
    });
  });
});
