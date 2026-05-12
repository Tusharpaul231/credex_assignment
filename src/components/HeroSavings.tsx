"use client";

import { TrendingDown, TrendingUp } from "lucide-react";

interface HeroSavingsProps {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isAlreadyOptimal: boolean;
}

export default function HeroSavings({
  totalMonthlySavings,
  totalAnnualSavings,
  isAlreadyOptimal,
}: HeroSavingsProps) {
  if (isAlreadyOptimal) {
    return (
      <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center">
        <div className="flex justify-center mb-3">
          <div className="p-3 rounded-full bg-emerald-100">
            <TrendingUp className="text-emerald-600" size={28} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-emerald-800 mb-2">
          You&apos;re spending well 🎉
        </h2>
        <p className="text-emerald-700 max-w-md mx-auto text-sm">
          Based on your team size and use case, your current AI stack is
          right-sized. No obvious overspend detected. Come back when your
          stack changes.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-zinc-900 border border-zinc-700 p-8 text-white shadow-xl">
      <div className="flex justify-center mb-3">
        <div className="p-3 rounded-full bg-white/20">
          <TrendingDown className="text-white" size={28} />
        </div>
      </div>
      <p className="text-white/80 text-sm font-medium uppercase tracking-widest mb-1">
        Potential savings identified
      </p>
      <div className="flex items-end justify-center gap-4 my-3">
        <div>
          <span className="text-6xl font-black tabular-nums">
            ${totalMonthlySavings.toLocaleString()}
          </span>
          <span className="text-white/70 text-lg">/mo</span>
        </div>
      </div>
      <div className="inline-block bg-white/20 rounded-full px-4 py-1.5 text-sm font-semibold">
        ${totalAnnualSavings.toLocaleString()} saved per year
      </div>
    </div>
  );
}