// js/auth-check.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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
const auth = getAuth(app);

// 🚫 If user not logged in, redirect to login.html
onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("❌ Please login to access this page.");
    window.location.href = "login.html";
  }
});
