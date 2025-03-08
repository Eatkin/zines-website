document.addEventListener("DOMContentLoaded", function () {
  let currentIndex = 0;

  const zinePage = document.getElementById("zinePage");
  const prevBtn = document.getElementById("prev-button");
  prevBtn.style.display = "none";
  const nextBtn = document.getElementById("next-button");

  const viewer = document.getElementById("viewer");
  const defaultZoom = 40;
  const zoomSlider = document.getElementById("zoomSlider");
  const zoomLabel = document.getElementById("zoomLabel");

  // Function to preload the next image (for dynamic preloading)
  const preloadedImages = [];
  function preloadNextImage(index) {
    // Avoid preloading if we're at the end of the pages
    if (index >= zinePages.length) return;

    // If the image is already preloaded, skip
    if (preloadedImages[index]) return;

    const img = new Image();
    img.src = `/api/image/${zinePages[index]}`;
    preloadedImages[index] = img;
  }

  // Function to update the displayed page
  function updatePage(index) {
    if (index >= 0 && index < zinePages.length) {
      // Fade out image during the transition
      zinePage.style.opacity = "0";

      // Set the source and fade in after a slight delay
      setTimeout(() => {
        // Set the source of the image to the preloaded image (if available)
        zinePage.src = preloadedImages[index]?.src || `/api/image/${zinePages[index]}`;
        zinePage.style.opacity = "1";  // Fade in
      }, 200);

      currentIndex = index;

      // Show/hide navigation buttons based on the current page
      prevBtn.style.display = index === 0 ? "none" : "block";
      nextBtn.style.display = index === zinePages.length - 1 ? "none" : "block";

      // Preload the next image (for smooth navigation)
      preloadNextImage(index + 1);
      // Preload prev image cause we have url params now
      preloadNextImage(index - 1);

      // Set url parameters to the current page
      window.history.replaceState({}, "", `?page=${index + 1}`);
    }
  }

  // Initial page load
  // Get URL parameters (if there are any)
  const urlParams = new URLSearchParams(window.location.search);
  const pageParam = urlParams.get("page");
  if (pageParam) {
    const pageIndex = parseInt(pageParam) - 1;
    if (pageIndex >= 0 && pageIndex < zinePages.length) {
      currentIndex = pageIndex;
    }
  }
  updatePage(currentIndex);

  // Navigation buttons
  prevBtn.addEventListener("click", () => updatePage(currentIndex - 1));
  nextBtn.addEventListener("click", () => updatePage(currentIndex + 1));

  // Swipe functionality
  const hammer = new Hammer(document.body);
  hammer.on("swipeleft", () => updatePage(currentIndex + 1));
  hammer.on("swiperight", () => updatePage(currentIndex - 1));

  // Keyboard navigation (left and right arrows)
  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      updatePage(currentIndex - 1);
    } else if (event.key === "ArrowRight") {
      updatePage(currentIndex + 1);
    } else if (event.key === "Escape") {
      window.location.href = "/";
    }
  });

  // Zoom functionality
  zoomSlider.addEventListener("input", function () {
    const zoomLevel = zoomSlider.value;

    // Update the viewer size
    viewer.style.width = `${defaultZoom * zoomLevel}%`;

    // Update the zoom level label
    if (zoomLevel == 0.1) {
      zoomLabel.textContent = "Seriously?";
    } else if (zoomLevel < 0.75) {
      zoomLabel.textContent = "Too Small to See";
    } else if (zoomLevel < 2) {
      zoomLabel.textContent = "Normal-ish";
    } else if (zoomLevel < 3) {
      zoomLabel.textContent = "Zoom In My Face";
    } else if (zoomLevel < 5) {
      zoomLabel.textContent = "MEGA ZOOM";
    } else {
      zoomLabel.textContent = "WHY ARE YOU LIKE THIS?";
    }
  });

  // Remove focus when mouse is released
  zoomSlider.addEventListener("mouseup", function () {
    zoomSlider.blur();
  });

  // Also, in case the user clicks elsewhere and you want it to lose focus:
  zoomSlider.addEventListener("mouseleave", function () {
    zoomSlider.blur();
  });
});
