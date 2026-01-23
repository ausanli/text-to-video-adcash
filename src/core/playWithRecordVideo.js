import { playAnimationWithRecording } from "../utils/media";
import { createRecordingDownloadController } from "../utils/ui";

/**
 * Record a canvas while `play()`.
 */
export const playWithRecordVideo = (canvas, recordingCfg, play) => {
  const { filename, ui } = recordingCfg;

  const playAnimation = () =>
    playAnimationWithRecording(canvas, recordingCfg, play);

  createRecordingDownloadController(canvas, { filename, ui }, playAnimation);
};
