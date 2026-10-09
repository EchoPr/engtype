import type { TaskType } from "@/lib/levels";

/** A point on a Rubric where a feature caps a Criterion's Band (bolded negative features in IELTS). */
export type Cap = {
  id: string;
  criterion: string;
  max: number;
  /** what triggers it, in our words */
  when: string;
  /** "code" caps come from prechecks; "model" caps are reported by the judge */
  check: "code" | "model";
  source: string;
};

export type Criterion = {
  key: string;
  label: string;
  /** what the Criterion assesses */
  assesses: string;
  /** our paraphrase of the Descriptor at each Band, as observable checks */
  bands: Record<number, string>;
  /** what separates adjacent Bands, keyed "5|6", "6|7", "7|8" */
  discriminators: Record<string, string>;
};

export type Rubric = {
  exam: "ielts" | "toefl";
  taskType: TaskType;
  scale: { min: number; max: number };
  criteria: Criterion[];
  caps: Cap[];
  /** general instructions every judgement follows */
  principles: string[];
  sources: Record<string, string>;
};
