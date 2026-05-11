"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LeadCaptureProps {
  auditId: string;
  isSoftCapture: boolean; // true = "notify me" CTA, false = full form
}

export default function LeadCapture({ auditId, isSoftCapture }: LeadCaptureProps) {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audit_id: auditId,
          email,
          company_name: companyName || undefined,
          role: role || undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setSubmitted(true);
      toast.success("You're on the list! Check your inbox shortly.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-2">
        <p className="text-sm font-medium text-emerald-700">
          ✓ Got it! Check your inbox for your audit report.
        </p>
      </div>
    );
  }

  if (isSoftCapture) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
        {/* Honeypot */}
        <input type="text" name="_hp_website" className="hidden" tabIndex={-1} aria-hidden="true" autoComplete="off" />
        <Input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? <Loader2 size={14} className="animate-spin" /> : "Notify me"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Honeypot */}
      <input type="text" name="_hp_website" className="hidden" tabIndex={-1} aria-hidden="true" autoComplete="off" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Input
            type="email"
            placeholder="Work email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            type="text"
            placeholder="Company name (optional)"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Input
            type="text"
            placeholder="Your role (optional, e.g. CTO, Engineering Manager)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 size={15} className="mr-2 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Mail size={15} className="mr-2" />
            Send me the report
          </>
        )}
      </Button>
      <p className="text-xs text-center text-muted-foreground">
        No spam. Your email is never shown on the public share link.
      </p>
    </form>
  );
}