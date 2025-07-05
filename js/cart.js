// ✅ cart.js (Fully Corrected: customer + merchant tracking)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// 🔥 Firebase Config
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
const auth = getAuth(app);

// 🔢 Elements
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartTotalElement = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const clearCartBtn = document.getElementById("clearCartBtn");

// 🛒 Cart Functions
function getCart() {
  return JSON.parse(localStorage.getItem("superMallCart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("superMallCart", JSON.stringify(cart));
}

function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

function increaseQuantity(index) {
  const cart = getCart();
  cart[index].quantity = (cart[index].quantity || 1) + 1;
  saveCart(cart);
  renderCart();
}

function decreaseQuantity(index) {
  const cart = getCart();
  if ((cart[index].quantity || 1) > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  saveCart(cart);
  renderCart();
}

function renderCart() {
  const cart = getCart();
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>🛒 Your cart is empty.</p>";
    cartTotalElement.textContent = "0";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const quantity = item.quantity || 1;
    const price = parseFloat(item.price) || 0;
    const subtotal = price * quantity;
    total += subtotal;

    const itemCard = document.createElement("div");
    itemCard.className = "cart-item";

    itemCard.innerHTML = `
      <div class="cart-left">
        <h3>${item.productName}</h3>
        ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.productName}" />` : ""}
        <p><strong>Price:</strong> ₹${price}</p>
        <p><strong>Category:</strong> ${item.category || "N/A"}</p>
        <p><strong>Floor:</strong> ${item.floor ?? "N/A"}</p>
      </div>
      <div class="cart-right">
        <div class="quantity-controls">
          <button onclick="decreaseQuantity(${index})">➖</button>
          <span>${quantity}</span>
          <button onclick="increaseQuantity(${index})">➕</button>
        </div>
        <p><strong>Subtotal:</strong> ₹${subtotal.toFixed(2)}</p>
        <button onclick="removeItem(${index})">🗑️ Remove</button>
      </div>
    `;

    cartItemsContainer.appendChild(itemCard);
  });

  cartTotalElement.textContent = total.toFixed(2);
}

// ✅ Checkout Button Logic
checkoutBtn?.addEventListener("click", () => {
  const cart = getCart();
  if (cart.length === 0) return alert("❌ Cart is empty.");
  if (!confirm("🧾 Place your order now?")) return;

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("❌ Please login to place your order.");
      return;
    }

    // ✅ Merchant safety fallback for each item
    const enrichedCart = cart.map((item) => ({
      ...item,
      merchant: item.merchant || "unknown" // fallback
    }));

    const orderRef = ref(db, "orders");
    const newOrderRef = push(orderRef);

    const order = {
      orderId: newOrderRef.key,
      user: user.email, // ✅ customer placing the order
      items: enrichedCart,
      total: parseFloat(cartTotalElement.textContent),
      status: "Pending",
      paymentMethod: "Cash on Delivery",
      billingInfo: {
        name: "Customer Name",
        address: "Pickup at Mall Counter",
        email: user.email // optional but helps in lookup
      },
      timestamp: new Date().toISOString()
    };

    await set(newOrderRef, order);
    localStorage.removeItem("superMallCart");
    window.location.href = "pages/checkout.html";
  });
});

// 🧹 Clear Cart
clearCartBtn?.addEventListener("click", () => {
  if (confirm("Clear all items from cart?")) {
    localStorage.removeItem("superMallCart");
    renderCart();
  }
});

// 🌍 Global access for quantity buttons
window.removeItem = removeItem;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;

// 🔁 Render cart on load
renderCart();
