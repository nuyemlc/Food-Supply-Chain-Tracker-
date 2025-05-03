document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // Homepage: Slide background image on hover over left/right zones
  const leftZone = document.querySelector(".hover-zone.left");
  const rightZone = document.querySelector(".hover-zone.right");
  if (body.classList.contains("homepage")) {
    leftZone?.addEventListener("mouseenter", () => {
      body.classList.add("slide-left");
      body.classList.remove("slide-right");
    });
    leftZone?.addEventListener("mouseleave", () => body.classList.remove("slide-left"));
    rightZone?.addEventListener("mouseenter", () => {
      body.classList.add("slide-right");
      body.classList.remove("slide-left");
    });
    rightZone?.addEventListener("mouseleave", () => body.classList.remove("slide-right"));
  }

  // Toggle account dropdown visibility
  const dropdown = document.getElementById("accountDropdown");
  const wrapper = document.querySelector(".account-wrapper");
  document.querySelector(".account-icon")?.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });
  window.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });

  // Handle login/register switching and form submission
  const authForm = document.getElementById("authForm");
  const toggleLink = document.getElementById("toggleAuth");
  const authButton = document.getElementById("authButton");
  const welcomeMessage = document.getElementById("welcomeMessage");
  let isLogin = false;

  toggleLink?.addEventListener("click", (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    document.getElementById("userName").style.display = isLogin ? "none" : "block";
    authButton.textContent = isLogin ? "Login" : "Register";
    toggleLink.textContent = isLogin ? "Register" : "Login";
  });

  authForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("userName").value.trim();
    const email = document.getElementById("userEmail").value.trim();
    const password = document.getElementById("userPassword").value.trim();

    const endpoint = isLogin ? "/api/login" : "/api/register";
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        welcomeMessage.textContent = `Hi, ${result.name || name}!`;
        welcomeMessage.style.display = "block";
        authForm.style.display = "none";
      } else {
        alert(result.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Auth error:", err);
      alert("Server error");
    }
  });

  // Automatically greet the logged-in user if session is active
  fetch("http://localhost:3000/api/user")
    .then((res) => res.json())
    .then((data) => {
      if (data.loggedIn) {
        welcomeMessage.textContent = `Hi, ${data.name}!`;
        welcomeMessage.style.display = "block";
        authForm.style.display = "none";
      }
    });

  // World Map page: Display markers and food info on map
  if (body.classList.contains("worldmap-page")) {
    const map = L.map("foodMap").setView([20, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    fetch("http://localhost:3000/api/origins")
      .then(res => res.json())
      .then(data => {
        data.forEach(item => {
          if (item.latitude && item.longitude) {
            const marker = L.marker([item.latitude, item.longitude]).addTo(map);
            marker.bindPopup(`<strong>${item.name}</strong><br>${item.origin_country}`);
            marker.on("click", () => {
              const infoBox = document.getElementById("foodInfo");
              infoBox.innerHTML = `
                <h4>${item.name}</h4>
                <div class="food-info-grid-horizontal">
                  <div><span>🌍 Country:</span> ${item.origin_country}</div>
                  <div><span>📦 Category:</span> ${item.category}</div>
                  <div><span>💨 CO₂:</span> ${item.co2_emissions} kg/kg</div>
                  <div><span>🌱 Organic:</span> ${item.organic}</div>
                  <div><span>✅ Ethical:</span> ${item.ethical}</div>
                  <div><span>🚚 Transport:</span> ${item.transport_method}</div>
                </div>`;
            });
          }
        });
      });
  }

  // Product List page: Table population and modal popups
  if (body.classList.contains("productlist-page")) {
    fetch("http://localhost:3000/api/products")
      .then(res => res.json())
      .then(data => {
        data.forEach(item => {
          const row = document.createElement("tr");
          row.innerHTML = `<td>${item.name}</td>`;
          row.addEventListener("click", () => {
            document.getElementById("productModalContent").innerHTML = `
              <h4>${item.name}</h4>
              <p><strong>Country:</strong> ${item.origin_country}</p>
              <p><strong>Category:</strong> ${item.category}</p>
              <p><strong>CO₂ Emissions:</strong> ${item.co2_emissions} kg per kg</p>
              <p><strong>Organic:</strong> ${item.organic}</p>
              <p><strong>Ethical:</strong> ${item.ethical}</p>
              <p><strong>Transport:</strong> ${item.transport_method}</p>`;
            document.getElementById("productModal").style.display = "block";
          });

          const targetTable = {
            "Meats": "meatsTable",
            "Starch": "starchTable",
            "Dairy": "dairyTable",
            "Vegetables & Fruits": "vegfruitTable",
          }[item.category];
          if (targetTable) {
            document.getElementById(targetTable)?.appendChild(row);
          }
        });
      });

    window.addEventListener("click", (e) => {
      if (e.target.id === "productModal") {
        e.target.style.display = "none";
      }
    });

    document.getElementById("closeProductModal")?.addEventListener("click", () => {
      document.getElementById("productModal").style.display = "none";
    });
  }

  // Also close product modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const modal = document.getElementById("productModal");
      if (modal.style.display === "block") {
        modal.style.display = "none";
      }
    }
  });

  // Homepage search functionality
  const searchInput = document.querySelector('.search-bar-home input');
  const searchResults = document.getElementById('searchResults');
  let allProducts = [];

  if (searchInput && searchResults) {
    fetch('http://localhost:3000/api/products')
      .then(res => res.json())
      .then(data => allProducts = data);

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      searchResults.innerHTML = '';
      if (!query) {
        searchResults.style.display = 'none';
        return;
      }

      const filtered = allProducts.filter(item => item.name.toLowerCase().includes(query));

      if (filtered.length === 0) {
        searchResults.innerHTML = '<div>No results found</div>';
      } else {
        filtered.forEach(item => {
          const div = document.createElement('div');
          div.textContent = `${item.name} - ${item.origin_country}`;
          div.addEventListener('click', () => {
            const modalContent = `
              <h4>${item.name}</h4>
              <p><strong>Country:</strong> ${item.origin_country}</p>
              <p><strong>Category:</strong> ${item.category}</p>
              <p><strong>CO₂ Emissions:</strong> ${item.co2_emissions} kg per kg</p>
              <p><strong>Organic:</strong> ${item.organic}</p>
              <p><strong>Ethical:</strong> ${item.ethical}</p>
              <p><strong>Transport:</strong> ${item.transport_method}</p>`;
            document.getElementById("productModalContent").innerHTML = modalContent;
            document.getElementById("productModal").style.display = "block";
            searchResults.style.display = 'none';
            searchInput.value = '';
          });
          searchResults.appendChild(div);
        });
      }
      searchResults.style.display = 'block';
    });

    document.addEventListener('click', e => {
      if (!searchResults.contains(e.target) && e.target !== searchInput) {
        searchResults.style.display = 'none';
      }
    });
  }

  // Reviews Page: Manage review and idea popup feedback
  if (body.classList.contains("reviews-page")) {
    const openReviewBtn = document.getElementById("openReviewBtn");
    const reviewModal = document.getElementById("reviewModal");
    const closeReviewBtn = document.getElementById("closeReviewBtn");
    const submitReviewBtn = document.getElementById("submitReviewBtn");
    const thankYouPopup = document.getElementById("thankYouPopup");

    openReviewBtn?.addEventListener("click", () => {
      reviewModal.style.display = "block";
    });

    closeReviewBtn?.addEventListener("click", () => {
      reviewModal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === reviewModal) {
        reviewModal.style.display = "none";
      }
    });

    submitReviewBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      reviewModal.style.display = "none";
      thankYouPopup.style.display = "block";
      setTimeout(() => {
        thankYouPopup.style.display = "none";
      }, 3000);
    });

    // Show popup after idea submission
    const submitIdeaBtn = document.getElementById("submitIdeaBtn");
    const ideaInput = document.getElementById("ideaInput");

    submitIdeaBtn?.addEventListener("click", () => {
      const ideaText = ideaInput.value.trim();
      if (!ideaText) return;
      ideaInput.value = "";
      thankYouPopup.style.display = "block";
      setTimeout(() => {
        thankYouPopup.style.display = "none";
      }, 3000);
    });
  }
});
