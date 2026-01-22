// src/core/recordCanvasWithDownload.js

/**
 * Record a canvas while `play()` runs, then enable a download button for the result.
 * UI is placed ABSOLUTELY over the canvas (top-center).
 *
 * Usage:
 *   recordCanvasWithDownload(canvas, cfg.recording, play)
 */
export function recordCanvasWithDownload(canvas, recordingCfg, play) {
  if (!canvas) throw new Error("recordCanvasWithDownload: canvas required");
  if (typeof play !== "function")
    throw new Error("recordCanvasWithDownload: play must be a function");
  if (!window.MediaRecorder)
    throw new Error("MediaRecorder is not supported in this browser.");
  if (!canvas.captureStream)
    throw new Error("canvas.captureStream() is not supported in this browser.");

  const {
    filename = "page-sentences.webm",
    fps = 30,
    bitsPerSecond = 6_000_000,
    timesliceMs = 250,
    ui = { buttonText: "Download video" },
  } = recordingCfg || {};

  const mimeType = pickMimeType([
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ]);

  const uiEl = createUI({ buttonText: ui.buttonText || "Download video" });

  // Place UI over the canvas (absolute positioning)
  const parent = canvas.parentElement || document.body;
  if (getComputedStyle(parent).position === "static") {
    parent.style.position = "relative";
  }
  parent.appendChild(uiEl.root);

  // --- recorder
  const stream = canvas.captureStream(fps);
  const chunks = [];

  let recorder;
  try {
    recorder = new MediaRecorder(stream, {
      mimeType: mimeType || undefined,
      bitsPerSecond,
    });
  } catch {
    recorder = new MediaRecorder(stream, { bitsPerSecond });
  }

  let downloadUrl = null;
  let stopped = false;

  function safeStop() {
    if (stopped) return;
    stopped = true;

    try {
      if (recorder.state !== "inactive") recorder.stop();
    } catch {}

    // Stop tracks shortly after stopping recorder
    setTimeout(() => {
      try {
        stream.getTracks().forEach((t) => t.stop());
      } catch {}
    }, 0);
  }

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  recorder.onerror = (e) => {
    console.error("MediaRecorder error:", e);
    uiEl.setStatus("Recording error.");
    safeStop();
  };

  recorder.onstop = () => {
    if (!chunks.length) {
      uiEl.setStatus("Recording finished (no data captured).");
      return;
    }

    const type = recorder.mimeType || "video/webm";
    const blob = new Blob(chunks, { type });
    downloadUrl = URL.createObjectURL(blob);

    uiEl.setStatus("Recording finished.");
    uiEl.enableDownload(() => download(downloadUrl, filename));
  };

  // Start recording
  uiEl.setStatus("Recording…");
  try {
    recorder.start(timesliceMs);
  } catch {
    recorder.start();
  }

  // Run animation, then stop recording
  Promise.resolve()
    .then(() => play())
    .then(() => {
      uiEl.setStatus("Finalizing video…");
      safeStop();
    })
    .catch((err) => {
      console.error("play() failed:", err);
      uiEl.setStatus("Animation error. Finalizing…");
      safeStop();
    });

  return {
    cleanup() {
      safeStop();
      try {
        uiEl.root.remove();
      } catch {}
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    },
  };
}

/* ---------------- helpers ---------------- */

function pickMimeType(candidates) {
  const can = window.MediaRecorder?.isTypeSupported?.bind(window.MediaRecorder);
  if (!can) return "";
  return candidates.find((t) => can(t)) || "";
}

function createUI({ buttonText }) {
  const root = document.createElement("div");
  Object.assign(root.style, {
    position: "absolute",
    top: "14px",
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
    setStatus(text) {
      status.textContent = text;
    },
    enableDownload(onClick) {
      button.disabled = false;
      button.style.opacity = "1";
      button.onclick = onClick;
    },
  };
}

function download(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
