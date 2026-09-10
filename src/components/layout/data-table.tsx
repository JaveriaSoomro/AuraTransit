"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  pageSize?: number;
  emptyState?: React.ReactNode;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  pageSize = 10,
  emptyState,
  className,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = data.slice(startIndex, startIndex + pageSize);

  if (data.length === 0) {
    return (
      <div className="w-full">
        {emptyState || (
          <EmptyState
            title="No records found"
            description="Try changing your filters or add a new entry to get started."
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[28px] border border-ink/8 bg-white shadow-xs",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-ink border-collapse">
          <thead>
            <tr className="border-b border-ink/8 bg-ivory/40">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-5 py-4 text-[11px] font-bold tracking-[0.16em] uppercase text-ink/60 select-none whitespace-nowrap",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/6">
            {currentData.map((item, index) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  "transition-colors duration-150 group",
                  onRowClick
                    ? "cursor-pointer hover:bg-ivory/50"
                    : "hover:bg-ivory/30",
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-5 py-4 text-sm text-ink align-middle whitespace-nowrap",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center",
                      col.className,
                    )}
                  >
                    {col.render
                      ? col.render(item, startIndex + index)
                      : String((item as Record<string, unknown>)[col.key] ?? "-")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-ink/8 bg-ivory/20 px-6 py-3.5 text-xs text-ink/60">
          <div>
            Showing <span className="font-semibold text-ink">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-ink">
              {Math.min(startIndex + pageSize, data.length)}
            </span>{" "}
            of <span className="font-semibold text-ink">{data.length}</span> results
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 bg-white text-ink hover:bg-ivory disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="px-2 font-semibold text-ink">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 bg-white text-ink hover:bg-ivory disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
