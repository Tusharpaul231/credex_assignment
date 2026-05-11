import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseServer } from "@/lib/supabaseServer";

const resend = new Resend(process.env.RESEND_API_KEY!);

// ── Rate limiting ────────────────────────────────────────────
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60_000;

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

// ── Honeypot check ───────────────────────────────────────────
function hasHoneypot(body: Record<string, unknown>): boolean {
  return typeof body._hp_website === "string" && body._hp_website.length > 0;
}

// ── Email template ───────────────────────────────────────────
function buildEmailHtml(
  email: string,
  auditId: string,
  totalMonthlySavings: number,
  isHighSavings: boolean
): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://your-domain.vercel.app";
  const auditUrl = `${appUrl}/audit/${auditId}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your AI Spend Audit Report</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
    
    <!-- Header -->
    <div style="background:#18181b;padding:28px 32px;">
      <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.3px;">
        ⚡ AIAudit
      </p>
      <p style="margin:6px 0 0;color:#a1a1aa;font-size:13px;">by Credex</p>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#18181b;letter-spacing:-0.3px;">
        Your AI spend audit is ready
      </h1>
      <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
        ${
          totalMonthlySavings > 0
            ? `We identified <strong style="color:#18181b;">$${totalMonthlySavings}/month</strong> in potential savings on your AI tool stack.`
            : `Good news — your AI stack looks well-optimised. No obvious overspend detected.`
        }
      </p>

      <!-- CTA Button -->
      <a href="${auditUrl}"
        style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;margin-bottom:24px;">
        View your full audit →
      </a>

      ${
        isHighSavings
          ? `
      <!-- Credex block for high savings -->
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#15803d;">
          💡 Capture more of that savings with Credex
        </p>
        <p style="margin:0 0 12px;font-size:13px;color:#166534;line-height:1.6;">
          Credex sells discounted AI infrastructure credits — same API, lower price.
          Our team will reach out within 1 business day with a personalised quote.
        </p>
        <a href="https://credex.rocks"
          style="font-size:13px;color:#15803d;font-weight:600;text-decoration:underline;">
          Learn more about Credex →
        </a>
      </div>`
          : ""
      }

      <!-- Divider -->
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />

      <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
        You're receiving this because you submitted an audit at AIAudit.
        Your email is never shown on the public share link.
        <br />Audit ID: <span style="font-family:monospace;">${auditId}</span>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// ── POST /api/lead ────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Honeypot
    if (hasHoneypot(body)) {
      return NextResponse.json({ ok: true });
    }

    const { audit_id, email, company_name, role, team_size } = body;

    // Validation
    if (!audit_id || typeof audit_id !== "string") {
      return NextResponse.json({ error: "Missing audit_id." }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Check audit exists and get savings data
    const { data: audit, error: auditError } = await supabaseServer
      .from("audits")
      .select("id, audit_summary")
      .eq("id", audit_id)
      .single();

    if (auditError || !audit) {
      return NextResponse.json({ error: "Audit not found." }, { status: 404 });
    }

    const { data: existing } = await supabaseServer
      .from("leads")
      .select("id")
      .eq("audit_id", audit_id)
      .eq("email", email.toLowerCase().trim())
      .single();

    if (existing) {
      return NextResponse.json({ ok: true });
    }

    // Save lead
    const { error: insertError } = await supabaseServer.from("leads").insert({
      audit_id,
      email: email.toLowerCase().trim(),
      company_name: company_name ?? null,
      role: role ?? null,
      team_size: team_size ?? null,
    });

    if (insertError) {
      console.error("Lead insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save. Please try again." },
        { status: 500 }
      );
    }

    // Send confirmation email via Resend
    const totalMonthlySavings = audit.audit_summary?.totalMonthlySavings ?? 0;
    const isHighSavings = totalMonthlySavings >= 500;

    try {
      await resend.emails.send({
        from: "AIAudit <onboarding@resend.dev>", // replace with your verified domain later
        to: email.toLowerCase().trim(),
        subject:
          totalMonthlySavings > 0
            ? `Your audit: $${totalMonthlySavings}/mo in potential savings`
            : "Your AI spend audit report",
        html: buildEmailHtml(email, audit_id, totalMonthlySavings, isHighSavings),
      });
    } catch (emailErr) {
      
      console.error("Resend email error:", emailErr);
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Unexpected error in /api/lead:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}