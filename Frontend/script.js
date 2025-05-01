document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // Homepage sliding hover zones
  const leftZone = document.querySelector(".hover-zone.left");
  const rightZone = document.querySelector(".hover-zone.right");
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
  window.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });

  // World Map Page: Plot food data on map
  if (body.classList.contains("worldmap-page")) {
    const map = L.map("foodMap").setView([20, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    fetch("http://localhost:3000/api/origins")
      .then((res) => res.json())
      .then((data) => {
        data.forEach((item) => {
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

  // Product List Page: Load foods into category tables and show modal
  if (body.classList.contains("productlist-page")) {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => {
        data.forEach((item) => {
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
            document.getElementById(targetTable).appendChild(row);
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

  // Compare Emissions Page: Modal selection and Chart.js logic
  if (body.classList.contains("compare-page")) {
    const modal = document.getElementById("compareSelectModal");
    const closeModal = document.getElementById("closeCompareModal");
    const chartCanvas = document.getElementById("emissionsChart");
    let chartInstance = null;
    const selectedFoods = [];

    // Open modal when clicking either box
    document.querySelectorAll(".emission-box").forEach((box) => {
      box.addEventListener("click", () => {
        modal.style.display = "block";
      });
    });

    closeModal?.addEventListener("click", () => {
      modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });

    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const categoryMap = {
          Meats: "compareMeats",
          Starch: "compareStarch",
          Dairy: "compareDairy",
          "Vegetables & Fruits": "compareVegFruit",
        };

        data.forEach((item) => {
          const tableId = categoryMap[item.category];
          if (!tableId) return;

          const row = document.createElement("tr");
          row.innerHTML = `<td>${item.name}</td>`;
          row.style.cursor = "pointer";

          row.addEventListener("click", () => {
            if (selectedFoods.length >= 2) selectedFoods.shift();
            selectedFoods.push(item);
            if (selectedFoods.length === 2) {
              drawChart(selectedFoods);
              modal.style.display = "none";
            }
          });

          document.getElementById(tableId)?.appendChild(row);
        });
      });

    function drawChart(foods) {
      const labels = foods.map((f) => f.name);
      const values = foods.map((f) => parseFloat(f.co2_emissions || 0));

      if (chartInstance) chartInstance.destroy();

      chartInstance = new Chart(chartCanvas, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "CO₂ Emissions (kg per kg)",
              data: values,
              backgroundColor: ["#ff7f0e", "#1f77b4"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              suggestedMax: 50,
              title: {
                display: true,
                text: "kg CO₂ per kg",
              },
            },
          },
        },
      });
    }
  }
});
