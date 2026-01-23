export const config = {
  extract: {
    /**
     * Extract only elements that intersect the viewport.
     * Matches your current behavior.
     */
    viewportOnly: true,

    /**
     * CSS selector list to collect readable text blocks.
     */
    textSelectors: "p,h1,h2,h3,h4,h5,h6,li,blockquote",

    /**
     * Ignore text inside these containers / roles.
     */
    ignoreClosest:
      "nav,footer,aside,[role='navigation'],[role='banner'],[role='contentinfo'],[role='complementary']",

    /**
     * If a split chunk is <= this length, it is merged into previous sentence.
     */
    minSentenceChunkLength: 4,

    /**
     * How many sentences to show
     */
    count: 3,
  },

  /**
     * CSS for canvas
     */
  canvas: {
    width: 1280,
    height: 720,
    pageBg: "#fff",
    canvasShadow: "0 10px 60px rgba(0,0,0,0.16)",
    canvasRadius: "15px",
    pageMargin: "50px",
  },

   /**
     * CSS for text inside the canvas
     */
  animation: {
    font: "44px Arial",
    textColor: "#111",
    bgColor: "#fff",
    lineHeightPx: 56,
    maxTextWidthRatio: 0.82,

    fadeMs: 450,
    baseHoldMs: 900,
    msPerChar: 45,
    maxHoldMs: 5500,
  },

  /**
     * Configuration for recording of the canvas video
     */
  recording: {
    enabled: true,
    filename: "page-content-animation.webm",
    fps: 30,
    bitsPerSecond: 6_000_000,
    timesliceMs: 250,

    ui: {
      buttonText: "Download video",
      position: "bottom",
    },
  },
};
