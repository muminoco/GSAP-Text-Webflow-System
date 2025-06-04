// Core text animation system
import { createScrollTrigger } from "../utils/scrollTriggers.js";
import { splitTextForAnimation, SPLIT_TYPES } from "../utils/textSplitter.js";

// Animation selectors
const animationAttributeName = "data-text-ani";
const delayAttributeName = "data-text-ani-delay";

// Check if GSAP is available
function isGSAPAvailable() {
  return typeof gsap !== "undefined" && typeof SplitText !== "undefined";
}

// Check for reduced motion preference
function hasReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Handle GSAP loading and error cases
function handleGSAPLoading() {
  // If GSAP is not available, show all elements immediately
  if (!isGSAPAvailable()) {
    document
      .querySelectorAll(`[${animationAttributeName}]`)
      .forEach((element) => {
        element.style.opacity = "1";
      });
    console.warn(
      "GSAP or SplitText plugin not loaded. Text animations disabled."
    );
    return false;
  }
  return true;
}

/**
 * Animation definitions with selectors and animation functions
 * Single source of truth for all text animations
 */
export const animations = {
  // Title animations
  title: {
    selector: `[${animationAttributeName}="title"]`,
    animate: (element, delay = 0) => {
      const split = splitTextForAnimation(element, [
        SPLIT_TYPES.CHARS,
        SPLIT_TYPES.WORDS,
      ]);

      createBaseAnimation(element, (target, tl) => {
        tl.from(split.chars, {
          scale: 1.3,
          opacity: 0,
          filter: "blur(6px)",
          duration: 1.25,
          delay,
          stagger: { each: 0.04, from: "center" },
          ease: "power1.out",
          onComplete: () => split.revert(), // Restores original innerHTML
        });
      });
    },
  },

  // Heading cinematic - dramatic zoom with depth and blur
  heading: {
    selector: `[${animationAttributeName}="heading"]`,
    animate: (element, delay = 0) => {
      const split = splitTextForAnimation(element, [
        SPLIT_TYPES.CHARS,
        SPLIT_TYPES.WORDS,
      ]);

      createBaseAnimation(element, (target, tl) => {
        tl.from(split.chars, {
          scale: 1.2,
          opacity: 0,
          filter: "blur(3px)",
          duration: 1.2,
          delay,
          stagger: { each: 0.03, from: "left" },
          ease: "power2.out",
          onComplete: () => split.revert(), // Restores original innerHTML
        });
      });
    },
  },

  // Paragraph animations
  paragraph: {
    selector: `[${animationAttributeName}="paragraph"]`,
    animate: (element, delay = 0) => {
      const split = splitTextForAnimation(
        element,
        [SPLIT_TYPES.LINES, SPLIT_TYPES.WORDS],
        {
          mask: "lines",
          autoSplit: true,
        }
      );

      createBaseAnimation(element, (target, tl) => {
        tl.from(split.lines, {
          yPercent: 50,
          opacity: 0,
          duration: 0.75,
          stagger: 0.1,
          delay: 0.5,
          ease: "power1.out",
          onComplete: () => split.revert(), // Restores original innerHTML
        });
      });
    },
  },

  eyebrow: {
    selector: `[${animationAttributeName}="eyebrow"]`,
    animate: (element, delay = 0) => {
      const split = splitTextForAnimation(element, [
        SPLIT_TYPES.CHARS,
        SPLIT_TYPES.WORDS,
      ]);

      createBaseAnimation(element, (target, tl) => {
        tl.from(split.chars, {
          yPercent: 10,
          opacity: 0,
          duration: 0.3,
          delay: 0.25,
          ease: "power1.out",
          onComplete: () => split.revert(), // Restores original innerHTML
        });
      });
    },
  },

  // Add new animation types here (example commented out)
  // button: {
  //   selector: `[${animationAttributeName}="button"]`,
  //   animate: (element, delay = 0) => {
  //     createBaseAnimation(element, (target, tl) => {
  //       tl.from(target, {
  //         scale: 0.9,
  //         opacity: 0,
  //         duration: 0.75,
  //         delay,
  //         ease: "back.out(1.7)",
  //       });
  //     });
  //   }
  // },
};

/**
 * Get animation delay from element's data-text-ani-delay attribute
 * @param {HTMLElement} element - Target element
 * @returns {number} Delay in seconds (0 if no delay set)
 */
function getDelay(element) {
  if (!element.hasAttribute(delayAttributeName)) return 0;

  const delay = element.getAttribute(delayAttributeName);
  const delayNumber = parseInt(delay);
  if (isNaN(delayNumber)) return 0;

  return delayNumber / 1000;
}

/**
 * Base animation function that sets up common properties
 * @param {HTMLElement} element - Target element
 * @param {function} animationCallback - Timeline creation function
 */
function createBaseAnimation(element, animationCallback) {
  gsap.set(element, { opacity: 1 });
  /* Required if CSS sets opacity to 0 to prevent FOUC */
  const target = element;
  const tl = gsap.timeline({ paused: true });
  createScrollTrigger(target, tl);
  animationCallback(target, tl);
}

/**
 * Run all text animations
 * Includes error handling for missing selectors
 */
export function runTextAnimations() {
  // Skip animations if reduced motion is preferred
  if (hasReducedMotion()) {
    return;
  }

  try {
    // Loop through each animation type
    Object.entries(animations).forEach(([name, animationType]) => {
      try {
        const elements = document.querySelectorAll(animationType.selector);

        if (elements.length === 0) {
          return;
        }

        elements.forEach((element) => {
          try {
            const delay = getDelay(element);
            animationType.animate(element, delay);
          } catch (elementError) {
            console.warn(`Error animating ${name} element:`, elementError);
          }
        });
      } catch (typeError) {
        console.warn(`Error processing animation type "${name}":`, typeError);
      }
    });
  } catch (globalError) {
    console.error("Error in runTextAnimations:", globalError);
  }
}

/**
 * Initialize text animations
 * Call this function from the main JS file
 */
export function initializeTextAnimations() {
  if (hasReducedMotion()) {
    document
      .querySelectorAll(`[${animationAttributeName}]`)
      .forEach((element) => {
        element.style.opacity = "1";
      });
    return;
  }

  if (!handleGSAPLoading()) {
    return;
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.fonts.ready.then(() => {
      runTextAnimations();
    });
  });
}
