document.addEventListener("DOMContentLoaded", () => {
  const leftZone = document.querySelector(".hover-zone.left");
  const rightZone = document.querySelector(".hover-zone.right");
  const body = document.body;

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

    const coords = {
      'Brazil': [-14.2, -51.9],
      'Spain': [40.4, -3.7],
      'Peru': [-9.2, -75.0],
      'Colombia': [4.6, -74.1],
      'UK': [55.3, -3.4],
      'Canada': [56.1, -106.3],
      'China': [35.9, 104.2],
      'Vietnam': [14.1, 108.3],
      'France': [46.2, 2.2],
      'Indonesia': [-0.8, 113.9],
      'Greece': [39.1, 22.9],
      'Netherlands': [52.1, 5.2],
      'Cyprus': [35.1, 33.4],
      'India': [20.6, 78.9],
      'USA': [37.1, -95.7],
      'Mexico': [23.6, -102.5],
      'Australia': [-25.3, 133.8],
      'Egypt': [26.8, 30.8]
    };

    fetch('http://localhost:3000/api/origins')
      .then(res => res.json())
      .then(data => {
        data.forEach(item => {
          const location = coords[item.origin_country];
          if (location) {
            L.marker(location)
              .addTo(map)
              .bindPopup(`<strong>${item.name}</strong><br>${item.origin_country}`);
          }
        });
      })
      .catch(err => {
        console.error('Error fetching origin data:', err);
      });
  }
});



  
  