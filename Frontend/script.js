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
});


  
  