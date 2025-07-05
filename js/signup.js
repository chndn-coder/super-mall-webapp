// js/signup.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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

// ✅ Detect role from URL
const params = new URLSearchParams(window.location.search);
const role = params.get("role") || "user"; // default to user
document.getElementById("signupTitle").textContent = `🧾 ${role === "merchant" ? "Merchant" : "User"} Signup`;
document.getElementById("loginLink").href = `login.html?role=${role}`;

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    localStorage.setItem("role", role); // ✅ Save role locally
    document.getElementById("message").textContent = "✅ Signup successful!";
    setTimeout(() => {
      window.location.href = `login.html?role=${role}`;
    }, 1000);
  } catch (err) {
    document.getElementById("message").textContent = `❌ ${err.message}`;
  }
});
