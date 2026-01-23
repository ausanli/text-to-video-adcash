/**
 * Creates a small overlay UI on top of the canvas that shows recording status
 * and enables a download button when recording finishes.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {{ filename: string, ui: { buttonText: string } }} cfg
 * @param {() => (Promise<{url: string|null} | null>)} startRecording
 */
export const createRecordingDownloadController = (
  canvas,
  cfg,
  startRecording
) => {
  const { filename, ui } = cfg;

  const uiEl = createOverlayDownloadUI({
    buttonText: ui.buttonText,
  });

  const parent = canvas.parentElement || document.body;
  if (getComputedStyle(parent).position === "static") {
    parent.style.position = "relative";
  }
  parent.appendChild(uiEl.root);

  uiEl.setStatus("Recording…");

  Promise.resolve()
    .then(() => startRecording())
    .then((handle) => {
      if (!handle?.url) {
        uiEl.setStatus("Recording finished (no data captured).");
        return;
      }
      uiEl.setStatus("Recording finished.");
      uiEl.enableDownload(() => triggerDownload(handle.url, filename));
    })
    .catch((err) => {
      console.error("Recording error:", err);
      uiEl.setStatus("Recording error.");
    });
};

/**
 * Triggers a browser download for a given URL using a temporary <a> element.
 * @param {string} url
 * @param {string} filename
 */
const triggerDownload = (url, filename) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

/**
 * Builds the overlay UI element (status text + disabled download button).
 * @param {{ buttonText: string }} params
 * @returns {{
*   root: HTMLDivElement,
*   setStatus: (text: string) => void,
*   enableDownload: (onClick: () => void) => void
* }}
*/
const createOverlayDownloadUI = ({ buttonText }) => {
  const root = document.createElement("div");
  Object.assign(root.style, {
    position: "absolute",
    bottom: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: "2147483647",
    display: "flex",
    gap: "10px",
    alignItems: "center",
    padding: "10px 12px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.92)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.14)",
    backdropFilter: "blur(6px)",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
  });

  const status = document.createElement("span");
  status.textContent = "Recording…";
  Object.assign(status.style, { fontSize: "14px", color: "#111" });

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = buttonText;
  button.disabled = true;
  Object.assign(button.style, {
    border: "0",
    borderRadius: "10px",
    padding: "10px 12px",
    cursor: "pointer",
    fontSize: "14px",
    background: "#111",
    color: "#fff",
    opacity: "0.45",
  });

  root.appendChild(status);
  root.appendChild(button);

  return {
    root,
    setStatus: (text) => {
      status.textContent = text;
    },
    enableDownload: (onClick) => {
      button.disabled = false;
      button.style.opacity = "1";
      button.onclick = onClick;
    },
  };
};
