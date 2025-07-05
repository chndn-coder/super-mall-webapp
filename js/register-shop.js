// ✅ Firebase Imports
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDAmDD9JL4p6apWhKUkN-zNTBFtQZzHpUc",
  authDomain: "supermallapp-439f7.firebaseapp.com",
  projectId: "supermallapp-439f7",
  storageBucket: "supermallapp-439f7.appspot.com",
  messagingSenderId: "913726155207",
  appId: "1:913726155207:web:d73892c97507f046a011e2",
  measurementId: "G-NJXVD2PXR5",
  databaseURL: "https://supermallapp-439f7-default-rtdb.firebaseio.com"
};

// ✅ Prevent Firebase duplicate app error
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);
const auth = getAuth(app);

// ✅ Handle Shop Registration Form
document.getElementById("shopForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const shopName = document.getElementById("shopName").value.trim();
  const category = document.getElementById("category").value;
  const floor = parseInt(document.getElementById("floor").value);
  const contact = document.getElementById("contact").value.trim();
  const messageBox = document.getElementById("message");

  // ✅ Validations
  if (isNaN(floor) || floor < 0 || floor > 10) {
    messageBox.innerHTML = "❌ Floor must be between 0 and 10.";
    return;
  }

  const phonePattern = /^[6-9]\d{9}$/;
  if (!phonePattern.test(contact)) {
    messageBox.innerHTML = "❌ Enter a valid 10-digit Indian mobile number (starting with 6-9).";
    return;
  }

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      messageBox.innerHTML = "❌ You must be logged in to register a shop.";
      return;
    }

    const registerShop = async (lat = null, lng = null) => {
      const shopRef = ref(db, "shops");
      const newShopRef = push(shopRef);
      const shopId = newShopRef.key;

      const shopData = {
        shopName,
        category,
        floor,
        contact,
        merchant: user.email,
        ...(lat && lng ? { lat, lng } : {}) // Optional location
      };

      try {
        await set(newShopRef, shopData);

        // ✅ Log the shop registration
        await push(ref(db, "logs"), {
          action: "register_shop",
          shopId,
          timestamp: new Date().toISOString(),
          merchant: user.email,
          details: shopData
        });

        messageBox.innerHTML = `
          ✅ <strong>Shop registered successfully!</strong><br>
          🆔 <strong>Your Shop ID:</strong> <code id="shopIdText">${shopId}</code>
          <button onclick="copyShopId()">📋 Copy</button><br><br>
          <a href="add-product.html?shopId=${shopId}">
            <button>➕ Add Product to This Shop</button>
          </a>
        `;

        document.getElementById("shopForm").reset();
      } catch (error) {
        console.error("❌ Error adding shop: ", error);
        messageBox.innerText = "❌ Error registering shop. Please try again.";
      }
    };

    // 🌍 Try to get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => registerShop(position.coords.latitude, position.coords.longitude),
        () => {
          console.warn("⚠️ Location denied by user.");
          registerShop(); // Register without location
        },
        { timeout: 5000 }
      );
    } else {
      registerShop(); // Fallback if geolocation not supported
    }
  });
});

// 📋 Copy Shop ID
window.copyShopId = function () {
  const shopId = document.getElementById("shopIdText").innerText;
  navigator.clipboard.writeText(shopId).then(() => {
    alert("✅ Shop ID copied to clipboard!");
  });
};
