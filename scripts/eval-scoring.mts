/**
 * Measures how well our Assessment agrees with human scores on Anchor Responses.
 *
 *   pnpm eval:scoring data/anchors/<file>.jsonl [--limit 50] [--label baseline]
 *
 * Anchor file: one JSON object per line
 *   { "id": "...", "taskType": "ielts-task2", "prompt": "...", "response": "...", "human": 4, "source": "DREsS" }
 * `human` is the corpus's own holistic score; corpora use their own scales, so we report ranking and
 * agreement after a linear fit (see src/lib/assess/eval-metrics.ts). Calls a paid API: run on purpose.
 *
 * Env: EVAL_API_KEY (or OPENAI_API_KEY), EVAL_PROVIDER=openai|deepseek|custom, EVAL_BASE_URL, EVAL_MODEL.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import OpenAI from "openai";
import { assess } from "@/lib/assess";
import { llmJudge } from "@/lib/assess/llm-judge";
import { summarize } from "@/lib/assess/eval-metrics";
import { isProvider, PROVIDERS } from "@/lib/providers";
import type { TaskType } from "@/lib/levels";

type Anchor = { id: string; taskType: TaskType; prompt: string; response: string; human: number; source: string };

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const flag = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
if (!file) {
  console.error("usage: pnpm eval:scoring <anchors.jsonl> [--limit N] [--label name]");
  process.exit(1);
}

const provider = isProvider(process.env.EVAL_PROVIDER) ? process.env.EVAL_PROVIDER : "openai";
const apiKey = process.env.EVAL_API_KEY ?? process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("Set EVAL_API_KEY (or OPENAI_API_KEY).");
  process.exit(1);
}
const preset = PROVIDERS[provider];
const model = process.env.EVAL_MODEL || preset.model;
const ai = {
  client: new OpenAI({ apiKey, baseURL: process.env.EVAL_BASE_URL || preset.baseURL, timeout: 180_000 }),
  provider,
  model,
  fastModel: model,
  strictSchemas: provider === "openai",
  moderationApi: false,
};

const anchors = readFileSync(file, "utf8")
  .split("\n")
  .filter((l) => l.trim())
  .map((l) => JSON.parse(l) as Anchor)
  .slice(0, Number(flag("limit") ?? Infinity));

const judge = llmJudge(ai);
const rows: { id: string; human: number; overall: number; criteria: Record<string, number> }[] = [];
for (const [i, a] of anchors.entries()) {
  try {
    const r = await assess({ taskType: a.taskType, prompt: a.prompt, response: a.response }, { judge });
    rows.push({ id: a.id, human: a.human, overall: r.overall, criteria: Object.fromEntries(r.criteria.map((c) => [c.key, c.band])) });
    process.stdout.write(`\r${i + 1}/${anchors.length}`);
  } catch (e) {
    console.error(`\n${a.id}: ${e instanceof Error ? e.message : e}`);
  }
}
console.log();

const human = rows.map((r) => r.human);
const report = {
  overall: summarize(rows.map((r) => r.overall), human),
  ...Object.fromEntries(Object.keys(rows[0]?.criteria ?? {}).map((k) => [k, summarize(rows.map((r) => r.criteria[k]), human)])),
};

const label = flag("label") ?? "run";
const date = new Date().toISOString().slice(0, 10);
const out = `docs/evals/${date}-${label}.md`;
const table = Object.entries(report)
  .map(([k, s]) => `| ${k} | ${s.n} | ${s.spearman} | ${s.maeAfterFit} | ${s.exactAfterFit} | ${s.adjacentAfterFit} | ${s.fit.slope.toFixed(2)} × band ${s.fit.intercept >= 0 ? "+" : "−"} ${Math.abs(s.fit.intercept).toFixed(2)} |`)
  .join("\n");
mkdirSync("docs/evals", { recursive: true });
writeFileSync(
  out,
  `# Scoring eval: ${label} (${date})

- Anchors: \`${file}\` (${rows.length} of ${anchors.length} scored)
- Provider / model: ${provider} / ${model}
- Human scores are the corpus's own holistic scale; metrics compare ranking and agreement after a linear fit.

| target | n | Spearman | MAE after fit | exact | ±1 | human ≈ |
|---|---|---|---|---|---|---|
${table}
`,
);
console.log(`wrote ${out}`);
console.table(Object.fromEntries(Object.entries(report).map(([k, s]) => [k, { n: s.n, spearman: s.spearman, mae: s.maeAfterFit }])));
