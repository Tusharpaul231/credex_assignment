"use client";

import dynamic from "next/dynamic";

const SpendForm = dynamic(() => import("@/components/SpendForm"), {
  ssr: false,
  loading: () => (
    <div className="rounded-lg border border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
      Loading form...
    </div>
  ),
});

export default function SpendFormWrapper() {
  return <SpendForm />;
}