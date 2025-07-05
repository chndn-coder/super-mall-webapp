# 🏬 Super Mall Web Application

Hello! This is a fully working shopping mall website I built using **HTML**, **CSS**, **JavaScript**, and **Firebase**.

It’s designed like a real mall. People can explore shops by floor, view and compare products, add to cart, and place orders.  
Shop owners (merchants) can register their shop, add products, and manage offers. Everything runs in real-time using Firebase!

---

## 🌟 What Can You Do on Super Mall?

### 👤 As a User:
- Browse all shops grouped floor-wise (Floor 0 to Floor 10)
- Filter products by **category** (like Food, Electronics) or **floor**
- Compare two products side by side (price, features, image)
- Add items to cart and checkout
- Choose **Cash on Delivery** or simulated Razorpay/GPay
- Track your order location on a map (📍Leaflet + OpenStreetMap)
- Submit and view product **reviews and ratings**

### 🧑‍💼 As a Merchant:
- Sign up securely using Firebase Authentication
- Register your shop with floor, name, and category
- Add products (with image, price, floor, category, etc.)
- Add special **offers** for your shop

---

🧱 Tech Stack I Used (Explained Simply)

🧑‍🎨 Frontend:
I used HTML, CSS, and JavaScript to build the full design and functionality of my Super Mall website. It’s simple, powerful, and gives full control to create what I want.

🔐 Login System:
I used Firebase Authentication so users and merchants can sign up and log in securely. I didn’t need to set up a backend — Firebase does all the hard work for me.

📦 Database:
For storing products, shops, offers, reviews, orders — I used Firebase Realtime Database. It updates instantly and works perfectly with my web app.

🗺️ Map Integration:
Instead of Google Maps (which asks for money and API keys 😤), I used Leaflet.js with OpenStreetMap — totally free and beginner-friendly!

"Google: Add a card to continue..."
Me: Bro I just want to show a map 😭

💳 Payment System:
I planned to use Razorpay, but they asked me for a business certificate — I’m just a student! So instead, I used a simulated payment method that mimics online payments using a simple popup. It works fine for testing and learning.

🌐 Testing:
I tested everything locally using the Live Server extension in VS Code — it reloads fast and doesn’t need any extra setup.

☁️ Hosting:
When I want to show it to others, I use Firebase Hosting or GitHub Pages to make it live online.


---

## 🔗 Firebase Structure I Designed

/shops → All registered shops
/products → Products added by merchants
/offers → Offers by shop owners
/orders → Orders placed by users
/reviews → Reviews submitted by users


---

## ▶️ How to Run This Project

### 🧪 If You’re Testing Locally:
1. Open this project folder in VS Code
2. Right-click on `index.html` → **Open with Live Server**
3. Make sure your internet is ON (Firebase + Map requires it)
4. Now explore like a real mall 😄

### ☁️ If You’re Using Online Hosting:
✅ GitHub Pages:
Go to my GitHub repo (you’ll find the link in the top of the README)

Click on the “Visit Site” link or go to the GitHub Pages URL
Example: https://yourusername.github.io/super-mall-app/

Boom! The mall is live 🎉

✅ Firebase Hosting:
I also deployed it on Firebase Hosting — it connects perfectly with my Firebase database and authentication.

Just visit the link I shared (something like https://supermallapp-439f7.web.app)

All real-time data (products, shops, offers, orders) works here 🛍️
---

## 🖼️ Screenshots 
- Homepage with mall animation
- Product comparison
- Add to cart and checkout
- Location on map

---

## 🎯 What I Learned from This Project

This was my biggest and most complete project so far!  
I learned how to:

- Use Firebase for storing data and handling login
- Use **Leaflet** for free and fast maps (no API key needed)
- Create features like:
  - Cart system
  - Reviews and ratings
  - Dynamic offers
  - Product filters
- And build a professional-looking web app step by step 💪

---

## 👨‍💻 Made by

**Chandan Kumar**  
A beginner web developer learning by building cool, real-world projects ❤️

---

## 💬 Bonus Tip (for reviewers)
> This project is fully responsive and uses Firebase Realtime Database, making it perfect for beginners who want to understand how front-end and back-end connect in a real web app.
