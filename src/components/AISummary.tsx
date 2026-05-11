import { Sparkles } from "lucide-react";

interface AISummaryProps {
  summary: string;
}

export default function AISummary({ summary }: AISummaryProps) {
  if (!summary) return null;

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={15} className="text-primary" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          AI-generated summary
        </span>
      </div>
      <p className="text-sm text-foreground leading-relaxed">{summary}</p>
    </div>
  );
}