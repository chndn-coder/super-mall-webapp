// js/merchant-dashboard.js
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

const auth = getAuth();
const db = getDatabase(getApp());

const welcomeMsg = document.getElementById("welcomeMsg");
const shopList = document.getElementById("shopList");
const productList = document.getElementById("productList");
const offerList = document.getElementById("offerList");

auth.onAuthStateChanged((user) => {
  if (!user) return;
  const userEmail = user.email;
  welcomeMsg.textContent = `Welcome, ${userEmail}`;

  // ✅ Fetch Shops
  onValue(ref(db, "shops"), (snap) => {
    const data = snap.val() || {};
    const merchantShops = Object.entries(data).filter(([_, v]) => v.merchant === userEmail);
    shopList.innerHTML = merchantShops.length
      ? merchantShops.map(([id, shop]) => `<div><strong>${shop.shopName}</strong> (Floor ${shop.floor})</div>`).join("")
      : "You haven't registered any shops.";
  });

  // ✅ Fetch Products
  onValue(ref(db, "products"), (snap) => {
    const data = snap.val() || {};
    const userProducts = Object.values(data).filter(p => p.merchant === userEmail);
    productList.innerHTML = userProducts.length
      ? userProducts.map(p => `<div><strong>${p.productName}</strong> - ₹${p.price}</div>`).join("")
      : "No products found.";
  });

  // ✅ Fetch Offers
  onValue(ref(db, "offers"), (snap) => {
    const data = snap.val() || {};
    const yourOffers = Object.values(data).filter(o => o.merchant === userEmail);
    offerList.innerHTML = yourOffers.length
      ? yourOffers.map(o => `<div><strong>${o.offerTitle}</strong> - ${o.offerDescription}</div>`).join("")
      : "No offers submitted yet.";
  });
});
