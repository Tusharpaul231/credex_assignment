
import { ToolDefinition, ToolKey } from "@/types";

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    key: "cursor",
    label: "Cursor",
    plans: [
      { value: "hobby",      label: "Hobby (Free)",  monthly: 0  },
      { value: "pro",        label: "Pro",            monthly: 20 },
      { value: "business",   label: "Business",       monthly: 40 },
      { value: "enterprise", label: "Enterprise",     monthly: 40 },
    ],
  },
  {
    key: "github_copilot",
    label: "GitHub Copilot",
    plans: [
      { value: "individual", label: "Individual",  monthly: 10 },
      { value: "business",   label: "Business",    monthly: 19 },
      { value: "enterprise", label: "Enterprise",  monthly: 39 },
    ],
  },
  {
    key: "claude",
    label: "Claude (Anthropic)",
    plans: [
      { value: "free",       label: "Free",                    monthly: 0   },
      { value: "pro",        label: "Pro",                     monthly: 20  },
      { value: "max_5x",     label: "Max (5x usage)",          monthly: 100 },
      { value: "max_20x",    label: "Max (20x usage)",         monthly: 200 },
      { value: "team",       label: "Team (per seat)",         monthly: 30  },
      { value: "enterprise", label: "Enterprise (per seat)",   monthly: 30  },
    ],
  },
  {
    key: "chatgpt",
    label: "ChatGPT (OpenAI)",
    plans: [
      { value: "free",       label: "Free",                  monthly: 0  },
      { value: "plus",       label: "Plus",                  monthly: 20 },
      { value: "pro",        label: "Pro",                   monthly: 200},
      { value: "team",       label: "Team (per seat)",       monthly: 30 },
      { value: "enterprise", label: "Enterprise (per seat)", monthly: 30 },
    ],
  },
  {
    key: "anthropic_api",
    label: "Anthropic API (direct)",
    plans: [
      { value: "payg", label: "Pay-as-you-go", monthly: 0 },
    ],
  },
  {
    key: "openai_api",
    label: "OpenAI API (direct)",
    plans: [
      { value: "payg", label: "Pay-as-you-go", monthly: 0 },
    ],
  },
  {
    key: "gemini",
    label: "Gemini (Google)",
    plans: [
      { value: "free", label: "Free",                          monthly: 0     },
      { value: "ai_premium", label: "Google One AI Premium",   monthly: 19.99 },
      { value: "api",  label: "API (pay-as-you-go)",           monthly: 0     },
    ],
  },
  {
    key: "windsurf",
    label: "Windsurf (Codeium)",
    plans: [
      { value: "free", label: "Free",              monthly: 0  },
      { value: "pro",  label: "Pro",               monthly: 15 },
      { value: "team", label: "Team (per seat)",   monthly: 35 },
    ],
  },
];

// Quick lookup map: toolKey -> ToolDefinition
export const TOOL_MAP: Record<ToolKey, ToolDefinition> = Object.fromEntries(
  TOOL_DEFINITIONS.map((t) => [t.key, t])
) as Record<ToolKey, ToolDefinition>;

// Quick lookup: toolKey + planValue -> monthly price
export function getPlanPrice(toolKey: ToolKey, planValue: string): number {
  const tool = TOOL_MAP[toolKey];
  if (!tool) return 0;
  const plan = tool.plans.find((p) => p.value === planValue);
  return plan?.monthly ?? 0;
}