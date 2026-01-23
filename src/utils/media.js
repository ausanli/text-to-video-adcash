
/**
 * Plays an animation while recording the provided `<canvas>` via `MediaRecorder`,
 * then returns a Promise that resolves with the resulting video Blob + object URL.
 *
 * @async
 * @param {HTMLCanvasElement} canvas - The canvas to record.
 * @param {Object} recordingConfig - Recording settings.
 * @returns {Promise<{blob: Blob|null, url: string|null}>} Resolves when recording stops.
 *
 */
export const playAnimationWithRecording = async (
  canvas,
  recordingConfig,
  play
) => {
  if (!window.MediaRecorder || !canvas.captureStream) {
    throw new Error("Recording is not supported in this browser.");
  }

  const { fps, bitsPerSecond, timesliceMs } = recordingConfig;

  const mimeType = pickMimeType([
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ]);

  const canvasStream = canvas.captureStream(fps);
  const recordedChunks = [];

  let mediaRecorder;
  try {
    mediaRecorder = new MediaRecorder(canvasStream, {
      mimeType,
      bitsPerSecond,
    });
  } catch {
    mediaRecorder = new MediaRecorder(canvasStream, { bitsPerSecond });
  }

  let hasStopped = false;
  const stopRecording = () => {
    if (hasStopped) return;
    hasStopped = true;

    if (mediaRecorder.state !== "inactive") mediaRecorder.stop();
    setTimeout(
      () => canvasStream.getTracks().forEach((track) => track.stop()),
      0
    );
  };

  const recordingFinished = new Promise((resolve, reject) => {
    mediaRecorder.ondataavailable = ({ data }) => {
      if (data?.size) recordedChunks.push(data);
    };

    mediaRecorder.onerror = (event) => {
      stopRecording();
      reject(event);
    };

    mediaRecorder.onstop = () => {
      if (!recordedChunks.length) return resolve({ blob: null, url: null });

      const blob = new Blob(recordedChunks, {
        type: mediaRecorder.mimeType || "video/webm",
      });
      resolve({ blob, url: URL.createObjectURL(blob) });
    };
  });

  try {
    mediaRecorder.start(timesliceMs);
  } catch {
    mediaRecorder.start();
  }

  try {
    await play();
  } catch (error) {
    console.error("play() failed:", error);
  } finally {
    stopRecording();
  }

  return recordingFinished;
};

/**
 * Picks the first supported MediaRecorder MIME type from a list of candidates.
 *
 * @param {string[]} candidates - MIME type strings to test.
 * @returns {string} The first supported MIME type, or an empty string if none are supported.
 */
const pickMimeType = (candidates) => {
  const can = window.MediaRecorder?.isTypeSupported?.bind(window.MediaRecorder);
  if (!can) return "";
  return candidates.find((t) => can(t)) || "";
};
