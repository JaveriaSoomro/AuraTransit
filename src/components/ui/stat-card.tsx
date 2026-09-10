import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  note?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  variant?: "white" | "teal" | "mist";
  className?: string;
}

export function StatCard({
  label,
  value,
  note,
  change,
  changeType = "positive",
  icon,
  variant = "white",
  className,
}: StatCardProps) {
  const isTeal = variant === "teal";

  return (
    <div
      className={cn(
        "rounded-[28px] p-5 sm:p-6 transition-all duration-300 relative overflow-hidden",
        isTeal
          ? "bg-teal text-white shadow-sm"
          : variant === "mist"
          ? "bg-mist/80 border border-ink/8 text-ink shadow-xs"
          : "bg-white border border-ink/8 text-ink shadow-xs",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className={cn(
            "text-[11px] font-semibold tracking-[0.18em] uppercase",
            isTeal ? "text-ivory/70" : "text-ink/55",
          )}
        >
          {label}
        </p>
        {icon && (
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-2xl shrink-0",
              isTeal ? "bg-white/10 text-sun" : "bg-ivory text-teal",
            )}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <p
          className={cn(
            "text-3xl sm:text-4xl font-semibold tracking-[-0.04em]",
            isTeal ? "text-white" : "text-ink",
          )}
        >
          {value}
        </p>
        {change && (
          <span
            className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-full",
              changeType === "positive"
                ? isTeal
                  ? "bg-aura/30 text-ivory"
                  : "bg-aura/20 text-[#0c4738]"
                : changeType === "negative"
                ? "bg-red-500/20 text-red-700"
                : "bg-ink/10 text-ink/70",
            )}
          >
            {change}
          </span>
        )}
      </div>

      {note && (
        <p
          className={cn(
            "mt-2 text-xs",
            isTeal ? "text-ivory/65" : "text-ink/50",
          )}
        >
          {note}
        </p>
      )}
    </div>
  );
}
