import { describe, it, expect } from "vitest";
import { runAudit } from "../src/lib/auditEngine";
import { FormInput } from "../src/types";

//  Cursor tests 

describe("Cursor audit rules", () => {
  it("recommends Pro downgrade for Business plan with 2 seats", () => {
    const form: FormInput = {
      tools: [{ id: "1", tool: "cursor", plan: "business", monthlySpend: 80, seats: 2 }],
      teamSize: 2,
      useCase: "coding",
    };
    const result = runAudit(form);
    expect(result.toolAudits[0].savings).toBe(40);
    expect(result.toolAudits[0].isOptimal).toBe(false);
    expect(result.toolAudits[0].recommendedPlan).toBe("Pro");
  });

  it("marks Cursor Pro as optimal for a coding team of 5", () => {
    const form: FormInput = {
      tools: [{ id: "1", tool: "cursor", plan: "pro", monthlySpend: 100, seats: 5 }],
      teamSize: 5,
      useCase: "coding",
    };
    const result = runAudit(form);
    expect(result.toolAudits[0].isOptimal).toBe(true);
    expect(result.toolAudits[0].savings).toBe(0);
  });
});

//  GitHub Copilot tests 

describe("GitHub Copilot audit rules", () => {
  it("recommends Business downgrade from Enterprise for teams under 20", () => {
    const form: FormInput = {
      tools: [{ id: "1", tool: "github_copilot", plan: "enterprise", monthlySpend: 195, seats: 5 }],
      teamSize: 5,
      useCase: "coding",
    };
    const result = runAudit(form);
    expect(result.toolAudits[0].savings).toBe(100); // (39-19)*5
    expect(result.toolAudits[0].isOptimal).toBe(false);
    expect(result.toolAudits[0].recommendedPlan).toBe("Business");
  });

  it("recommends Individual downgrade from Business for 3-seat coding team", () => {
    const form: FormInput = {
      tools: [{ id: "1", tool: "github_copilot", plan: "business", monthlySpend: 57, seats: 3 }],
      teamSize: 3,
      useCase: "coding",
    };
    const result = runAudit(form);
    expect(result.toolAudits[0].savings).toBe(27); // (19-10)*3
    expect(result.toolAudits[0].recommendedPlan).toBe("Individual");
  });
});

//  Claude tests 

describe("Claude audit rules", () => {
  it("flags Claude Max 5x as overkill for coding use case", () => {
    const form: FormInput = {
      tools: [{ id: "1", tool: "claude", plan: "max_5x", monthlySpend: 100, seats: 1 }],
      teamSize: 1,
      useCase: "coding",
    };
    const result = runAudit(form);
    expect(result.toolAudits[0].savings).toBe(80);
    expect(result.toolAudits[0].recommendedPlan).toBe("Pro");
  });

  it("flags Claude Max 20x as overkill for data use case", () => {
    const form: FormInput = {
      tools: [{ id: "1", tool: "claude", plan: "max_20x", monthlySpend: 200, seats: 1 }],
      teamSize: 1,
      useCase: "data",
    };
    const result = runAudit(form);
    expect(result.toolAudits[0].savings).toBe(180);
  });

  it("keeps Claude Max as optimal for writing use case", () => {
    const form: FormInput = {
      tools: [{ id: "1", tool: "claude", plan: "max_5x", monthlySpend: 100, seats: 1 }],
      teamSize: 1,
      useCase: "writing",
    };
    const result = runAudit(form);
    expect(result.toolAudits[0].isOptimal).toBe(true);
  });
});

//  ChatGPT tests 

describe("ChatGPT audit rules", () => {
  it("flags ChatGPT Pro as overkill for general use", () => {
    const form: FormInput = {
      tools: [{ id: "1", tool: "chatgpt", plan: "pro", monthlySpend: 200, seats: 1 }],
      teamSize: 1,
      useCase: "mixed",
    };
    const result = runAudit(form);
    expect(result.toolAudits[0].savings).toBe(180);
    expect(result.toolAudits[0].recommendedPlan).toBe("Plus");
  });
});

//  API tools tests 

describe("Anthropic API audit rules", () => {
  it("flags high API spend for Credex credits opportunity", () => {
    const form: FormInput = {
      tools: [{ id: "1", tool: "anthropic_api", plan: "payg", monthlySpend: 800, seats: 1 }],
      teamSize: 3,
      useCase: "data",
    };
    const result = runAudit(form);
    expect(result.toolAudits[0].credexOpportunity).toBe(true);
    expect(result.toolAudits[0].savings).toBe(200); // 25% of 800
    expect(result.credexRecommended).toBe(true);
  });

  it("recommends model mix optimisation for mid-range API spend", () => {
    const form: FormInput = {
      tools: [{ id: "1", tool: "anthropic_api", plan: "payg", monthlySpend: 300, seats: 1 }],
      teamSize: 2,
      useCase: "coding",
    };
    const result = runAudit(form);
    expect(result.toolAudits[0].isOptimal).toBe(false);
    expect(result.toolAudits[0].savings).toBe(120); // 40% of 300
  });
});

describe("OpenAI API audit rules", () => {
  it("flags high OpenAI API spend for Credex credits", () => {
    const form: FormInput = {
      tools: [{ id: "1", tool: "openai_api", plan: "payg", monthlySpend: 600, seats: 1 }],
      teamSize: 2,
      useCase: "mixed",
    };
    const result = runAudit(form);
    expect(result.toolAudits[0].credexOpportunity).toBe(true);
    expect(result.toolAudits[0].savings).toBe(150); // 25% of 600
  });
});

//  Windsurf tests 

describe("Windsurf audit rules", () => {
  it("recommends Pro downgrade from Team for 2-seat teams", () => {
    const form: FormInput = {
      tools: [{ id: "1", tool: "windsurf", plan: "team", monthlySpend: 70, seats: 2 }],
      teamSize: 2,
      useCase: "coding",
    };
    const result = runAudit(form);
    expect(result.toolAudits[0].savings).toBe(40); // (35-15)*2
    expect(result.toolAudits[0].recommendedPlan).toBe("Pro");
  });
});

//  Multi-tool summary tests 

describe("AuditSummary calculations", () => {
  it("correctly sums total monthly and annual savings across tools", () => {
    const form: FormInput = {
      tools: [
        { id: "1", tool: "cursor", plan: "business", monthlySpend: 80, seats: 2 },     // saves $40
        { id: "2", tool: "claude", plan: "max_5x", monthlySpend: 100, seats: 1 },      // saves $80
      ],
      teamSize: 3,
      useCase: "coding",
    };
    const result = runAudit(form);
    expect(result.totalMonthlySavings).toBe(120);
    expect(result.totalAnnualSavings).toBe(1440);
  });

  it("returns isAlreadyOptimal true for a well-configured stack", () => {
    const form: FormInput = {
      tools: [
        { id: "1", tool: "github_copilot", plan: "individual", monthlySpend: 10, seats: 1 },
      ],
      teamSize: 1,
      useCase: "coding",
    };
    const result = runAudit(form);
    expect(result.isAlreadyOptimal).toBe(true);
    expect(result.totalMonthlySavings).toBe(0);
  });

  it("sets credexRecommended true when total savings exceed $500/mo", () => {
    const form: FormInput = {
      tools: [
        { id: "1", tool: "anthropic_api", plan: "payg", monthlySpend: 2000, seats: 1 },
        { id: "2", tool: "openai_api", plan: "payg", monthlySpend: 1000, seats: 1 },
      ],
      teamSize: 5,
      useCase: "data",
    };
    const result = runAudit(form);
    expect(result.credexRecommended).toBe(true);
    expect(result.totalMonthlySavings).toBeGreaterThan(500);
  });

  it("does not manufacture savings for an optimal multi-tool stack", () => {
    const form: FormInput = {
      tools: [
        { id: "1", tool: "github_copilot", plan: "individual", monthlySpend: 10, seats: 1 },
        { id: "2", tool: "claude", plan: "pro", monthlySpend: 20, seats: 1 },
      ],
      teamSize: 1,
      useCase: "coding",
    };
    const result = runAudit(form);
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.isAlreadyOptimal).toBe(true);
  });
});