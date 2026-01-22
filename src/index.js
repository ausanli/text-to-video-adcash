import { config } from "./config/config";
import { extractVisibleSentences } from "./core/extractVisibleSentences";
import { replacePageWithCanvas } from "./core/replacePageWithCanvas";
import { animateSentencesOnCanvas } from "./core/animateSentencesOnCanvas";
import { recordCanvasWithDownload } from "./core/recordCanvasWithDownload";

/**
 * Main runner.
 */
export const run = () => {
  const allSentences = extractVisibleSentences(config.extract);

  const sentences = config.extract.count
    ? allSentences.slice(0, config.extract.count)
    : allSentences;

  const canvas = replacePageWithCanvas(config.canvas);
  const play = animateSentencesOnCanvas(canvas, sentences, config.animation);
  if (config.recording.enabled) {
    recordCanvasWithDownload(canvas, config.recording, play);
  } else {
    play();
  }
};

run();
