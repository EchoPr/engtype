import type OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import type { Provider } from "./providers";

/** Model calls over any OpenAI-compatible API. No app state: usable from the server and from scripts. */

export type AiConfig = {
  client: OpenAI;
  provider: Provider;
  model: string;
  fastModel: string;
  /** strict json_schema structured outputs (OpenAI); others get json_object + validation */
  strictSchemas: boolean;
  /** OpenAI moderation endpoint is available */
  moderationApi: boolean;
};

export type Msg = { role: "system" | "user" | "assistant"; content: string };

/**
 * Structured output that works across OpenAI-compatible providers.
 * OpenAI: strict json_schema. Others (DeepSeek...): JSON mode with the schema in the
 * prompt, validated by zod, with one corrective retry.
 */
export async function structured<S extends z.ZodType>(
  ai: AiConfig,
  opts: { model?: string; instructions: string; input: string; schema: S; name: string },
): Promise<z.infer<S> | null> {
  const model = opts.model ?? ai.model;
  if (ai.strictSchemas) {
    const res = await ai.client.chat.completions.parse({
      model,
      messages: [
        { role: "system", content: opts.instructions },
        { role: "user", content: opts.input },
      ],
      response_format: zodResponseFormat(opts.schema, opts.name),
    });
    return (res.choices[0]?.message.parsed as z.infer<S> | null) ?? null;
  }

  const jsonSchema = JSON.stringify(z.toJSONSchema(opts.schema));
  const messages: Msg[] = [
    {
      role: "system",
      content: `${opts.instructions}

Respond with a single JSON object only (no markdown, no prose) that matches this JSON Schema exactly. Every property is required:
${jsonSchema}`,
    },
    { role: "user", content: opts.input },
  ];
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await ai.client.chat.completions.create({ model, messages, response_format: { type: "json_object" } });
    const text = res.choices[0]?.message.content ?? "";
    let parsed: unknown;
    try {
      parsed = JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, ""));
    } catch {
      parsed = undefined;
    }
    const check = opts.schema.safeParse(parsed);
    if (check.success) return check.data;
    messages.push(
      { role: "assistant", content: text },
      {
        role: "user",
        content: `That JSON does not match the schema: ${check.error ? z.prettifyError(check.error).slice(0, 800) : "invalid JSON"}. Return the corrected JSON object only.`,
      },
    );
  }
  return null;
}

/** Plain text completion. */
export async function complete(ai: AiConfig, opts: { model?: string; messages: Msg[] }): Promise<string> {
  const res = await ai.client.chat.completions.create({ model: opts.model ?? ai.model, messages: opts.messages });
  return res.choices[0]?.message.content?.trim() ?? "";
}
