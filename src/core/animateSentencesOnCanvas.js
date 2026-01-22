import { sleep, animateFade, computeHoldMs } from "../utils/timing";

/**
 * Animate sentences on a canvas.
 */
export const animateSentencesOnCanvas = (canvas, sentences, options) => {
  const ctx = canvas.getContext("2d");
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const {
    font,
    textColor,
    bgColor,
    lineHeightPx,
    maxTextWidthRatio,
    fadeMs,
    baseHoldMs,
    msPerChar,
    maxHoldMs,
  } = options;

  /**
   * Wrap text into lines that fit maxWidth.
   * @param {string} text
   * @param {number} maxWidth
   * @returns {string[]}
   */
  const wrapLines = (text, maxWidth) => {
    const words = String(text).split(/\s+/);
    const lines = [];
    let currentLine = "";

    ctx.font = font;

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;

      if (ctx.measureText(testLine).width <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine) lines.push(currentLine);
    return lines;
  };

  /**
   * Draw a sentence frame.
   * @param {string} text
   * @param {number} opacity
   */
  const drawFrame = (text, opacity) => {
    ctx.globalAlpha = 1;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.globalAlpha = opacity;
    ctx.font = font;
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const lines = wrapLines(text, canvasWidth * maxTextWidthRatio);
    const startY =
      canvasHeight / 2 - ((lines.length - 1) * lineHeightPx) / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line, canvasWidth / 2, startY + index * lineHeightPx);
    });
  };

  /**
   * Animate a single sentence.
   * @param {string} sentence
   */
  const playSentence = async (sentence) => {
    const holdMs = computeHoldMs(sentence, {
      baseHoldMs,
      msPerChar,
      maxHoldMs,
    });

    await animateFade({
      from: 0,
      to: 1,
      durationMs: fadeMs,
      onFrame: (opacity) => drawFrame(sentence, opacity),
    });

    await sleep(holdMs);

    await animateFade({
      from: 1,
      to: 0,
      durationMs: fadeMs,
      onFrame: (opacity) => drawFrame(sentence, opacity),
    });
  };

  /**
   * Play all sentences in order.
   * @returns {Promise<void>}
   */
  return async () => {
    for (const sentence of sentences) {
      await playSentence(sentence);
    }
  };
};
