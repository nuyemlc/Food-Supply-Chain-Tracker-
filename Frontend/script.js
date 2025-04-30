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

  const writeReviewBtn = document.getElementById("writeReviewBtn");
  const reviewModal = document.getElementById("reviewModal");
  const reviewClose = document.getElementById("reviewClose");
  const thankYouPopup = document.getElementById("thankYouPopup");
  const submitReviewBtn = document.getElementById("submitReview");

  if (writeReviewBtn && reviewModal && reviewClose && submitReviewBtn && thankYouPopup) {
    writeReviewBtn.addEventListener("click", () => {
      reviewModal.style.display = "block";
    });

    reviewClose.addEventListener("click", () => {
      reviewModal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === reviewModal) {
        reviewModal.style.display = "none";
      }
    });

    submitReviewBtn.addEventListener("click", () => {
      reviewModal.style.display = "none";
      showThankYouPopup();
    });
  }

  const ideaForm = document.getElementById("ideaForm");
  if (ideaForm) {
    ideaForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showThankYouPopup();
      ideaForm.reset();
    });
  }

  function showThankYouPopup() {
    thankYouPopup.style.display = "block";
    setTimeout(() => {
      thankYouPopup.style.display = "none";
    }, 3000);
  }
});

  
  