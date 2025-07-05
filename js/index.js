// Sticky navbar background change on scroll
window.addEventListener('scroll', function () {
  const nav = document.querySelector('nav');
  if (window.scrollY > 10) {
    nav.style.backgroundColor = '#2c3e50';
    nav.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.2)';
  } else {
    nav.style.backgroundColor = '#37475a';
    nav.style.boxShadow = 'none';
  }

  // Toggle scroll to top button
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (window.scrollY > 200) {
    scrollTopBtn.style.display = "block";
  } else {
    scrollTopBtn.style.display = "none";
  }
});

// Scroll to top action
document.getElementById("scrollTopBtn").addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
