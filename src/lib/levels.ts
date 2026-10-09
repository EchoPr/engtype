export const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type Level = (typeof LEVELS)[number];

export const TASK_TYPES = {
  "short-message": { label: "short message", exam: "general", levels: ["A1", "A2"] },
  email: { label: "email", exam: "general", levels: ["A2", "B1"] },
  "opinion-paragraph": { label: "opinion", exam: "general", levels: ["A2", "B1"] },
  story: { label: "story", exam: "general", levels: ["B1", "B2"] },
  "ielts-gt-letter": { label: "ielts letter", exam: "ielts", levels: ["B1", "B2", "C1"] },
  "ielts-task2": { label: "ielts essay", exam: "ielts", levels: ["B2", "C1", "C2"] },
  "toefl-discussion": { label: "toefl discussion", exam: "toefl", levels: ["B1", "B2", "C1"] },
  "toefl-email": { label: "toefl email", exam: "toefl", levels: ["B1", "B2", "C1"] },
  // retired by ETS on 2023-07-26; kept only so old Tasks still render (docs/research/toefl-writing.md)
  "toefl-independent": { label: "toefl essay (retired)", exam: "toefl", levels: [], retired: true },
} as const satisfies Record<string, { label: string; exam: string; levels: readonly Level[]; retired?: true }>;
export type TaskType = keyof typeof TASK_TYPES;

/** Word target and time limit per level; task types narrow it further. */
export const LEVEL_SPEC: Record<Level, { minWords: number; maxWords: number; minutes: number; description: string }> = {
  A1: { minWords: 40, maxWords: 60, minutes: 10, description: "very simple sentences about yourself and everyday things" },
  A2: { minWords: 70, maxWords: 100, minutes: 15, description: "short connected sentences on familiar topics, simple past and future" },
  B1: { minWords: 120, maxWords: 160, minutes: 20, description: "connected text on familiar topics, reasons and explanations for opinions" },
  B2: { minWords: 200, maxWords: 260, minutes: 35, description: "clear detailed argument, advantages and disadvantages of options" },
  C1: { minWords: 250, maxWords: 300, minutes: 40, description: "well-structured text on complex subjects, flexible and precise language" },
  C2: { minWords: 300, maxWords: 350, minutes: 45, description: "sophisticated argument, nuanced and idiomatic language, abstract topics" },
};

/**
 * Official length and time per exam Task Type (docs/research/ielts-writing.md, toefl-writing.md).
 * minWords 0 = the exam sets no minimum (TOEFL Write an Email).
 */
const EXAM_SPEC: Partial<Record<TaskType, { minWords: number; minutes: number }>> = {
  "ielts-gt-letter": { minWords: 150, minutes: 20 },
  "ielts-task2": { minWords: 250, minutes: 40 },
  "toefl-discussion": { minWords: 100, minutes: 10 },
  "toefl-email": { minWords: 0, minutes: 7 },
  "toefl-independent": { minWords: 300, minutes: 30 },
};

/** Exam Task Types always use the official spec; general-English ones scale with the Level. */
export function taskSpec(type: TaskType, level: Level) {
  const exam = EXAM_SPEC[type];
  if (exam) return exam;
  const base = LEVEL_SPEC[level];
  return { minWords: base.minWords, minutes: base.minutes };
}

/** Official spec of an exam Task Type, or null for general-English formats. */
export const examSpec = (type: TaskType) => EXAM_SPEC[type] ?? null;

export const offeredTaskTypes = (level: Level) =>
  (Object.keys(TASK_TYPES) as TaskType[]).filter((t) => (TASK_TYPES[t].levels as readonly Level[]).includes(level));

export function isLevel(v: unknown): v is Level {
  return typeof v === "string" && (LEVELS as readonly string[]).includes(v);
}
export function isTaskType(v: unknown): v is TaskType {
  return typeof v === "string" && v in TASK_TYPES;
}

export function defaultTaskType(level: Level): TaskType {
  const order: TaskType[] = ["ielts-task2", "toefl-discussion", "ielts-gt-letter", "opinion-paragraph", "email", "short-message"];
  return order.find((t) => (TASK_TYPES[t].levels as readonly Level[]).includes(level)) ?? "opinion-paragraph";
}
