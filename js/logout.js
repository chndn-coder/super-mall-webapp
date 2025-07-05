// js/logout.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDAmDD9JL4p6apWhKUkN-zNTBFtQZzHpUc",
  authDomain: "supermallapp-439f7.firebaseapp.com",
  projectId: "supermallapp-439f7",
  storageBucket: "supermallapp-439f7.appspot.com",
  messagingSenderId: "913726155207",
  appId: "1:913726155207:web:d73892c97507f046a011e2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔐 Show user email if logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("userEmail").textContent = `👤 ${user.email}`;
  }
});

// 🔓 Logout on button click
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  signOut(auth).then(() => {
    alert("✅ Logged out successfully.");
    window.location.href = "pages/login.html";
  }).catch((error) => {
    console.error("Logout error:", error);
  });
});
