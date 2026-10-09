import type { DatabaseSync } from "node:sqlite";
import curated from "../../data/bank/curated.json";

type BankEntry = {
  source?: string;
  taskType: string;
  level?: string;
  questionType?: string;
  tags: string[];
  prompt: string;
};

// Our own Prompts only; see docs/adr/0003-anchor-data-sources.md for why scraped sets are excluded.
const BANK: { entries: BankEntry[]; source: string }[] = [{ entries: curated, source: "curated" }];

const tidy = (s: string) => {
  const t = s.trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
};

/** Idempotently loads the prompt bank (data/bank) into the prompts table. */
export function seedBank(db: DatabaseSync) {
  const insert = db.prepare(
    `INSERT OR IGNORE INTO prompts (source, task_type, level, question_type, tags, prompt, created_at)
     VALUES (?, ?, ?, ?, ?, ?, unixepoch())`,
  );
  db.exec("BEGIN");
  try {
    for (const { entries, source } of BANK) {
      for (const e of entries) {
        insert.run(e.source ?? source, e.taskType, e.level ?? null, e.questionType ?? null, JSON.stringify(e.tags), tidy(e.prompt));
      }
    }
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}
