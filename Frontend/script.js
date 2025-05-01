document.addEventListener("DOMContentLoaded", () => {
  const leftZone = document.querySelector(".hover-zone.left");
  const rightZone = document.querySelector(".hover-zone.right");
  const body = document.body;

  // Homepage sliding effect
  if (body.classList.contains("homepage")) {
    leftZone.addEventListener("mouseenter", () => {
      body.classList.add("slide-left");
      body.classList.remove("slide-right");
    });

    leftZone.addEventListener("mouseleave", () => {
      body.classList.remove("slide-left");
    });

    rightZone.addEventListener("mouseenter", () => {
      body.classList.add("slide-right");
      body.classList.remove("slide-left");
    });

    rightZone.addEventListener("mouseleave", () => {
      body.classList.remove("slide-right");
    });
  }

  // Account dropdown toggle
  const dropdown = document.getElementById("accountDropdown");
  const wrapper = document.querySelector(".account-wrapper");

  document.querySelector(".account-icon").addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });

  window.addEventListener("click", function (e) {
    if (!wrapper.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });

  // Review modal logic
  const modal = document.getElementById("reviewModal");
  const openBtn = document.getElementById("openReviewBtn");
  const closeBtn = document.getElementById("closeReviewBtn");
  const popup = document.getElementById("thankYouPopup");
  const reviewSubmit = document.getElementById("submitReviewBtn");
  const ideaSubmit = document.getElementById("submitIdeaBtn");

  if (openBtn && modal) {
    openBtn.addEventListener("click", () => {
      modal.style.display = "block";
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  function showThankYouPopup() {
    if (!popup) return;
    popup.style.display = "block";
    setTimeout(() => {
      popup.style.display = "none";
    }, 3000);
  }

  if (reviewSubmit) {
    reviewSubmit.addEventListener("click", (e) => {
      e.preventDefault();
      modal.style.display = "none";
      showThankYouPopup();
    });
  }

  if (ideaSubmit) {
    ideaSubmit.addEventListener("click", () => {
      const ideaBox = document.getElementById("ideaInput");
      if (ideaBox && ideaBox.value.trim() !== "") {
        ideaBox.value = "";
        showThankYouPopup();
      }
    });
  }

  // 🌍 World Map Page Setup
  if (body.classList.contains("worldmap-page")) {
    const map = L.map('foodMap').setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    fetch('http://localhost:3000/api/origins')
      .then(res => res.json())
      .then(data => {
        data.forEach(item => {
          if (item.latitude && item.longitude) {
            const marker = L.marker([item.latitude, item.longitude]).addTo(map);

            marker.bindPopup(`<strong>${item.name}</strong><br>${item.origin_country}`);

            marker.on('click', () => {
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
              </div>
            `;            
            });
          }
        });
      })
      .catch(err => {
        console.error('Error fetching origin data:', err);
      });
  }
});
  
  