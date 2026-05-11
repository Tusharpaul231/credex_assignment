import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { nanoid } from "nanoid";
import { runAudit } from "@/lib/auditEngine";
import { supabaseServer } from "@/lib/supabaseServer";
import { FormInput } from "@/types";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });
//  Rate limiting 
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10;       // max requests
const RATE_LIMIT_WINDOW = 60_000; // per 60 seconds

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) return true;

  entry.count++;
  return false;
}

// AI summary generation 
async function generateAISummary(
  formInput: FormInput,
  auditSummary: ReturnType<typeof runAudit>
): Promise<string> {
  const toolsSummary = auditSummary.toolAudits
    .map((a) => `${a.tool} (${a.plan}): $${a.currentSpend}/mo → ${a.recommendedAction}, saves $${a.savings}/mo`)
    .join("; ");

  const topRecommendations = auditSummary.toolAudits
    .filter((a) => !a.isOptimal)
    .sort((a, b) => b.savings - a.savings)
    .slice(0, 2)
    .map((a) => `${a.tool}: ${a.recommendedAction}`)
    .join(", ");

  const prompt = `You are a concise financial advisor specialising in AI tool spend for startups.

Given this AI tool audit:
- Team size: ${formInput.teamSize}
- Primary use case: ${formInput.useCase}
- Tools audited: ${toolsSummary}
- Total monthly savings identified: $${auditSummary.totalMonthlySavings}
- Top recommendations: ${topRecommendations || "stack is already optimal"}

Write a 90-110 word personalised summary paragraph for this specific team.
Tone: direct, helpful, not salesy.
Lead with the biggest savings opportunity or confirm they are spending well.
End with one concrete next step they can take today.
Do not use bullet points. Do not mention Credex. Use specific tool names and dollar amounts.`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant", // free, fast, good quality
    max_tokens: 200,
    messages: [{ role: "user", content: prompt }],
  });
  return response.choices[0]?.message?.content?.trim() ?? generateFallbackSummary(formInput, auditSummary);
}

//  Fallback summary 
function generateFallbackSummary(
  formInput: FormInput,
  auditSummary: ReturnType<typeof runAudit>
): string {
  if (auditSummary.isAlreadyOptimal) {
    return `Your team of ${formInput.teamSize} is spending well on AI tools. Based on your ${formInput.useCase} workflow, your current stack is right-sized no obvious overspend detected. That said, AI tool pricing changes frequently. Consider re-auditing every quarter, and if your API usage grows past $500/mo, bulk credits can offer meaningful savings.`;
  }

  const topTool = auditSummary.toolAudits
    .filter((a) => !a.isOptimal)
    .sort((a, b) => b.savings - a.savings)[0];

  return `Your team of ${formInput.teamSize} could save $${auditSummary.totalMonthlySavings}/month by optimising your AI tool stack. The biggest opportunity is ${topTool?.tool ?? "your current tools"} - ${topTool?.recommendedAction ?? "review your plan"}. Over 12 months, these changes add up to $${auditSummary.totalAnnualSavings} in recovered budget. Start with the highest-savings change first and re-audit in 30 days to track progress.`;
}

//  Honeypot check 
function hasHoneypot(body: Record<string, unknown>): boolean {
  return typeof body._hp_website === "string" && body._hp_website.length > 0;
}

//  POST /api/audit 
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Honeypot check
    if (hasHoneypot(body)) {
      // Silently succeed - bots shouldn't know they were blocked
      return NextResponse.json({ id: nanoid(10) });
    }

    const formInput: FormInput = body;

    // Basic validation
    if (!formInput.tools || !Array.isArray(formInput.tools) || formInput.tools.length === 0) {
      return NextResponse.json({ error: "Invalid form input." }, { status: 400 });
    }

    if (formInput.tools.length > 8) {
      return NextResponse.json({ error: "Maximum 8 tools allowed." }, { status: 400 });
    }

    // Run audit engine (no AI)
    const auditSummary = runAudit(formInput);

    // Generate AI summary - fallback gracefully on failure
    let aiSummary = "";
    try {
      aiSummary = await generateAISummary(formInput, auditSummary);
    } catch (err) {
      console.error("Anthropic API error - using fallback summary:", err);
      aiSummary = generateFallbackSummary(formInput, auditSummary);
    }

    // Save to Supabase
    const id = nanoid(10);
    const { error: dbError } = await supabaseServer
      .from("audits")
      .insert({
        id,
        form_input: formInput,
        audit_summary: auditSummary,
        ai_summary: aiSummary,
      });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to save audit. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error("Unexpected error in /api/audit:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}