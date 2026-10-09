import "server-only";
import OpenAI from "openai";
import { isProvider, PROVIDERS, type Provider } from "./providers";
import type { AiConfig } from "./llm";

export { isProvider, PROVIDERS, type Provider };
export { structured, complete, type AiConfig, type Msg } from "./llm";

/**
 * One model for the whole app, paid for by the server (ADR 0004). Configured only through env:
 * AI_PROVIDER (default deepseek), AI_API_KEY, AI_MODEL, AI_FAST_MODEL, AI_BASE_URL (custom provider).
 */

export class AiUnavailableError extends Error {
  constructor() {
    super("AI feedback is temporarily unavailable. Please try again later.");
  }
}

function apiKey(provider: Provider) {
  return process.env.AI_API_KEY || (provider === "deepseek" ? process.env.DEEPSEEK_API_KEY : process.env.OPENAI_API_KEY) || "";
}

const providerFromEnv = (): Provider => (isProvider(process.env.AI_PROVIDER) ? process.env.AI_PROVIDER : "deepseek");

let cached: AiConfig | null = null;

export function serverAi(): AiConfig {
  if (cached) return cached;
  const provider = providerFromEnv();
  const key = apiKey(provider);
  if (!key) throw new AiUnavailableError();
  const preset = PROVIDERS[provider];
  const model = process.env.AI_MODEL || preset.model;
  cached = {
    client: new OpenAI({
      apiKey: key,
      baseURL: process.env.AI_BASE_URL || preset.baseURL,
      timeout: 180_000,
      maxRetries: 2,
    }),
    provider,
    model,
    fastModel: process.env.AI_FAST_MODEL || preset.fastModel || model,
    strictSchemas: provider === "openai",
    moderationApi: provider === "openai",
  };
  return cached;
}

/** Whether the server has a model configured at all. */
export const aiReady = () => Boolean(apiKey(providerFromEnv()));

export function aiErrorMessage(e: unknown): string {
  if (e instanceof AiUnavailableError) return e.message;
  if (e instanceof OpenAI.APIError) {
    // provider problems are ours, not the learner's: keep details in the server log
    console.error("AI provider error", e.status, e.message);
    if (e.status === 429) return "The service is busy right now. Please try again in a minute.";
    return "AI feedback is temporarily unavailable. Please try again later.";
  }
  return e instanceof Error ? e.message : "Unknown error";
}
