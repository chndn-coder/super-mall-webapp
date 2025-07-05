// js/index-reviews.js
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

const db = getDatabase(getApp());
const reviewList = document.getElementById("reviewList");

// First: Load shops and map shopId → shopName
const shopMap = {};
onValue(ref(db, "shops"), (snapshot) => {
  const shops = snapshot.val() || {};
  Object.entries(shops).forEach(([id, data]) => {
    shopMap[id] = data.shopName;
  });
});

// Then: Load reviews
onValue(ref(db, "reviews"), (snapshot) => {
  const data = snapshot.val();

  if (!data) {
    reviewList.innerHTML = "<p>No reviews yet.</p>";
    return;
  }

  const reviews = Object.values(data).reverse(); // latest first

  reviewList.innerHTML = reviews.map(r => {
    const stars = "⭐".repeat(r.rating);
    const shopName = shopMap[r.shopId] || "Unknown";

    return `
      <div class="review-card">
        <h3>🛍️ ${r.productName}</h3>
        <p><strong>Rating:</strong> ${stars}</p>
        <p><strong>Comment:</strong> ${r.comment}</p>
        <p><strong>📄 Shop:</strong> ${shopName}</p>
      </div>
    `;
  }).join('');
});
