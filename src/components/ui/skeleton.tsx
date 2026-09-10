import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-ink/6",
        className,
      )}
      {...props}
    />
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full space-y-3 p-4">
      <div className="flex gap-4">
        <Skeleton className="h-8 w-1/4 rounded-xl" />
        <Skeleton className="h-8 w-1/4 rounded-xl" />
        <Skeleton className="h-8 w-1/4 rounded-xl" />
        <Skeleton className="h-8 w-1/4 rounded-xl" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-2xl" />
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-[28px] border border-ink/8 bg-white p-6 space-y-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}
