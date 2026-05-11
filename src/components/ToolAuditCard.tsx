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
          ? "border-emerald-200 bg-emerald-50/50"
          : "border-orange-200 bg-orange-50/50"
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
            className="border-orange-300 bg-orange-100 text-orange-700 font-semibold whitespace-nowrap"
          >
            Save ${audit.savings}/mo
          </Badge>
        )}

        {isOptimal && (
          <Badge
            variant="outline"
            className="border-emerald-300 bg-emerald-100 text-emerald-700 font-semibold"
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
          <span className="bg-emerald-100 text-emerald-800 rounded px-2 py-0.5 font-mono text-xs font-medium">
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