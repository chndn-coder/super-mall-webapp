// js/review-submit.js
import { getDatabase, ref, onValue, push } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

const db = getDatabase(getApp());

const productSelect = document.getElementById("productSelect");
const productMap = {}; // productName => full product object

// ✅ Populate dropdown from products
onValue(ref(db, "products"), (snapshot) => {
  const data = snapshot.val();

  if (!data) {
    productSelect.innerHTML = `<option disabled selected>No products available</option>`;
    return;
  }

  productSelect.innerHTML = `<option disabled selected>Select a product</option>`;

  Object.values(data).forEach(product => {
    if (product.productName && product.shopId) {
      productMap[product.productName] = product;
      productSelect.innerHTML += `
        <option value="${product.productName}">
          ${product.productName} (${product.shopId})
        </option>
      `;
    }
  });
});

// ✅ Handle review submission
document.getElementById("reviewForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const productName = productSelect.value;
  const rating = parseInt(document.getElementById("rating").value);
  const comment = document.getElementById("comment").value.trim();
  const msg = document.getElementById("reviewMessage");

  // ✅ Validation
  if (!productMap[productName]) {
    msg.innerHTML = "❌ Please select a valid product.";
    return;
  }

  if (isNaN(rating) || rating < 1 || rating > 5) {
    msg.innerHTML = "❌ Rating must be a number between 1 and 5.";
    return;
  }

  // ✅ Build review data
  const reviewData = {
    productName,
    shopId: productMap[productName].shopId,
    rating,
    comment,
    createdAt: new Date().toISOString()
  };

  try {
    await push(ref(db, "reviews"), reviewData);
    msg.innerHTML = "✅ Review submitted successfully!";
    document.getElementById("reviewForm").reset();
  } catch (err) {
    console.error("❌ Error submitting review:", err);
    msg.innerHTML = "❌ Failed to submit review.";
  }
});
