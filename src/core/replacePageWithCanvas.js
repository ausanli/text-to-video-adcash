/**
 * Replaces the entire page content with a blank white page and centered canvas.
 * Returns the created canvas element.
 */
export const replacePageWithCanvas = (options) => {
  const { width, height, pageBg, canvasShadow, canvasRadius, pageMargin } =
    options;

  document.documentElement.innerHTML = "";

  const body = document.createElement("body");
  Object.assign(body.style, {
    margin: pageMargin,
    background: pageBg,
    display: "grid",
    placeItems: "center",
  });

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  Object.assign(canvas.style, {
    borderRadius: canvasRadius,
    boxShadow: canvasShadow,
  });

  body.appendChild(canvas);
  document.documentElement.appendChild(body);

  return canvas;
};
