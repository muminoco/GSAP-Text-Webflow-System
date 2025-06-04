import { initializeTextAnimations } from "../animations/global/text.js";

function initializeMumino() {
  // Add a class to indicate JS is enabled
  document.documentElement.classList.add("js-enabled");

  // Initialize features
  initializeTextAnimations();
}

// Wait for both DOM and GSAP to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeMumino);
} else {
  initializeMumino();
}
