import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDAmDD9JL4p6apWhKUkN-zNTBFtQZzHpUc",
  authDomain: "supermallapp-439f7.firebaseapp.com",
  databaseURL: "https://supermallapp-439f7-default-rtdb.firebaseio.com",
  projectId: "supermallapp-439f7",
  storageBucket: "supermallapp-439f7.appspot.com",
  messagingSenderId: "913726155207",
  appId: "1:913726155207:web:d73892c97507f046a011e2"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let map = L.map('map').setView([20.5937, 78.9629], 5); // Center of India
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let userMarker = null;
let shopMarkers = [];
let routeControl = null;

// ✅ User Location
navigator.geolocation.getCurrentPosition(position => {
  const userLatLng = [position.coords.latitude, position.coords.longitude];
  userMarker = L.marker(userLatLng, { title: "You", icon: blueIcon() }).addTo(map).bindPopup("Your Location").openPopup();
  map.setView(userLatLng, 13);
});

// ✅ Shop Loading
onValue(ref(db, "shops"), snapshot => {
  shopMarkers.forEach(m => map.removeLayer(m));
  shopMarkers = [];

  const data = snapshot.val();
  if (!data) return;

  Object.values(data).forEach(shop => {
    if (!shop.lat || !shop.lng) return;

    const marker = L.marker([shop.lat, shop.lng], {
      title: shop.shopName,
      icon: categoryIcon(shop.category)
    }).addTo(map);

    marker.shopData = shop;

    marker.bindPopup(`
      <b>${shop.shopName}</b><br>
      Floor: ${shop.floor}<br>
      Category: ${shop.category}<br>
      <button onclick="window.getRoute(${shop.lat}, ${shop.lng})">🧭 Get Directions</button>
    `);

    shopMarkers.push(marker);
  });

  applyFilter();
});

// ✅ Filter
document.getElementById("categoryFilter").addEventListener("change", applyFilter);
document.getElementById("floorFilter").addEventListener("change", applyFilter);

function applyFilter() {
  const selectedCat = document.getElementById("categoryFilter").value;
  const selectedFloor = document.getElementById("floorFilter").value;

  shopMarkers.forEach(marker => {
    const shop = marker.shopData;
    const catMatch = !selectedCat || shop.category === selectedCat;
    const floorMatch = !selectedFloor || shop.floor == selectedFloor;
    if (catMatch && floorMatch) {
      marker.addTo(map);
    } else {
      map.removeLayer(marker);
    }
  });
}

// ✅ Nearest
document.getElementById("locateBtn").addEventListener("click", () => {
  if (!userMarker) return alert("📍 User location not available.");

  let nearest = null;
  let shortest = Infinity;

  shopMarkers.forEach(marker => {
    const dist = map.distance(userMarker.getLatLng(), marker.getLatLng());
    if (dist < shortest) {
      shortest = dist;
      nearest = marker;
    }
  });

  if (nearest) {
    map.setView(nearest.getLatLng(), 16);
    nearest.openPopup();
  }
});

// ✅ Routing
window.getRoute = (lat, lng) => {
  if (!userMarker) return alert("📍 User location unknown");

  if (routeControl) map.removeControl(routeControl);

  routeControl = L.Routing.control({
    waypoints: [
      userMarker.getLatLng(),
      L.latLng(lat, lng)
    ],
    routeWhileDragging: false
  }).addTo(map);
};

// 🧩 Icons
function blueIcon() {
  return new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
}

function categoryIcon(category) {
  const colorMap = {
    grocery: "green",
    electronics: "blue",
    clothing: "orange",
    food: "red"
  };
  const color = colorMap[(category || "").toLowerCase()] || "purple";

  return new L.Icon({
    iconUrl: `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
}
