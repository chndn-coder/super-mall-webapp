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

const productList = document.getElementById("productList");
const categoryFilter = document.getElementById("categoryFilter");
const floorFilter = document.getElementById("floorFilter");

let allProducts = [];

onValue(ref(db, "products"), (snapshot) => {
  const data = snapshot.val();
  allProducts = data ? Object.entries(data).map(([id, product]) => ({ id, ...product })) : [];
  applyFilters();
});

categoryFilter.addEventListener("change", applyFilters);
floorFilter.addEventListener("change", applyFilters);

function applyFilters() {
  const selectedCategory = categoryFilter.value;
  const selectedFloor = floorFilter.value;

  const filtered = allProducts.filter(product => {
    const matchesCategory = selectedCategory === "" || product.category === selectedCategory;
    const matchesFloor = selectedFloor === "" || String(product.floor) === selectedFloor;
    return matchesCategory && matchesFloor;
  });

  renderProducts(filtered);
}

function renderProducts(products) {
  if (products.length === 0) {
    productList.innerHTML = "<p>❌ No products match your filters.</p>";
    return;
  }

  productList.innerHTML = products.map(product => `
    <div class="product-card">
      <h3>${product.productName}</h3>
      ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.productName}" />` : ''}
      <p><strong>Price:</strong> ₹${product.price}</p>
      <p><strong>Floor:</strong> ${product.floor}</p>
      <p><strong>Category:</strong> ${product.category}</p>
      <p><strong>Description:</strong> ${product.description}</p>
      <button class="add-to-cart-btn" data-id="${product.id}">🛒 Add to Cart</button>
    </div>
  `).join('');

  attachAddToCartEvents();
}

function attachAddToCartEvents() {
  document.querySelectorAll(".add-to-cart-btn").forEach(button => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("data-id");
      const product = allProducts.find(p => p.id === productId);

      if (!product) {
        alert("❌ Product not found.");
        return;
      }

      const cart = JSON.parse(localStorage.getItem("superMallCart") || "[]");

      const exists = cart.some(item => item.id === product.id);
      if (exists) {
        alert("⚠️ Product is already in your cart.");
        return;
      }

      cart.push({
        id: product.id,
        productName: product.productName,
        price: product.price,
        imageUrl: product.imageUrl || "",
        category: product.category || "N/A",
        floor: product.floor ?? "N/A",
        merchant: product.merchant || "unknown" // ✅ FIX: add merchant info
      });

      localStorage.setItem("superMallCart", JSON.stringify(cart));
      alert("✅ Product added to cart!");
    });
  });
}
