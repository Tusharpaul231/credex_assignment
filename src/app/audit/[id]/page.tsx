import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { AuditRecord } from "@/types";
import HeroSavings from "@/components/HeroSavings";
import ToolAuditCard from "@/components/ToolAuditCard";
import CredexCTA from "@/components/CredexCTA";
import AISummary from "@/components/AISummary";
import ShareButton from "@/components/ShareButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, ArrowLeft, RotateCcw } from "lucide-react";
import LeadCapture from "@/components/LeadCapture";

//  Fetch audit by ID 
async function getAudit(id: string): Promise<AuditRecord | null> {
  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as AuditRecord;
}

//  Dynamic OG metadata 
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit) {
    return { title: "Audit not found - AIAudit" };
  }

  const savings = audit.audit_summary.totalMonthlySavings;
  const isOptimal = audit.audit_summary.isAlreadyOptimal;

  const title = isOptimal
    ? "My AI stack is spending-optimal ✓ - AIAudit"
    : `I could save $${savings}/mo on AI tools - AIAudit`;

  const description = isOptimal
    ? "Free AI spend audit by AIAudit. No overspend detected on this stack."
    : `Free AI spend audit identified $${savings}/mo ($${audit.audit_summary.totalAnnualSavings}/yr) in potential savings. Run yours free.`;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://credex-assignment-five.vercel.app";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${appUrl}/audit/${id}`,
      images: [{ url: `${appUrl}/og-default.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${appUrl}/og-default.png`],
    },
  };
}

//  Page 
export default async function AuditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit) notFound();

  const { audit_summary, ai_summary, form_input } = audit;
  const showCredex =
    audit_summary.credexRecommended || audit_summary.totalMonthlySavings >= 500;
  const showSoftCapture =
    audit_summary.isAlreadyOptimal || audit_summary.totalMonthlySavings < 100;

  // Split tools into optimal and non-optimal for display order
  const nonOptimal = audit_summary.toolAudits.filter((a) => !a.isOptimal);
  const optimal = audit_summary.toolAudits.filter((a) => a.isOptimal);

  return (
    <main className="min-h-screen bg-background">
      {/*  Nav  */}
      <nav className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity"
          >
            <Zap size={20} className="text-primary" />
            AIAudit
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs hidden sm:block">
              Free tool by Credex
            </Badge>
            <Button asChild variant="outline" size="sm">
              <Link href="/">
                <RotateCcw size={13} className="mr-1.5" />
                New audit
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/*  Back link  */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          Run a new audit
        </Link>

        {/*  Hero savings  */}
        <HeroSavings
          totalMonthlySavings={audit_summary.totalMonthlySavings}
          totalAnnualSavings={audit_summary.totalAnnualSavings}
          isAlreadyOptimal={audit_summary.isAlreadyOptimal}
        />

        {/*  AI summary  */}
        {ai_summary && <AISummary summary={ai_summary} />}

        {/*  Credex CTA (high savings)  */}
        {showCredex && (
          <CredexCTA totalMonthlySavings={audit_summary.totalMonthlySavings} />
        )}

        {/*  Per-tool breakdown  */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Tool-by-tool breakdown
          </h2>
          <div className="space-y-3">
            {/* Non-optimal first (savings opportunities) */}
            {nonOptimal.map((audit, i) => (
              <ToolAuditCard key={i} audit={audit} />
            ))}
            {/* Optimal last (good news) */}
            {optimal.map((audit, i) => (
              <ToolAuditCard key={i} audit={audit} />
            ))}
          </div>
        </section>

        {/*  Soft lead capture (optimal / low savings)  */}
        {showSoftCapture && (
          <div className="rounded-xl border border-border bg-muted/30 p-5 text-center">
            <p className="text-sm font-medium text-foreground mb-1">
              Want to know when new savings apply to your stack?
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              AI pricing changes constantly. Drop your email and we&apos;ll notify you.
            </p>
            <LeadCapture auditId={id} isSoftCapture />
          </div>
        )}

        {/*  Hard lead capture (significant savings)  */}
        {!showSoftCapture && (
          <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6">
            <h3 className="font-bold text-foreground mb-1">
              Get your full report + Credex savings estimate
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter your email to receive a copy of this audit. For high-savings
              cases, our team will reach out with a personalised Credex credits quote.
            </p>
            <LeadCapture auditId={id} isSoftCapture={false} />
          </div>
        )}

        {/*  Share section  */}
        <section className="rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-1">
            Share this audit
          </h2>
          <p className="text-xs text-muted-foreground mb-3">
            Your email and company name are never included in the shared link.
          </p>
          <ShareButton auditId={id} />
        </section>

        {/*  Audit metadata  */}
        <p className="text-xs text-center text-muted-foreground pb-4">
          Audit ID: <span className="font-mono">{id}</span> ·{" "}
          {form_input.tools.length} tool{form_input.tools.length > 1 ? "s" : ""} audited ·{" "}
          Team size: {form_input.teamSize} · Use case: {form_input.useCase}
        </p>
      </div>
    </main>
  );
}