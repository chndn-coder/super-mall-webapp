import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDAmDD9JL4p6apWhKUkN-zNTBFtQZzHpUc",
  authDomain: "supermallapp-439f7.firebaseapp.com",
  projectId: "supermallapp-439f7",
  storageBucket: "supermallapp-439f7.appspot.com",
  messagingSenderId: "913726155207",
  appId: "1:913726155207:web:d73892c97507f046a011e2",
  databaseURL: "https://supermallapp-439f7-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const orderId = new URLSearchParams(window.location.search).get("orderId");
document.getElementById("orderId").innerText = orderId || "N/A";

const paymentStatusEl = document.getElementById("paymentStatus");
const locationEl = document.getElementById("locationDisplay");
let currentOrder = null;

if (orderId) {
  get(child(ref(db), `orders/${orderId}`)).then(snapshot => {
    if (snapshot.exists()) {
      currentOrder = snapshot.val();
      currentOrder.orderId = orderId;

      paymentStatusEl.innerText =
        currentOrder.paymentMethod === "COD"
          ? "Cash on Delivery (Pending)"
          : "Online Payment (Paid)";

      // Show location if available
      const lat = currentOrder.geoLocation?.lat;
      const lng = currentOrder.geoLocation?.lng;
      if (lat && lng) {
        locationEl.innerHTML = `<strong>📍 Ordered From:</strong> Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
        document.getElementById("map").style.display = "block";
        const map = L.map('map').setView([lat, lng], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        L.marker([lat, lng]).addTo(map).bindPopup("📍 Customer Ordered From Here").openPopup();
      } else {
        locationEl.innerHTML = `<strong>📍 Ordered From:</strong> Not available`;
      }
    } else {
      paymentStatusEl.innerText = "❌ Order not found.";
    }
  }).catch(error => {
    console.error("Error fetching order:", error);
    paymentStatusEl.innerText = "⚠️ Error loading order.";
  });
}

document.getElementById("downloadBtn").addEventListener("click", () => {
  if (!currentOrder) return alert("Order not loaded yet.");
  const content = `
Super Mall Order Invoice

Order ID: ${orderId}
Customer: ${currentOrder.billingInfo?.name || "N/A"}
Email: ${currentOrder.billingInfo?.email || "N/A"}
Address: ${currentOrder.billingInfo?.address || "N/A"}
Payment: ${currentOrder.paymentMethod}
Status: ${currentOrder.status}
Date: ${new Date(currentOrder.timestamp).toLocaleString()}

Items:
${(currentOrder.items || []).map(i => `- ${i.productName} × ${i.quantity || 1} = ₹${i.price}`).join("\n")}

Total: ₹${currentOrder.total}
Location: ${currentOrder.geoLocation?.lat || "N/A"}, ${currentOrder.geoLocation?.lng || "N/A"}
  `;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Invoice-${orderId}.txt`;
  link.click();
  URL.revokeObjectURL(url);
});

document.getElementById("printBtn").addEventListener("click", () => {
  if (!currentOrder) return alert("Order not loaded yet.");

  const items = currentOrder.items || [];
  const itemsHTML = items.map(i => `<li>${i.productName} × ${i.quantity || 1} = ₹${i.price}</li>`).join("");

  const html = `
  <html>
    <head>
      <title>Super Mall Receipt</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; padding: 40px; }
        h2 { color: #27ae60; }
        .section { margin-bottom: 20px; }
        .section strong { display: inline-block; width: 130px; }
      </style>
    </head>
    <body>
      <h2>🧾 Super Mall Receipt</h2>
      <div class="section"><strong>Order ID:</strong> ${orderId}</div>
      <div class="section"><strong>Name:</strong> ${currentOrder.billingInfo?.name || "N/A"}</div>
      <div class="section"><strong>Email:</strong> ${currentOrder.billingInfo?.email || "N/A"}</div>
      <div class="section"><strong>Address:</strong> ${currentOrder.billingInfo?.address || "N/A"}</div>
      <div class="section"><strong>Payment:</strong> ${currentOrder.paymentMethod}</div>
      <div class="section"><strong>Status:</strong> ${currentOrder.status}</div>
      <div class="section"><strong>Date:</strong> ${new Date(currentOrder.timestamp).toLocaleString()}</div>
      <div class="section"><strong>Location:</strong> ${currentOrder.geoLocation?.lat || "N/A"}, ${currentOrder.geoLocation?.lng || "N/A"}</div>
      <div class="section"><strong>Items:</strong><br><ul>${itemsHTML}</ul></div>
      <div class="section"><strong>Total:</strong> ₹${currentOrder.total}</div>
      <hr>
      <p style="text-align:center;">Thank you for shopping at Super Mall!</p>
    </body>
  </html>
  `;

  const win = window.open("", "PrintWindow", "width=800,height=600");
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
});
