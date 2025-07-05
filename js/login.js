// js/login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Firebase config
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
const auth = getAuth(app);

// ✅ Detect role from URL query
const params = new URLSearchParams(window.location.search);
const role = params.get("role"); // either 'user' or 'merchant'

// ✅ Set title dynamically
const loginTitle = document.getElementById("loginTitle");
const signupLink = document.getElementById("signupLink");

if (role === "merchant") {
  loginTitle.textContent = "🔐 Merchant Login";
  signupLink.href = "signup.html?role=merchant";
} else {
  loginTitle.textContent = "🔐 User Login";
  signupLink.href = "signup.html?role=user";
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    document.getElementById("message").style.color = "green";
    document.getElementById("message").textContent = "✅ Login successful!";

    // ✅ Save role locally
    localStorage.setItem("role", role || "user");

    setTimeout(() => {
      window.location.href = "../index.html";
    }, 1000);
  } catch (err) {
    document.getElementById("message").textContent = `❌ ${err.message}`;
  }
});
