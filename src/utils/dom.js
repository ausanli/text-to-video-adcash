/**
 * Normalize whitespace in a string (collapse multiple spaces + trim).
 * @param {*} rawInput
 * @returns {string}
 */
export const normalizeWhitespace = (rawInput) => {
  return String(rawInput || "").replace(/\s+/g, " ").trim();
};

/**
 * Check if an element is inside a container that should be ignored.
 * @param {Element} element
 * @param {string} ignoreClosestSelector
 * @returns {boolean}
 */
export const isInIgnoredContainer = (element, ignoreClosestSelector) => {
  if (!ignoreClosestSelector) return false;
  return Boolean(element.closest(ignoreClosestSelector));
};

/**
 * Check if an element intersects the current viewport.
 * @param {Element} element
 * @returns {boolean}
 */
export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();

  return (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < window.innerHeight &&
    rect.left < window.innerWidth
  );
};

/**
 * Check if an element is visible (not hidden and not visually collapsed).
 * @param {Element} element
 * @returns {boolean}
 */
export const isElementVisible = (element) => {
  if (element.closest("[hidden], [aria-hidden='true']")) return false;

  const { display, visibility, opacity } = window.getComputedStyle(element);

  return (
    display !== "none" &&
    visibility !== "hidden" &&
    visibility !== "collapse" &&
    opacity !== "0"
  );
};
