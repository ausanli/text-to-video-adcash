/**
 * Compute how long to hold text on screen based on its length.
 * @param {*} text
 * @param {{ baseHoldMs: number, msPerChar: number, maxHoldMs: number }} timing
 * @returns {number}
 */
export const computeHoldMs = (text, { baseHoldMs, msPerChar, maxHoldMs }) => {
  const textLength = text.length;
  const holdMs = baseHoldMs + textLength * msPerChar;
  return Math.min(holdMs, maxHoldMs);
};

/**
 * Sleep for a given time (respects optional stop check).
 * @param {number} delayMs
 * @param {() => boolean} [isStopped]
 * @returns {Promise<void>}
 */
export const sleep = (delayMs, isStopped) => {
  return new Promise((resolve) => {
    if (isStopped?.()) return resolve();

    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      resolve();
    }, Math.max(0, delayMs));
  });
};

/**
 * Smooth fade animation using requestAnimationFrame.
 * @param {{ from: number, to: number, durationMs: number, onFrame: (value: number) => void, isStopped?: () => boolean }} params
 * @returns {Promise<void>}
 */
export const animateFade = ({
  from,
  to,
  durationMs,
  onFrame,
  isStopped = () => false,
}) => {
  return new Promise((resolve) => {
    const startTime = performance.now();

    const step = (now) => {
      if (isStopped()) return resolve();

      const progress = Math.min((now - startTime) / durationMs, 1);
      const value = from + (to - from) * progress;

      onFrame(value);

      if (progress < 1) requestAnimationFrame(step);
      else resolve();
    };

    requestAnimationFrame(step);
  });
};
