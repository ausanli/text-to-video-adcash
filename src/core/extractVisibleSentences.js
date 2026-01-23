import {
  normalizeWhitespace,
  isElementVisible,
  isInViewport,
  isInIgnoredContainer,
} from "../utils/dom";
import { splitIntoSentences } from "../utils/text";

/**
 * Extract readable sentences from the page from visible text blocks.
 * Returns sentences in DOM order.
 */
export const extractVisibleSentences = (options) => {
  const { viewportOnly, textSelectors, ignoreClosest, minSentenceChunkLength } =
    options;

  const pageRoot = document.body;

  const visibleTextBlocks = Array.from(pageRoot.querySelectorAll(textSelectors))
    .filter((element) => !isInIgnoredContainer(element, ignoreClosest))
    .filter((element) => (viewportOnly ? isInViewport(element) : true))
    .filter((element) => isElementVisible(element))
    .map((element) => normalizeWhitespace(element.innerText))
    .filter((textBlock) => textBlock.length > 0);

  const collectedSentences = [];

  for (const textBlock of visibleTextBlocks) {
    const sentenceChunks = splitIntoSentences(
      textBlock,
      minSentenceChunkLength
    );

    for (const sentence of sentenceChunks) {
      collectedSentences.push(sentence);
    }
  }

  return collectedSentences;
};
