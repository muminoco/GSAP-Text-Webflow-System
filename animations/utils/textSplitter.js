/**
 * Splits a text block for GSAP animations using SplitText.
 *
 * @param {HTMLElement|string} target
 *   - The DOM element (or selector string) whose text you want to split.
 * @param {string|string[]} types
 *   - One or more of 'lines', 'words', 'chars' (you can use SPLIT_TYPES.*, or your own lowercase strings).
 * @param {Object} [options={}]
 *   - Any other SplitText options (e.g., wordsClass, charsClass).
 * @returns {SplitText}
 *   - The SplitText instance for further animation.
 * @throws {Error}
 *   - If the element isn’t found or SplitText isn’t available.
 */
export const SPLIT_TYPES = {
  LINES: "lines",
  WORDS: "words",
  CHARS: "chars",
};

export function splitTextForAnimation(target, types, options = {}) {
  // Resolve the element (accept either a selector or an Element).
  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!el || !(el instanceof Element)) {
    throw new Error("splitTextForAnimation: element not found or invalid");
  }

  // Normalize types into a comma‑delimited string.
  // If types is already a string, assume it's something like "lines,words".
  // If it's an array, join it: ["lines","words"] -> "lines,words".
  const typeString = Array.isArray(types) ? types.join(",") : types;

  // If SplitText isn’t loaded, this will naturally throw—no need to wrap.
  return new SplitText(el, {
    ...options,
    type: typeString,
  });
}
