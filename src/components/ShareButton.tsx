"use client";

import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareButtonProps {
  auditId: string;
}

export default function ShareButton({ auditId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/audit/${auditId}`
      : `${process.env.NEXT_PUBLIC_APP_URL}/audit/${auditId}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy - try selecting the URL manually.");
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My AI Spend Audit",
          text: "I just audited my AI tool spend - here are the results.",
          url: shareUrl,
        });
      } catch {
        // User cancelled share, do nothing
      }
    } else {
      handleCopy();
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      {/* URL display */}
      <div className="flex-1 flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 min-w-0">
        <span className="text-xs text-muted-foreground truncate flex-1 font-mono">
          {shareUrl}
        </span>
      </div>

      {/* Copy button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="flex-shrink-0"
      >
        {copied ? (
          <>
            <Check size={14} className="mr-1.5 text-emerald-600" />
            Copied!
          </>
        ) : (
          <>
            <Copy size={14} className="mr-1.5" />
            Copy link
          </>
        )}
      </Button>

      {/* Native share (mobile) */}
      <Button
        variant="default"
        size="sm"
        onClick={handleShare}
        className="flex-shrink-0"
      >
        <Share2 size={14} className="mr-1.5" />
        Share
      </Button>
    </div>
  );
}