import "server-only";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { seedBank } from "./bank-seed";
import { QUOTA_SCHEMA } from "./quota";
import { AUTH_LIMIT_SCHEMA } from "./auth-limit";

export const DATA_DIR = process.env.DATA_DIR ?? join(process.cwd(), "data");

const MIGRATIONS: string[] = [
  `
  CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    bio TEXT NOT NULL DEFAULT '',
    target_level TEXT NOT NULL DEFAULT 'B2',
    profile_public INTEGER NOT NULL DEFAULT 1,
    public_heatmap INTEGER NOT NULL DEFAULT 1,
    public_scores INTEGER NOT NULL DEFAULT 1,
    public_essays INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );
  CREATE TABLE user_settings (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    openai_key_enc TEXT,
    model TEXT NOT NULL DEFAULT 'gpt-5.5',
    fast_model TEXT NOT NULL DEFAULT 'gpt-5.5'
  );
  CREATE TABLE prompts (
    id INTEGER PRIMARY KEY,
    source TEXT NOT NULL,
    task_type TEXT NOT NULL,
    level TEXT,
    question_type TEXT,
    tags TEXT NOT NULL DEFAULT '[]',
    prompt TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
  CREATE INDEX prompts_type ON prompts(task_type, level);
  CREATE UNIQUE INDEX prompts_text ON prompts(prompt);
  CREATE TABLE tasks (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    prompt_id INTEGER REFERENCES prompts(id),
    task_type TEXT NOT NULL,
    level TEXT NOT NULL,
    title TEXT NOT NULL,
    prompt TEXT NOT NULL,
    tips TEXT NOT NULL DEFAULT '[]',
    min_words INTEGER NOT NULL,
    minutes INTEGER NOT NULL,
    draft TEXT NOT NULL DEFAULT '',
    draft_seconds INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE submissions (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    seconds INTEGER NOT NULL,
    word_count INTEGER NOT NULL,
    metrics TEXT NOT NULL,
    feedback TEXT,
    band REAL,
    cefr TEXT,
    error_count INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending',
    error TEXT,
    is_public INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  );
  CREATE INDEX submissions_user ON submissions(user_id, created_at);
  CREATE TABLE chat_messages (
    id INTEGER PRIMARY KEY,
    submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    blocked TEXT,
    created_at INTEGER NOT NULL
  );
  CREATE INDEX chat_submission ON chat_messages(submission_id, id);
  `,
  `
  ALTER TABLE user_settings ADD COLUMN provider TEXT NOT NULL DEFAULT 'openai';
  ALTER TABLE user_settings ADD COLUMN base_url TEXT;
  `,
  // the scraped HF prompt set is no longer shipped (ADR 0003); keep only rows old Tasks still point to
  `
  DELETE FROM prompts WHERE source LIKE 'hf:%' AND id NOT IN (SELECT prompt_id FROM tasks WHERE prompt_id IS NOT NULL);
  `,
  // Plans and Quota (ADR 0004): server pays for the model, learner keys are no longer kept
  `
  ALTER TABLE users ADD COLUMN plan TEXT NOT NULL DEFAULT 'free';
  ALTER TABLE submissions ADD COLUMN mode TEXT NOT NULL DEFAULT 'full';
  UPDATE user_settings SET openai_key_enc = NULL;
  ${QUOTA_SCHEMA}
  `,
  // sign-up and sign-in limits against account farming and password guessing
  AUTH_LIMIT_SCHEMA,
];

function open() {
  mkdirSync(DATA_DIR, { recursive: true });
  const db = new DatabaseSync(join(DATA_DIR, "app.db"));
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 3000;");
  const { user_version: version } = db.prepare("PRAGMA user_version").get() as { user_version: number };
  for (let i = version; i < MIGRATIONS.length; i++) {
    db.exec("BEGIN");
    try {
      db.exec(MIGRATIONS[i]);
      db.exec(`PRAGMA user_version = ${i + 1}`);
      db.exec("COMMIT");
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
  }
  seedBank(db);
  // analyses run in-process via after(), so any still pending at startup died with the previous process;
  // as errors they show the free retry instead of polling forever
  db.prepare("UPDATE submissions SET status = 'error', error = ? WHERE status = 'pending'").run(
    "The review was interrupted by a server restart. Run it again, it's free.",
  );
  return withPlainRows(db);
}

/**
 * node:sqlite returns rows with a null prototype, which React refuses to pass to
 * client components. Normalise every row to a plain object at the source.
 */
function withPlainRows(db: DatabaseSync) {
  const prepare = db.prepare.bind(db);
  const plain = (row: unknown) => (row && typeof row === "object" ? { ...row } : row);
  db.prepare = (sql: string) => {
    const st = prepare(sql);
    const get = st.get.bind(st);
    const all = st.all.bind(st);
    st.get = ((...args: Parameters<typeof get>) => plain(get(...args))) as typeof st.get;
    st.all = ((...args: Parameters<typeof all>) => all(...args).map(plain)) as typeof st.all;
    return st;
  };
  return db;
}

// Survive Next.js dev hot reloads without opening a new handle each time.
const g = globalThis as unknown as { __db?: DatabaseSync };
export const db: DatabaseSync = g.__db ?? (g.__db = open());

export const now = () => Math.floor(Date.now() / 1000);

export function tx<T>(fn: () => T): T {
  db.exec("BEGIN");
  try {
    const r = fn();
    db.exec("COMMIT");
    return r;
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}
