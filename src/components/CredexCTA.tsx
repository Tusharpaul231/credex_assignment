import { ExternalLink, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CredexCTAProps {
  totalMonthlySavings: number;
}

export default function CredexCTA({ totalMonthlySavings }: CredexCTAProps) {
  return (
    <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6">
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-primary/10 flex-shrink-0">
          <Zap className="text-primary" size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-lg mb-1">
            Capture more of that ${totalMonthlySavings.toLocaleString()}/mo with Credex
          </h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Credex sells discounted AI infrastructure credits - Cursor, Claude, ChatGPT
            Enterprise, and others - sourced from companies that overforecast or pivoted.
            The discount is real and substantial. Same API, same models, lower price.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="sm">
              <a
                href="https://credex.rocks"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5"
              >
                Book a free consultation
                <ExternalLink size={13} />
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://credex.rocks"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn how credits work →
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}