// js/index-offers.js

// ✅ Do NOT reinitialize Firebase if already initialized in index.html
import { getApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// ✅ Use the already initialized Firebase app
const app = getApp();
const db = getDatabase(app);

// ✅ Offer list container
const offerList = document.getElementById("offerList");

onValue(ref(db, "offers"), (snapshot) => {
  const data = snapshot.val();

  if (!data) {
    offerList.innerHTML = "<p>No offers available right now.</p>";
    return;
  }

  const offers = Object.values(data).reverse(); // Show latest offers first

  offerList.innerHTML = offers.map(offer => `
    <div class="offer-card">
      <h3>${offer.offerTitle}</h3>
      <p>${offer.offerDescription}</p>
      ${offer.validUntil ? `<p><strong>Valid Until:</strong> ${offer.validUntil}</p>` : ""}
    </div>
  `).join('');
});
