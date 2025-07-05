// js/compare-products.js
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

const dropdown1 = document.getElementById("product1Dropdown");
const dropdown2 = document.getElementById("product2Dropdown");
const compareBtn = document.getElementById("compareBtn");
const result = document.getElementById("comparisonResult");

let allProducts = {};

onValue(ref(db, "products"), (snapshot) => {
  allProducts = snapshot.val() || {};
  populateDropdowns(allProducts);
});

function populateDropdowns(products) {
  Object.entries(products).forEach(([id, product]) => {
    const option1 = document.createElement("option");
    const option2 = document.createElement("option");

    option1.value = id;
    option2.value = id;

    option1.text = product.productName;
    option2.text = product.productName;

    dropdown1.appendChild(option1);
    dropdown2.appendChild(option2);
  });
}

compareBtn.addEventListener("click", () => {
  const id1 = dropdown1.value;
  const id2 = dropdown2.value;

  result.innerHTML = "";

  if (!id1 || !id2 || id1 === id2) {
    alert("❌ Please select two different products.");
    return;
  }

  const product1 = allProducts[id1];
  const product2 = allProducts[id2];

  const cheaper = product1.price < product2.price ? 1 : 2;

  const allFeatures = new Set([
    ...(product1.features || []),
    ...(product2.features || [])
  ]);

  const featureHtml = [...allFeatures].map(feature => `
    <div class="feature-row">
      <span class="${product1.features?.includes(feature) ? 'has' : 'missing'}">✔️</span>
      <span>${feature}</span>
      <span class="${product2.features?.includes(feature) ? 'has' : 'missing'}">✔️</span>
    </div>
  `).join('');

  result.innerHTML = `
    <div class="compare-card ${cheaper === 1 ? 'highlight' : ''}">
      <h3>${product1.productName}</h3>
      ${product1.imageUrl ? `<img src="${product1.imageUrl}" alt="Product 1">` : ''}
      <p><strong>Price:</strong> ₹${product1.price}</p>
      <p><strong>Description:</strong> ${product1.description}</p>
    </div>

    <div class="feature-compare">
      <h4>🟩 Feature Comparison</h4>
      ${featureHtml}
    </div>

    <div class="compare-card ${cheaper === 2 ? 'highlight' : ''}">
      <h3>${product2.productName}</h3>
      ${product2.imageUrl ? `<img src="${product2.imageUrl}" alt="Product 2">` : ''}
      <p><strong>Price:</strong> ₹${product2.price}</p>
      <p><strong>Description:</strong> ${product2.description}</p>
    </div>
  `;
});
