<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# How we work on engtype

The product goal is exam fidelity: Assessments must follow the official IELTS/TOEFL standards. Every change to scoring flows through this pipeline, each stage leaving an artifact the next one reads:

1. **Research** (`research` skill) → `docs/research/*.md`. Facts about exams come only from these files, each claim cited to a primary source; extend them before relying on a new fact.
2. **Language** (`domain-modeling` skill) → `CONTEXT.md` glossary and `docs/adr/`. Use the glossary's terms in code, prompts and UI; record hard-to-reverse decisions as ADRs.
3. **Design** (`codebase-design` skill): exam rules live as data in `src/exams/`, consumed by one deep assessment module.
4. **Build** (`tdd` skill): red → green at seams agreed with the user before writing tests.
5. **Eval**: scoring changes are proven by `pnpm eval:scoring` against Anchor Responses, with before/after results saved to `docs/evals/`. It calls a paid API, so it runs on request, not in CI.
6. **Review** (`code-review` skill) at the end of each slice.
