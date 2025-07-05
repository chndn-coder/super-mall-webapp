// js/view-shops.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDAmDD9JL4p6apWhKUkN-zNTBFtQZzHpUc",
  authDomain: "supermallapp-439f7.firebaseapp.com",
  projectId: "supermallapp-439f7",
  storageBucket: "supermallapp-439f7.firebasestorage.app",
  messagingSenderId: "913726155207",
  appId: "1:913726155207:web:d73892c97507f046a011e2",
  measurementId: "G-NJXVD2PXR5"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const mallLayout = document.getElementById("mallLayout");

// Create containers for floors 0–10
const floorContainers = {};
for (let i = 0; i <= 10; i++) {
  const section = document.createElement("div");
  section.className = "floor-section";
  section.innerHTML = `<h3>🛗 Floor ${i}</h3><div id="floor-${i}"></div>`;
  mallLayout.appendChild(section);
  floorContainers[i] = section.querySelector(`#floor-${i}`);
}

const shopsRef = ref(db, "shops");
onValue(shopsRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  Object.entries(data).forEach(([id, shop]) => {
    const floor = shop.floor || 0;

    const card = document.createElement("div");
    card.className = "shop-card";

    card.innerHTML = `
      <div class="shop-name" onclick="location.href='view-products.html?shopId=${id}'">${shop.shopName}</div>
      <div class="shop-details"><strong>Category:</strong> ${shop.category}</div>
      <div class="shop-details"><strong>Contact:</strong> ${shop.contact}</div>
      <div class="shop-details"><strong>ID:</strong> ${id}</div>
    `;

    const container = floorContainers[floor];
    if (container) {
      container.appendChild(card);
    }
  });
});
