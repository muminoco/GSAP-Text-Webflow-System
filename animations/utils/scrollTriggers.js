// Universal configuration for all trigger types
const isMarkersOn = false;
const startScrollerPosition = "90%";

// Collection of different ScrollTrigger types
const triggerTypes = {
  // Default: Plays once when entering viewport
  // Ideal for one-time animations
  default: (triggerElement, timeline) => {
    return [
      ScrollTrigger.create({
        trigger: triggerElement,
        start: `top ${startScrollerPosition}`,
        end: "bottom top",
        markers: isMarkersOn,
        once: true,
        toggleActions: "play none none none",
        onEnter: () => timeline.play(),
      }),
    ];
  },

  // ReplayAlways: Resets when leaving viewport, plays when entering
  // For repeatable animations that reset on scroll up
  replayAlways: (triggerElement, timeline) => {
    return [
      // Reset animation when element leaves viewport from top
      ScrollTrigger.create({
        trigger: triggerElement,
        start: "top bottom",
        markers: isMarkersOn,
        onLeaveBack: () => {
          timeline.progress(0);
          timeline.pause();
        },
      }),
      // Play animation on viewport entry
      ScrollTrigger.create({
        trigger: triggerElement,
        start: `top ${startScrollerPosition}`,
        end: "bottom top",
        markers: isMarkersOn,
        onEnter: () => timeline.play(),
        onEnterBack: () => timeline.restart(),
      }),
    ];
  },

  // Scrub: Animation progress tied to scroll position
  // For parallax effects and scroll-following animations
  scrub: (triggerElement, timeline) => {
    return [
      ScrollTrigger.create({
        trigger: triggerElement,
        start: `top ${startScrollerPosition}`,
        end: "bottom top",
        markers: isMarkersOn,
        scrub: 1,
        animation: timeline,
      }),
    ];
  },

  // Pin: Element stays fixed while animation plays
  // For full-screen transitions and step-based animations
  pinned: (triggerElement, timeline) => {
    return [
      ScrollTrigger.create({
        trigger: triggerElement,
        start: `top ${startScrollerPosition}`,
        end: "+=100%",
        markers: isMarkersOn,
        pin: true,
        anticipatePin: 1,
        animation: timeline,
      }),
    ];
  },
};

// Main creation function that can use any trigger type
export function createScrollTrigger(
  triggerElement,
  timeline,
  type = "default"
) {
  const triggerFunction = triggerTypes[type];

  if (!triggerFunction) {
    console.error(`Invalid trigger type: ${type}`);
    return [];
  }

  return triggerFunction(triggerElement, timeline);
}

// Helper functions for common trigger types
export function createReplayAlwaysScrollTrigger(triggerElement, timeline) {
  return createScrollTrigger(triggerElement, timeline, "replayAlways");
}

export function createScrubScrollTrigger(triggerElement, timeline) {
  return createScrollTrigger(triggerElement, timeline, "scrub");
}

export function createPinnedScrollTrigger(triggerElement, timeline) {
  return createScrollTrigger(triggerElement, timeline, "pinned");
}
