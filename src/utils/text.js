/**
 * Splits text into sentences on . ! ? boundaries.
 * Small chunks (<= minChunkLength) get merged into the previous sentence.
 */
export const splitIntoSentences=(text, minChunkLength = 4)=> {
  const chunks = String(text || "")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);

  const out = [];
  for (let s of chunks) {
    s = s.trim();
    if (!s) continue;

    if (out.length && s.length <= minChunkLength) {
      out[out.length - 1] += " " + s;
    } else {
      out.push(s);
    }
  }
  return out;
}
