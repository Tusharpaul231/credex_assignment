"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TOOL_DEFINITIONS, TOOL_MAP } from "@/lib/pricingData";
import { ToolInput, ToolKey } from "@/types";

interface ToolRowProps {
  row: ToolInput;
  onChange: (id: string, field: keyof ToolInput, value: string | number) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

export default function ToolRow({ row, onChange, onRemove, canRemove }: ToolRowProps) {
  const selectedTool = TOOL_MAP[row.tool];
  const isUsageBased = row.plan === "payg" || row.plan === "api";

  return (
    <div className="grid grid-cols-12 gap-2 items-center p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/30 transition-colors">

      {/* Tool selector */}
      <div className="col-span-12 sm:col-span-4">
        <Select
          value={row.tool}
          onValueChange={(val) => {
            const firstPlan = TOOL_DEFINITIONS.find((t) => t.key === val)?.plans[0].value ?? "";
            onChange(row.id, "tool", val as ToolKey);
            onChange(row.id, "plan", firstPlan);
            onChange(row.id, "monthlySpend", 0);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select tool" />
          </SelectTrigger>
          <SelectContent>
            {TOOL_DEFINITIONS.map((t) => (
              <SelectItem key={t.key} value={t.key}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Plan selector */}
      <div className="col-span-12 sm:col-span-3">
        <Select
          value={row.plan}
          onValueChange={(val) => onChange(row.id, "plan", val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select plan" />
          </SelectTrigger>
          <SelectContent>
            {selectedTool?.plans.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
                {p.monthly > 0 && (
                  <span className="text-muted-foreground ml-1 text-xs">
                    (${p.monthly}/mo)
                  </span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Monthly spend */}
      <div className="col-span-5 sm:col-span-2">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            $
          </span>
          <Input
            type="number"
            min={0}
            placeholder={isUsageBased ? "e.g. 340" : "auto"}
            value={row.monthlySpend === 0 && !isUsageBased ? "" : row.monthlySpend}
            onChange={(e) =>
              onChange(row.id, "monthlySpend", parseFloat(e.target.value) || 0)
            }
            className="pl-7"
          />
        </div>
      </div>

      {/* Seats — 2 cols */}
      <div className="col-span-5 sm:col-span-2">
        <Input
          type="number"
          min={1}
          value={row.seats}
          onChange={(e) =>
            onChange(row.id, "seats", parseInt(e.target.value) || 1)
          }
          placeholder="1"
        />
      </div>

      {/* Remove button */}
      <div className="col-span-2 sm:col-span-1 flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={!canRemove}
          onClick={() => onRemove(row.id)}
          className="text-muted-foreground hover:text-destructive h-9 w-9"
          aria-label="Remove tool"
        >
          <Trash2 size={15} />
        </Button>
      </div>
    </div>
  );
}