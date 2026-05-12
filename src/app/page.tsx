import type { Metadata } from "next";
import Link from "next/link";
import SpendFormWrapper from "@/components/SpendFormWrapper";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Zap,
  TrendingDown,
  Share2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  title: "AIAudit — Free AI Spend Audit for Startups",
  description:
    "Find out exactly where your team is overspending on AI tools. Free instant audit. No login required.",
  openGraph: {
    title: "AIAudit — Free AI Spend Audit for Startups",
    description:
      "Find out exactly where your team is overspending on AI tools. Free instant audit. No login required.",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIAudit — Free AI Spend Audit for Startups",
    description:
      "Find out exactly where your team is overspending on AI tools.",
    images: ["/og-default.png"],
  },
};

const FEATURES = [
  {
    icon: <TrendingDown size={20} className="text-emerald-600" />,
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
    title: "Instant savings estimate",
    desc: "See exactly how much you could save — per tool, per month, per year.",
  },
  {
    icon: <Zap size={20} className="text-violet-600" />,
    bg: "bg-violet-50 dark:bg-emerald-900/40",
    title: "Smart recommendations",
    desc: "Right-size plans, remove overlapping tools, find cheaper alternatives.",
  },
  {
    icon: <Share2 size={20} className="text-blue-600" />,
    bg: "bg-blue-50 dark:bg-emerald-900/40",
    title: "Shareable report",
    desc: "Get a unique URL to share your audit with your team or investors.",
  },
  {
    icon: <ShieldCheck size={20} className="text-orange-600" />,
    bg: "bg-orange-50 dark:bg-emerald-900/40",
    title: "No login required",
    desc: "Just fill in your tools and get your report. Email optional, always after.",
  },
];

const TOOLS = [
  "Cursor", "GitHub Copilot", "Claude", "ChatGPT",
  "Anthropic API", "OpenAI API", "Gemini", "Windsurf",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* ── Nav ──────────────────────────────────────────────── */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
              <Zap size={14} className="text-background" />
            </div>
            AIAudit
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Badge
              variant="outline"
              className="text-xs hidden sm:block border-emerald-300 text-emerald-700 bg-emerald-50"
            >
              Free tool
            </Badge>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              by Credex →
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
          <Badge
            variant="outline"
            className="mb-5 text-xs px-3 py-1 border-border bg-background"
          >
            No signup &nbsp;·&nbsp; No credit card &nbsp;·&nbsp; Instant results
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] mb-5">
            Stop overpaying for
            <br />
            <span className="relative">
              <span className="relative z-10">AI tools.</span>
              <span className="absolute left-0 right-0 bottom-1 h-3 bg-yellow-400 dark:bg-yellow-500 opacity-70 -z-0 rounded" />
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Enter your AI subscriptions and get an instant audit — where
            you&apos;re overspending, what to switch, and your total potential
            savings. Takes 2 minutes.
          </p>

          {/* Tool pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {TOOLS.map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <strong className="text-foreground">1,200+</strong> audits run
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500" />
              avg. savings{" "}
              <strong className="text-foreground">$340/mo</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500" />
              completely <strong className="text-foreground">free</strong>
            </span>
          </div>
        </div>
      </section>

      {/* ── Form ─────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 -mt-4 pb-16">
        <SpendFormWrapper />
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/20">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-center text-2xl font-bold tracking-tight mb-2">
            How it works
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-sm">
            Three steps, two minutes, zero cost.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Enter your stack",
                desc: "Add every AI tool your team pays for — plan, monthly spend, number of seats.",
              },
              {
                step: "02",
                title: "Get your audit",
                desc: "Our engine evaluates every tool: right plan? cheaper alternative? credits opportunity?",
              },
              {
                step: "03",
                title: "Act on savings",
                desc: "See exactly what to change, what to drop, and how much you save per month and per year.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-5xl font-black mb-3 leading-none text-foreground/20 dark:text-foreground/25 select-none">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-center text-2xl font-bold tracking-tight mb-12">
            What you get
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border p-5 bg-background hover:shadow-sm transition-shadow"
              >
                <div
                  className={`w-10 h-10 rounded-lg ${f.bg} flex items-center justify-center mb-4`}
                >
                  {f.icon}
                </div>
                <h3 className="font-semibold text-sm mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ───────────────────────────────────────── */}
      <section className="border-t border-border bg-foreground">
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-background mb-3">
            Find out what you&apos;re overpaying. Right now.
          </h2>
          <p className="text-muted mb-6 text-sm">
            Free, instant, no account needed.
          </p>
          <ScrollToTopButton />
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-border bg-muted/20">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-foreground flex items-center justify-center">
              <Zap size={10} className="text-background" />
            </div>
            <span>AIAudit by Credex · {new Date().getFullYear()}</span>
          </div>
          <Link
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            credex.rocks →
          </Link>
        </div>
      </footer>
    </main>
  );
}