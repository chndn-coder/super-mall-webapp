// js/view-offers.js
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
const container = document.getElementById("offersContainer");

onValue(ref(db, "offers"), (snapshot) => {
  const data = snapshot.val();
  if (!data) {
    container.innerHTML = "<p>No offers found.</p>";
    return;
  }

  const offers = Object.values(data);
  container.innerHTML = offers.map(offer => `
    <div class="offer-card">
      <h3>${offer.offerTitle}</h3>
      <p>${offer.offerDescription}</p>
      <p><strong>Shop ID:</strong> ${offer.shopId}</p>
      ${offer.validUntil ? `<p><strong>Valid Until:</strong> ${offer.validUntil}</p>` : ''}
    </div>
  `).join('');
});
