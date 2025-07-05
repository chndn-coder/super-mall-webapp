// js/view-reviews.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDAmDD9JL4p6apWhKUkN-zNTBFtQZzHpUc",
  authDomain: "supermallapp-439f7.firebaseapp.com",
  projectId: "supermallapp-439f7",
  storageBucket: "supermallapp-439f7.appspot.com",
  messagingSenderId: "913726155207",
  appId: "1:913726155207:web:d73892c97507f046a011e2",
  databaseURL: "https://supermallapp-439f7-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const reviewList = document.getElementById("reviewList");

onValue(ref(db, "reviews"), (snapshot) => {
  const data = snapshot.val();
  if (!data) {
    reviewList.innerHTML = "<p>No reviews yet.</p>";
    return;
  }

  reviewList.innerHTML = Object.values(data).reverse().map(r => `
    <div class="review-card">
      <h3>${r.productName || "Unknown Product"}</h3>
      <p><strong>Rating:</strong> ${"⭐".repeat(r.rating)}</p>
      <p><strong>Comment:</strong> ${r.comment}</p>
    </div>
  `).join('');
});
