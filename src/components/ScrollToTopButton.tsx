"use client";

import { ArrowRight } from "lucide-react";

export default function ScrollToTopButton() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="inline-flex items-center gap-2 bg-background text-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:bg-background/90 transition-colors"
    >
      Run free audit
      <ArrowRight size={15} />
    </button>
  );
}