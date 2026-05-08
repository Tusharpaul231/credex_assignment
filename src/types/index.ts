// Tool & Plan Types

export type ToolKey =
  | "cursor"
  | "github_copilot"
  | "claude"
  | "chatgpt"
  | "anthropic_api"
  | "openai_api"
  | "gemini"
  | "windsurf";

export type UseCaseKey = "coding" | "writing" | "data" | "research" | "mixed";

export interface PlanOption {
  value: string;
  label: string;
  monthly: number;
}

export interface ToolDefinition {
  key: ToolKey;
  label: string;
  plans: PlanOption[];
}

// Form Types

export interface ToolInput {
  id: string;
  tool: ToolKey;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface FormInput {
  tools: ToolInput[];
  teamSize: number;
  useCase: UseCaseKey;
}

// Audit Engine Types

export interface ToolAudit {
  tool: string;
  plan: string;
  currentSpend: number;
  recommendedAction: string;
  recommendedPlan?: string;
  savings: number;
  reason: string;
  isOptimal: boolean;
  credexOpportunity: boolean;
}

export interface AuditSummary {
  toolAudits: ToolAudit[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isAlreadyOptimal: boolean;
  credexRecommended: boolean;
}

// API / DB Types

export interface AuditRecord {
  id: string;
  form_input: FormInput;
  audit_summary: AuditSummary;
  ai_summary: string;
  created_at: string;
}

export interface LeadRecord {
  id: string;
  audit_id: string;
  email: string;
  company_name?: string;
  role?: string;
  team_size?: number;
  created_at: string;
}