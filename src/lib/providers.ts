/** OpenAI-compatible providers. Shared by server (client construction) and settings UI (presets). */
export const PROVIDERS = {
  openai: { label: "OpenAI", baseURL: undefined, model: "gpt-5.5", fastModel: "gpt-5.5" },
  deepseek: { label: "DeepSeek", baseURL: "https://api.deepseek.com", model: "deepseek-v4-flash", fastModel: "deepseek-v4-flash" },
  custom: { label: "custom", baseURL: undefined, model: "", fastModel: "" },
} as const;
export type Provider = keyof typeof PROVIDERS;
export const isProvider = (v: unknown): v is Provider => typeof v === "string" && v in PROVIDERS;
