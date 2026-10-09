import { z } from "zod";
import { structured, type AiConfig } from "@/lib/llm";
import type { Judge } from "./index";
import { buildJudgePrompt } from "./judge-prompt";

// Field order matters: providers generate keys in schema order, so evidence is written before the Band.
const JudgementSchema = z.object({
  evidence: z.array(z.object({ quote: z.string(), note: z.string() })).describe("1-4 short exact quotes from the response"),
  capsTriggered: z.array(z.string()).describe("ids of caps that apply, or empty"),
  band: z.number().int().describe("whole Band"),
  whyNotHigher: z.string().describe("what is missing for the next Band up"),
  comment: z.string().describe("2-3 sentences for the learner"),
});

/** Production Judge: one structured LLM call per Criterion. */
export function llmJudge(ai: AiConfig): Judge {
  return async (req) => {
    const { instructions, input } = buildJudgePrompt(req);
    const r = await structured(ai, { instructions, input, schema: JudgementSchema, name: `judge_${req.criterion.key}` });
    if (!r) throw new Error(`The model returned no judgement for ${req.criterion.label}.`);
    return r;
  };
}
