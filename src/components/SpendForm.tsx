"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { Plus, Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ToolRow from "@/components/ToolRow";
import { TOOL_DEFINITIONS } from "@/lib/pricingData";
import { FormInput, ToolInput, ToolKey, UseCaseKey } from "@/types";

const STORAGE_KEY = "aiaudit_form_state";

const USE_CASES: { value: UseCaseKey; label: string }[] = [
  { value: "coding",   label: "Coding / Engineering" },
  { value: "writing",  label: "Writing / Content" },
  { value: "data",     label: "Data / Analytics" },
  { value: "research", label: "Research" },
  { value: "mixed",    label: "Mixed / General" },
];

function makeEmptyRow(): ToolInput {
  return {
    id: nanoid(8),
    tool: TOOL_DEFINITIONS[0].key as ToolKey,
    plan: TOOL_DEFINITIONS[0].plans[0].value,
    monthlySpend: 0,
    seats: 1,
  };
}

const DEFAULT_FORM: FormInput = {
  tools: [makeEmptyRow()],
  teamSize: 1,
  useCase: "coding",
};

export default function SpendForm() {
  const router = useRouter();
  //const [form, setForm] = useState<FormInput>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  //const [hydrated, setHydrated] = useState(false);

  // Load persisted state on mount
  const [form, setForm] = useState<FormInput>(() => {
    // Only runs on client, so check for window
    if (typeof window === "undefined") return DEFAULT_FORM;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: FormInput = JSON.parse(saved);
        if (parsed.tools && Array.isArray(parsed.tools)) return parsed;
      }
    } catch {}
    return DEFAULT_FORM;
  });

  /* Persist on every change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {
      // Storage full or unavailable silently ignore for now
    }
  }, [form, hydrated]);*/
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {}
  }, [form]);


  // Handlers

  function addTool() {
    if (form.tools.length >= 8) {
      toast.info("You can add up to 8 tools.");
      return;
    }
    setForm((prev) => ({ ...prev, tools: [...prev.tools, makeEmptyRow()] }));
  }

  function removeTool(id: string) {
    setForm((prev) => ({ ...prev, tools: prev.tools.filter((t) => t.id !== id) }));
  }

  function updateTool(id: string, field: keyof ToolInput, value: string | number) {
    setForm((prev) => ({
      ...prev,
      tools: prev.tools.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    }));
  }

  function setTeamSize(val: string) {
    const n = parseInt(val) || 1;
    setForm((prev) => ({ ...prev, teamSize: Math.max(1, n) }));
  }

  function setUseCase(val: UseCaseKey) {
    setForm((prev) => ({ ...prev, useCase: val }));
  }

  // Validation

  function validate(): string | null {
    if (form.tools.length === 0) return "Add at least one AI tool.";
    for (const t of form.tools) {
      if (!t.tool) return "Please select a tool for every row.";
      if (!t.plan) return "Please select a plan for every row.";
      if (t.seats < 1) return "Seats must be at least 1.";
      // API / usage-based tools must have a spend entered
      const isUsageBased = t.plan === "payg" || t.plan === "api";
      if (isUsageBased && t.monthlySpend <= 0)
        return `Enter your actual monthly spend for ${t.tool.replace("_", " ")}.`;
    }
    if (form.teamSize < 1) return "Team size must be at least 1.";
    return null;
  }

  // Submit

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      const { id } = await res.json();
      // Clear persisted form after successful submission
      localStorage.removeItem(STORAGE_KEY);
      router.push(`/audit/${id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  // Compute total for preview

  const totalMonthly = form.tools.reduce((sum, t) => sum + (t.monthlySpend || 0), 0);

  // Don't render until localStorage is loaded to avoid hydration flash
  //if (!hydrated) return null;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <Zap size={20} className="text-primary" />
            Your AI Tool Stack
          </CardTitle>
          <CardDescription>
            Add every AI tool your team pays for. We&apos;ll calculate exactly where
            you&apos;re overspending and what to do about it.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Tool rows */}
          <div className="space-y-3">
            {/* Column headers only shown on sm+ */}
            <div className="hidden sm:grid grid-cols-12 gap-3 px-4">
              <span className="col-span-3 text-xs font-medium text-muted-foreground">Tool</span>
              <span className="col-span-3 text-xs font-medium text-muted-foreground">Plan</span>
              <span className="col-span-2 text-xs font-medium text-muted-foreground">Monthly Spend</span>
              <span className="col-span-2 text-xs font-medium text-muted-foreground">Seats</span>
            </div>

            {form.tools.map((row, i) => (
              <ToolRow
                key={row.id}
                row={row}
                index={i}
                onChange={updateTool}
                onRemove={removeTool}
                canRemove={form.tools.length > 1}
              />
            ))}
          </div>

          {/* Add tool button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTool}
            disabled={form.tools.length >= 8}
            className="w-full border-dashed"
          >
            <Plus size={14} className="mr-1.5" />
            Add another tool
          </Button>

          {/* Team details */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
            <div className="space-y-1.5">
              <Label htmlFor="teamSize">Team size</Label>
              <Input
                id="teamSize"
                type="number"
                min={1}
                value={form.teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                placeholder="e.g. 5"
              />
              <p className="text-xs text-muted-foreground">Total people at your company</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="useCase">Primary use case</Label>
              <Select value={form.useCase} onValueChange={(v) => setUseCase(v as UseCaseKey)}>
                <SelectTrigger id="useCase">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {USE_CASES.map((u) => (
                    <SelectItem key={u.value} value={u.value}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">What your team mainly uses AI for</p>
            </div>
          </div>

          {/* Honeypot field hidden from real users, catches bots */}
          <input
            type="text"
            name="_hp_website"
            tabIndex={-1}
            aria-hidden="true"
            autoComplete="off"
            className="hidden"
          />

          {/* Spend preview + submit */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">Current monthly spend</p>
              <p className="text-2xl font-bold tabular-nums">
                ${totalMonthly.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                <span className="text-sm font-normal text-muted-foreground">/mo</span>
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="min-w-[160px]"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Auditing…
                </>
              ) : (
                <>
                  <Zap size={16} className="mr-2" />
                  Run Free Audit
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}