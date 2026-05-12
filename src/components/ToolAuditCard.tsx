import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { ToolAudit } from "@/types";

interface ToolAuditCardProps {
  audit: ToolAudit;
}

export default function ToolAuditCard({ audit }: ToolAuditCardProps) {
  const isOptimal = audit.isOptimal;

  return (
    <div
      className={`rounded-xl border p-5 transition-colors ${
        isOptimal
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-orange-500/30 bg-orange-500/5"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          {isOptimal ? (
            <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <h3 className="font-semibold text-foreground leading-tight">{audit.tool}</h3>
            <p className="text-xs text-muted-foreground capitalize">{audit.plan} plan</p>
          </div>
        </div>

        {audit.savings > 0 && (
          <Badge
            variant="outline"
            className="bg-orange-500/20 text-orange-400 border border-orange-500/30 font-semibold whitespace-nowrap hover:bg-orange-500/20"
          >
            Save ${audit.savings}/mo
          </Badge>
        )}

        {isOptimal && (
          <Badge
            variant="outline"
            className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold hover:bg-emerald-500/20"
          >
            Optimal ✓
          </Badge>
        )}
      </div>

      {/* Current → Recommended */}
      {!isOptimal && (
        <div className="flex items-center gap-2 mb-3 text-sm">
          <span className="bg-muted rounded px-2 py-0.5 font-mono text-xs text-muted-foreground line-through">
            ${audit.currentSpend}/mo
          </span>
          <ArrowRight size={14} className="text-muted-foreground" />
          <span className="bg-emerald-500/20 text-emerald-400 rounded px-2 py-0.5 font-mono text-xs font-medium">
            ${(audit.currentSpend - audit.savings).toFixed(0)}/mo
          </span>
          <span className="text-xs text-muted-foreground">→ {audit.recommendedAction}</span>
        </div>
      )}

      {/* Reason */}
      <p className="text-sm text-muted-foreground leading-relaxed">{audit.reason}</p>
    </div>
  );
}