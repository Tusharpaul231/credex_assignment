
import { FormInput, ToolInput, ToolAudit, AuditSummary, UseCaseKey } from "@/types";

//Cursor

function auditCursor(input: ToolInput, useCase: UseCaseKey): ToolAudit {
  const { plan, monthlySpend, seats } = input;
  const base = { tool: "Cursor", plan, currentSpend: monthlySpend };

  // Business (40/seat) for ≤2 seats - SSO/admin controls wasted
  if (plan === "business" && seats <= 2) {
    const savings = seats * (40 - 20);
    return {
      ...base,
      recommendedAction: "Downgrade to Pro",
      recommendedPlan: "Pro",
      savings,
      reason: `Business ($40/seat) adds SSO and org-wide admin controls - features that require at least 5–10 people to justify. With ${seats} seat${seats > 1 ? "s" : ""}, Pro ($20/seat) provides identical AI completions and chat. Save $${savings}/mo.`,
      isOptimal: false,
      credexOpportunity: monthlySpend >= 80,
    };
  }

  // For non-coding use cases, Cursor is not required
  if ((useCase === "writing" || useCase === "research") && plan !== "hobby") {
    const altCost = seats * 20; // Claude Pro per seat equivalent
    const savings = monthlySpend - altCost;
    if (savings > 0) {
      return {
        ...base,
        recommendedAction: "Switch to Claude Pro for writing/research",
        recommendedPlan: "Claude Pro",
        savings,
        reason: `Cursor is optimised for IDE-based coding workflows. For ${useCase}, Claude Pro ($20/mo) offers superior long-form reasoning without the IDE overhead - saving $${savings}/mo.`,
        isOptimal: false,
        credexOpportunity: monthlySpend > 100,
      };
    }
  }

  // Enterprise for small team
  if (plan === "enterprise" && seats < 10) {
    const savings = seats * (40 - 20);
    return {
      ...base,
      recommendedAction: "Move to Business or Pro plan",
      recommendedPlan: seats <= 4 ? "Pro" : "Business",
      savings,
      reason: `Enterprise pricing is designed for large organisations needing custom contracts and SLAs. Under 10 seats, ${seats <= 4 ? "Pro" : "Business"} covers your needs at lower cost. Save $${savings}/mo.`,
      isOptimal: false,
      credexOpportunity: true,
    };
  }

  return {
    ...base,
    recommendedAction: "Keep current plan",
    savings: 0,
    reason: "Cursor plan is well-matched to your team size and use case.",
    isOptimal: true,
    credexOpportunity: false,
  };
}

//GitHub Copilot

function auditGithubCopilot(input: ToolInput, useCase: UseCaseKey, teamSize: number): ToolAudit {
  const { plan, monthlySpend, seats } = input;
  const base = { tool: "GitHub Copilot", plan, currentSpend: monthlySpend };

  // Enterprise for teams under 20
  if (plan === "enterprise" && teamSize < 20) {
    const savings = seats * (39 - 19);
    return {
      ...base,
      recommendedAction: "Downgrade to Business",
      recommendedPlan: "Business",
      savings,
      reason: `Enterprise ($39/seat) adds audit logs, policy management, and compliance features suited for 20+ person engineering orgs. At ${teamSize} people, Business ($19/seat) covers the same AI completions - saving $${savings}/mo.`,
      isOptimal: false,
      credexOpportunity: monthlySpend > 200,
    };
  }

  // Business for very small teams doing coding
  if (plan === "business" && seats <= 3 && useCase === "coding") {
    const savings = seats * (19 - 10);
    return {
      ...base,
      recommendedAction: "Downgrade to Individual",
      recommendedPlan: "Individual",
      savings,
      reason: `Business ($19/seat) adds team management and org policies. With ${seats} developer${seats > 1 ? "s" : ""}, Individual ($10/seat) provides the same completions and chat - saving $${savings}/mo.`,
      isOptimal: false,
      credexOpportunity: false,
    };
  }

  // Non-coding use case Copilot is IDE-locked
  if (useCase !== "coding" && useCase !== "mixed" && plan !== "individual") {
    const savings = monthlySpend - seats * 20; // Claude Pro equivalent
    if (savings > 0) {
      return {
        ...base,
        recommendedAction: "Switch to Claude Pro for non-coding tasks",
        savings,
        reason: `GitHub Copilot is optimised for in-editor code completion. For ${useCase} tasks, Claude Pro ($20/mo) is more capable and $${savings}/mo cheaper.`,
        isOptimal: false,
        credexOpportunity: false,
      };
    }
  }

  return {
    ...base,
    recommendedAction: "Keep current plan",
    savings: 0,
    reason: "GitHub Copilot plan is right-sized for your team.",
    isOptimal: true,
    credexOpportunity: false,
  };
}

//Claude

function auditClaude(input: ToolInput, useCase: UseCaseKey): ToolAudit {
  const { plan, monthlySpend, seats } = input;
  const base = { tool: "Claude", plan, currentSpend: monthlySpend };

  // Max 5x ($100) for coding/data - usage limits rarely hit
  if (plan === "max_5x" && (useCase === "coding" || useCase === "data")) {
    const savings = 100 - 20;
    return {
      ...base,
      recommendedAction: "Downgrade to Pro",
      recommendedPlan: "Pro",
      savings,
      reason: `Claude Max ($100/mo) is designed for heavy daily prose and research workflows that exhaust Pro's limits. For ${useCase}, Pro ($20/mo) limits are rarely hit - saving $${savings}/mo.`,
      isOptimal: false,
      credexOpportunity: true,
    };
  }

  // Max 20x ($200) unless it's research/writing heavy
  if (plan === "max_20x" && useCase !== "writing" && useCase !== "research") {
    const savings = 200 - 20;
    return {
      ...base,
      recommendedAction: "Downgrade to Pro",
      recommendedPlan: "Pro",
      savings,
      reason: `Claude Max 20x ($200/mo) is built for extremely high-volume writing workflows. For ${useCase}, this tier is very unlikely to be justified - Pro ($20/mo) saves $${savings}/mo.`,
      isOptimal: false,
      credexOpportunity: true,
    };
  }

  // Team plan for less equal 2 users
  if (plan === "team" && seats <= 2) {
    const savings = seats * (30 - 20);
    return {
      ...base,
      recommendedAction: "Switch to individual Pro plans",
      savings,
      reason: `Claude Team ($30/seat, 5-seat minimum) adds an admin console and higher rate limits for groups. With ${seats} users, two individual Pro plans ($20/mo each) cover the same model access - saving $${savings}/mo.`,
      isOptimal: false,
      credexOpportunity: false,
    };
  }

  return {
    ...base,
    recommendedAction: "Keep current plan",
    savings: 0,
    reason: "Your Claude plan matches your team's usage pattern.",
    isOptimal: true,
    credexOpportunity: false,
  };
}

// ChatGPT

function auditChatGPT(input: ToolInput, useCase: UseCaseKey): ToolAudit {
  const { plan, monthlySpend, seats } = input;
  const base = { tool: "ChatGPT", plan, currentSpend: monthlySpend };

  // ChatGPT Pro ($200/mo) is extreme  only for O1 Pro heavy users
  if (plan === "pro") {
    const savings = 200 - 20;
    return {
      ...base,
      recommendedAction: "Downgrade to Plus",
      recommendedPlan: "Plus",
      savings,
      reason: `ChatGPT Pro ($200/mo) unlocks unlimited o1 Pro access - valuable only for heavy mathematical/scientific reasoning. For general ${useCase} work, Plus ($20/mo) with GPT-4o is equivalent - saving $${savings}/mo.`,
      isOptimal: false,
      credexOpportunity: true,
    };
  }

  // Plus overlaps heavily with Claude Pro
  if (plan === "plus" && seats === 1) {
    return {
      ...base,
      recommendedAction: "Consolidate: keep one of ChatGPT Plus or Claude Pro",
      savings: 20,
      reason: `ChatGPT Plus ($20/mo) and Claude Pro ($20/mo) overlap significantly for ${useCase} tasks. Most teams find one sufficient. Review which you use more and drop the other - saving $20/mo.`,
      isOptimal: false,
      credexOpportunity: false,
    };
  }

  // Team for small groups
  if (plan === "team" && seats <= 2) {
    const savings = seats * (30 - 20);
    return {
      ...base,
      recommendedAction: "Switch to individual Plus plans",
      savings,
      reason: `ChatGPT Team ($30/seat) adds workspace management and higher limits for groups. With ${seats} users, individual Plus plans ($20/seat) provide the same GPT-4o access - saving $${savings}/mo.`,
      isOptimal: false,
      credexOpportunity: false,
    };
  }

  return {
    ...base,
    recommendedAction: "Keep current plan",
    savings: 0,
    reason: "Your ChatGPT plan is appropriately sized.",
    isOptimal: true,
    credexOpportunity: false,
  };
}

//  Anthropic API 

function auditAnthropicAPI(input: ToolInput): ToolAudit {
  const { monthlySpend } = input;
  const base = { tool: "Anthropic API", plan: "Pay-as-you-go", currentSpend: monthlySpend };

  if (monthlySpend >= 500) {
    const savings = Math.round(monthlySpend * 0.25);
    return {
      ...base,
      recommendedAction: "Get discounted credits via Credex",
      savings,
      reason: `At $${monthlySpend}/mo retail, discounted Anthropic API credits typically save 20–30%. Estimated saving: $${savings}/mo ($${savings * 12}/yr). Credex sources credits from companies that overforecast - same API, lower cost.`,
      isOptimal: false,
      credexOpportunity: true,
    };
  }

  if (monthlySpend >= 200) {
    return {
      ...base,
      recommendedAction: "Switch to Claude Haiku for non-critical tasks",
      savings: Math.round(monthlySpend * 0.4),
      reason: `At $${monthlySpend}/mo, check your model mix. Routing non-critical calls to Claude Haiku 3.5 ($0.80/MTok vs Sonnet's $3/MTok) typically cuts API spend 30–50% with minimal quality loss.`,
      isOptimal: false,
      credexOpportunity: false,
    };
  }

  return {
    ...base,
    recommendedAction: "Keep current usage",
    savings: 0,
    reason: "API spend is within efficient range. Review model selection if usage grows.",
    isOptimal: true,
    credexOpportunity: false,
  };
}

// OpenAI API 

function auditOpenAIAPI(input: ToolInput): ToolAudit {
  const { monthlySpend } = input;
  const base = { tool: "OpenAI API", plan: "Pay-as-you-go", currentSpend: monthlySpend };

  if (monthlySpend >= 500) {
    const savings = Math.round(monthlySpend * 0.25);
    return {
      ...base,
      recommendedAction: "Get discounted credits via Credex",
      savings,
      reason: `At $${monthlySpend}/mo retail, discounted OpenAI API credits typically save 20–30%. Estimated saving: $${savings}/mo ($${savings * 12}/yr) for the same usage.`,
      isOptimal: false,
      credexOpportunity: true,
    };
  }

  if (monthlySpend >= 200) {
    return {
      ...base,
      recommendedAction: "Switch non-critical tasks to GPT-4o mini",
      savings: Math.round(monthlySpend * 0.4),
      reason: `GPT-4o mini ($0.15/MTok) is 16× cheaper than GPT-4o ($2.50/MTok) for input tokens. Routing classification, summarisation, and extraction tasks to mini can cut spend 30–50%.`,
      isOptimal: false,
      credexOpportunity: false,
    };
  }

  return {
    ...base,
    recommendedAction: "Keep current usage",
    savings: 0,
    reason: "OpenAI API spend is within efficient range.",
    isOptimal: true,
    credexOpportunity: false,
  };
}

//  Gemini 

function auditGemini(input: ToolInput, useCase: UseCaseKey): ToolAudit {
  const { plan, monthlySpend, seats } = input;
  const base = { tool: "Gemini", plan, currentSpend: monthlySpend };

  // AI Premium for coding Copilot Individual is better value
  if (plan === "ai_premium" && useCase === "coding") {
    const savings = monthlySpend - seats * 10;
    if (savings > 0) {
      return {
        ...base,
        recommendedAction: "Switch to GitHub Copilot Individual",
        savings,
        reason: `Gemini Advanced ($19.99/mo) is a general-purpose assistant. For coding, GitHub Copilot Individual ($10/seat) has deeper IDE integration and code-specific training - saving $${savings}/mo.`,
        isOptimal: false,
        credexOpportunity: false,
      };
    }
  }

  // AI Premium overlaps with ChatGPT Plus or Claude Pro
  if (plan === "ai_premium" && (useCase === "writing" || useCase === "research")) {
    return {
      ...base,
      recommendedAction: "Consolidate with Claude Pro or ChatGPT Plus",
      savings: Math.round(monthlySpend * 0.5),
      reason: `Gemini Advanced and Claude Pro/ChatGPT Plus serve the same ${useCase} use case. Teams that consolidate to one assistant save $10–20/mo and reduce context switching.`,
      isOptimal: false,
      credexOpportunity: false,
    };
  }

  return {
    ...base,
    recommendedAction: "Keep current plan",
    savings: 0,
    reason: "Gemini plan is appropriate for your use case.",
    isOptimal: true,
    credexOpportunity: false,
  };
}

//  Windsurf 

function auditWindsurf(input: ToolInput, useCase: UseCaseKey): ToolAudit {
  const { plan, monthlySpend, seats } = input;
  const base = { tool: "Windsurf", plan, currentSpend: monthlySpend };

  // Team for less equal 2 seats
  if (plan === "team" && seats <= 2) {
    const savings = seats * (35 - 15);
    return {
      ...base,
      recommendedAction: "Downgrade to Pro",
      recommendedPlan: "Pro",
      savings,
      reason: `Windsurf Team ($35/seat) adds org-wide seat management and SSO - overhead for ${seats} developer${seats > 1 ? "s" : ""}. Pro ($15/seat) includes the same Cascade AI features - saving $${savings}/mo.`,
      isOptimal: false,
      credexOpportunity: false,
    };
  }

  // Non-coding use case
  if (useCase !== "coding" && useCase !== "mixed" && plan !== "free") {
    const savings = monthlySpend - 20;
    if (savings > 0) {
      return {
        ...base,
        recommendedAction: "Switch to Claude Pro",
        savings,
        reason: `Windsurf is an IDE-first coding tool. For ${useCase} work, Claude Pro ($20/mo) is better suited and $${savings}/mo cheaper.`,
        isOptimal: false,
        credexOpportunity: false,
      };
    }
  }

  return {
    ...base,
    recommendedAction: "Keep current plan",
    savings: 0,
    reason: "Windsurf plan is well-matched to your team.",
    isOptimal: true,
    credexOpportunity: false,
  };
}

//Main export 

export function runAudit(form: FormInput): AuditSummary {
  const toolAudits: ToolAudit[] = form.tools.map((toolInput) => {
    switch (toolInput.tool) {
      case "cursor":
        return auditCursor(toolInput, form.useCase);
      case "github_copilot":
        return auditGithubCopilot(toolInput, form.useCase, form.teamSize);
      case "claude":
        return auditClaude(toolInput, form.useCase);
      case "chatgpt":
        return auditChatGPT(toolInput, form.useCase);
      case "anthropic_api":
        return auditAnthropicAPI(toolInput);
      case "openai_api":
        return auditOpenAIAPI(toolInput);
      case "gemini":
        return auditGemini(toolInput, form.useCase);
      case "windsurf":
        return auditWindsurf(toolInput, form.useCase);
      default:
        return {
          tool: toolInput.tool,
          plan: toolInput.plan,
          currentSpend: toolInput.monthlySpend,
          recommendedAction: "No audit rule available",
          savings: 0,
          reason: "This tool is not yet covered by the audit engine.",
          isOptimal: true,
          credexOpportunity: false,
        };
    }
  });

  const totalMonthlySavings = toolAudits.reduce((sum, a) => sum + a.savings, 0);
  const totalAnnualSavings = totalMonthlySavings * 12;
  const isAlreadyOptimal = toolAudits.every((a) => a.isOptimal);
  const credexRecommended =
    totalMonthlySavings >= 500 || toolAudits.some((a) => a.credexOpportunity);

  return {
    toolAudits,
    totalMonthlySavings,
    totalAnnualSavings,
    isAlreadyOptimal,
    credexRecommended,
  };
}