import { ieltsTask2 } from "@/exams/ielts-task2";
import type { Criterion, Rubric } from "@/exams/types";
import { examSpec, type TaskType } from "@/lib/levels";
import { precheck, type Precheck } from "./prechecks";
import { applyCaps, taskBand } from "./rules";

/**
 * Assessment of a Response against its Task Type's Rubric.
 * Deterministic rules (prechecks, caps, aggregation) live here; judgement per Criterion is delegated to a Judge.
 */

const RUBRICS: Partial<Record<TaskType, Rubric>> = { "ielts-task2": ieltsTask2 };

export const rubricFor = (taskType: TaskType) => RUBRICS[taskType] ?? null;

export type Facts = Precheck & { minWords: number };

export type JudgeRequest = { rubric: Rubric; criterion: Criterion; prompt: string; response: string; facts: Facts };

/** Evidence comes before the Band on purpose: the judge commits to observations first. */
export type Judgement = {
  evidence: { quote: string; note: string }[];
  capsTriggered: string[];
  band: number;
  whyNotHigher: string;
  /** learner-facing explanation */
  comment: string;
};

export type Judge = (req: JudgeRequest) => Promise<Judgement>;

export type AssessedCriterion = {
  key: string;
  label: string;
  band: number;
  judgedBand: number;
  capsApplied: string[];
  evidence: Judgement["evidence"];
  whyNotHigher: string;
  comment: string;
};

export type Assessment = {
  exam: Rubric["exam"];
  taskType: TaskType;
  criteria: AssessedCriterion[];
  overall: number;
  facts: Facts;
};

export async function assess(
  input: { taskType: TaskType; prompt: string; response: string },
  deps: { judge: Judge },
): Promise<Assessment> {
  const rubric = rubricFor(input.taskType);
  if (!rubric) throw new Error(`No rubric for task type "${input.taskType}" yet`);

  const minWords = examSpec(input.taskType)?.minWords ?? 0;
  const facts: Facts = { ...precheck({ prompt: input.prompt, response: input.response, minWords }), minWords };

  if (facts.tooShortToRate) {
    // official rule: responses of 20 words or fewer are rated Band 1 on every Criterion
    const criteria = rubric.criteria.map((c) => ({
      key: c.key,
      label: c.label,
      band: 1,
      judgedBand: 1,
      capsApplied: [],
      evidence: [],
      whyNotHigher: "Responses of 20 words or fewer are rated Band 1.",
      comment: "The response is too short to assess. Write at least the minimum number of words.",
    }));
    return { exam: rubric.exam, taskType: input.taskType, criteria, overall: 1, facts };
  }

  const judgements = await Promise.all(
    rubric.criteria.map((criterion) => deps.judge({ rubric, criterion, prompt: input.prompt, response: input.response, facts })),
  );
  const byKey = Object.fromEntries(rubric.criteria.map((c, i) => [c.key, judgements[i]]));

  const codeCaps = [...(facts.paragraphs <= 1 ? ["no-paragraphs"] : []), ...(facts.hasList ? ["list-in-places"] : [])];
  const scored = applyCaps(rubric, byKey, codeCaps);

  const criteria = scored.map((s, i) => ({
    ...s,
    label: rubric.criteria[i].label,
    evidence: judgements[i].evidence,
    whyNotHigher: judgements[i].whyNotHigher,
    comment: judgements[i].comment,
  }));
  return { exam: rubric.exam, taskType: input.taskType, criteria, overall: taskBand(scored.map((s) => s.band)), facts };
}
