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
  });
  
  