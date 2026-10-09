/** Deterministic text statistics computed without a model. Safe to import on client and server. */

export type Metrics = {
  words: number;
  characters: number;
  sentences: number;
  paragraphs: number;
  uniqueWords: number;
  lexicalDiversity: number; // MTLD-like stable TTR (moving average over 50-word windows)
  avgSentenceLength: number;
  longestSentence: number;
  avgWordLength: number;
  longWordsShare: number; // words with 7+ letters
  linkingWords: number;
  readability: number; // Flesch reading ease
  wpm: number;
  seconds: number;
  topWords: { word: string; count: number }[];
};

const WORD_RE = /[A-Za-z]+(?:['’][A-Za-z]+)*/g;

const STOP = new Set(
  "a an the and or but if so of to in on at for with from by as is are was were be been being am i you he she it we they me him her us them my your his its our their this that these those there here not no do does did have has had will would can could should may might must than then too very just also".split(
    " ",
  ),
);

const LINKERS = [
  "however", "moreover", "furthermore", "therefore", "consequently", "nevertheless", "in addition", "on the other hand",
  "for example", "for instance", "in conclusion", "to sum up", "firstly", "secondly", "finally", "although", "whereas",
  "as a result", "in contrast", "despite", "because", "since", "while", "overall", "in my opinion", "to begin with",
];

export function words(text: string): string[] {
  return text.match(WORD_RE) ?? [];
}

export function countWords(text: string) {
  return words(text).length;
}

function syllables(word: string) {
  const w = word.toLowerCase().replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  return Math.max(1, (w.match(/[aeiouy]{1,2}/g) ?? []).length);
}

function stableTtr(ws: string[]) {
  if (ws.length < 50) return ws.length ? new Set(ws).size / ws.length : 0;
  let sum = 0;
  let n = 0;
  for (let i = 0; i + 50 <= ws.length; i += 10) {
    sum += new Set(ws.slice(i, i + 50)).size / 50;
    n++;
  }
  return sum / n;
}

export function computeMetrics(text: string, seconds: number): Metrics {
  const ws = words(text);
  const lower = ws.map((w) => w.toLowerCase());
  const sentences = text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => countWords(s) > 0);
  const sentenceLens = sentences.map(countWords);
  const paragraphs = text.split(/\n\s*\n|\n/).filter((p) => p.trim()).length;
  const syl = ws.reduce((s, w) => s + syllables(w), 0);
  const lowerText = ` ${lower.join(" ")} `;
  const freq = new Map<string, number>();
  for (const w of lower) if (!STOP.has(w) && w.length > 2) freq.set(w, (freq.get(w) ?? 0) + 1);

  const n = ws.length || 1;
  const sc = sentences.length || 1;
  return {
    words: ws.length,
    characters: text.length,
    sentences: sentences.length,
    paragraphs,
    uniqueWords: new Set(lower).size,
    lexicalDiversity: round(stableTtr(lower), 2),
    avgSentenceLength: round(ws.length / sc, 1),
    longestSentence: Math.max(0, ...sentenceLens),
    avgWordLength: round(ws.reduce((s, w) => s + w.length, 0) / n, 1),
    longWordsShare: round(ws.filter((w) => w.length >= 7).length / n, 2),
    linkingWords: LINKERS.reduce((s, l) => s + (lowerText.split(` ${l} `).length - 1), 0),
    readability: ws.length ? round(206.835 - 1.015 * (ws.length / sc) - 84.6 * (syl / n), 0) : 0,
    wpm: seconds >= 30 ? round(ws.length / (seconds / 60), 1) : 0, // too short a session to be meaningful
    seconds,
    topWords: [...freq.entries()]
      .filter(([, c]) => c > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word, count]) => ({ word, count })),
  };
}

function round(v: number, d: number) {
  const f = 10 ** d;
  return Math.round(v * f) / f;
}
