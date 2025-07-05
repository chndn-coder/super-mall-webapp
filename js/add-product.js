// js/add-product.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, set, get, child } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Firebase config
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
const auth = getAuth(app);

document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const shopId = document.getElementById("shopId").value.trim();
  const productName = document.getElementById("productName").value;
  const description = document.getElementById("description").value;
  const price = parseFloat(document.getElementById("price").value);
  const features = document.getElementById("features").value.split(",").map(f => f.trim());

  const messageBox = document.getElementById("message");

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      messageBox.innerText = "❌ You must be logged in to add a product.";
      return;
    }

    const shopRef = ref(db);
    const shopSnap = await get(child(shopRef, `shops/${shopId}`));

    if (!shopSnap.exists()) {
      alert("❌ Invalid Shop ID");
      return;
    }

    const shopData = shopSnap.val();
    const floor = shopData.floor;
    const category = shopData.category;

    const productRef = ref(db, "products");
    const newProductRef = push(productRef);
    const productId = newProductRef.key;

    const productData = {
      shopId,
      productName,
      description,
      price,
      features,
      floor,
      category,
      merchant: user.email // ✅ Save merchant email
    };

    await set(newProductRef, productData);

    // ✅ Log Product Added with merchant
    await push(ref(db, "logs"), {
      action: "Product Added",
      shopId,
      productId,
      productName,
      merchant: user.email,
      timestamp: new Date().toISOString()
    });

    messageBox.innerText = "✅ Product added successfully!";
    document.getElementById("productForm").reset();
  });
});
