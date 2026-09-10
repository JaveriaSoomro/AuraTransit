import React from "react";
import { cn, formatStatus } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
  dot?: boolean;
}

export function StatusBadge({ status, label, className, dot = true }: StatusBadgeProps) {
  const normalized = status.toLowerCase();

  let badgeClass = "bg-ink/6 text-ink/75 border-ink/10";
  let dotClass = "bg-ink/40";

  // Green statuses
  if (
    [
      "active",
      "on_route",
      "at_stop",
      "completed",
      "on_duty",
      "paid",
      "on_board",
    ].includes(normalized)
  ) {
    badgeClass = "bg-[#78b89a]/18 text-[#0c4738] border-[#78b89a]/35";
    dotClass = "bg-[#288f6b]";
  }
  // Yellow / Attention statuses
  else if (
    [
      "delayed",
      "in_progress",
      "scheduled",
      "trial",
      "pending",
      "attention",
    ].includes(normalized)
  ) {
    badgeClass = "bg-[#f4c95d]/25 text-[#6c4e00] border-[#f4c95d]/50";
    dotClass = "bg-[#c58a00]";
  }
  // Neutral / Standby statuses
  else if (
    [
      "inactive",
      "off_duty",
      "dropped_off",
      "absent",
      "starter",
    ].includes(normalized)
  ) {
    badgeClass = "bg-ink/8 text-ink/70 border-ink/12";
    dotClass = "bg-ink/40";
  }
  // Critical / Red statuses (used strictly where appropriate)
  else if (
    [
      "maintenance",
      "suspended",
      "overdue",
      "cancelled",
      "missed",
      "offline",
    ].includes(normalized)
  ) {
    badgeClass = "bg-red-50 text-red-700 border-red-200";
    dotClass = "bg-red-500";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide whitespace-nowrap",
        badgeClass,
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full shrink-0",
            dotClass,
            normalized === "on_route" && "animate-pulse",
          )}
        />
      )}
      {label || formatStatus(status)}
    </span>
  );
}
