
import type { Metadata } from "next";
import SpendFormWrapper from "@/components/SpendFormWrapper";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingDown, Share2, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "AIAudit - Free AI Spend Audit for Startups",
  description:
    "Find out exactly where your team is overspending on AI tools. Free instant audit. No login required.",
  openGraph: {
    title: "AIAudit - Free AI Spend Audit for Startups",
    description:
      "Find out exactly where your team is overspending on AI tools. Free instant audit. No login required.",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIAudit - Free AI Spend Audit for Startups",
    description: "Find out exactly where your team is overspending on AI tools.",
    images: ["/og-default.png"],
  },
};

const FEATURES = [
  {
    icon: <TrendingDown size={18} className="text-primary" />,
    title: "Instant savings estimate",
    desc: "See exactly how much you could save - per tool, per month, per year.",
  },
  {
    icon: <Zap size={18} className="text-primary" />,
    title: "Smart recommendations",
    desc: "Right-size plans, remove overlapping tools, and find cheaper alternatives.",
  },
  {
    icon: <Share2 size={18} className="text-primary" />,
    title: "Shareable audit report",
    desc: "Get a unique URL to share your audit with your team or investors.",
  },
  {
    icon: <ShieldCheck size={18} className="text-primary" />,
    title: "No login required",
    desc: "Just fill in your tools and get your report. Email optional, always after.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/*Nav*/}
      <nav className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <Zap size={20} className="text-primary" />
            AIAudit
          </div>
          <Badge variant="secondary" className="text-xs">Free tool by Credex</Badge>
        </div>
      </nav>

      {/*Hero*/}
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-10 text-center">
        <Badge className="mb-4 text-xs" variant="outline">
          No signup · No credit card · Instant results
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-4">
          Are you overpaying for{" "}
          <span className="text-primary">AI tools?</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
          Enter your AI subscriptions and get an instant audit - where you&apos;re
          overspending, what to switch, and your total potential savings.
        </p>

        {/* Social proof mocked for now. update with real numbers post-launch */}
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">1,200+ teams</span> audited ·
          avg. savings{" "}
          <span className="font-medium text-foreground">$340/mo</span>
          {" "}· takes{" "}
          <span className="font-medium text-foreground">2 minutes</span>
        </p>
      </section>

      {/*Form*/}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <SpendFormWrapper />
      </section>

      {/*Feature highlights*/}
      <section className="max-w-5xl mx-auto px-4 py-12 border-t border-border">
        <h2 className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">
          What you get
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {f.icon}
                <span className="font-medium text-sm">{f.title}</span>
              </div>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/*Footer*/}
      <footer className="border-t border-border bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} AIAudit by Credex</span>
          <a
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            credex.rocks →
          </a>
        </div>
      </footer>
    </main>
  );
}