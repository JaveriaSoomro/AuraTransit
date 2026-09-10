"use client";

import React from "react";
import { Search, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOption {
  key: string;
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

interface FilterBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  hideSearch?: boolean;
  filters?: FilterOption[];
  onResetFilters?: () => void;
  totalResults?: number;
  className?: string;
  rightActions?: React.ReactNode;
}

export function FilterBar({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  hideSearch = false,
  filters = [],
  onResetFilters,
  totalResults,
  className,
  rightActions,
}: FilterBarProps) {
  const hasActiveFilters =
    (!hideSearch && searchValue.trim().length > 0) ||
    filters.some((f) => f.value && f.value !== "all" && f.value !== "");

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[28px] border border-ink/8 bg-white p-3.5 shadow-2xs sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      {/* Search and Dropdowns */}
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        {/* Search Input */}
        {!hideSearch && onSearchChange && (
          <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-full border border-ink/12 bg-ivory/60 py-2 pl-9 pr-8 text-xs font-medium text-ink placeholder:text-ink/40 transition focus:border-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/15"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        )}

        {/* Dynamic Filters */}
        {filters.map((filter) => (
          <div key={filter.key} className="relative shrink-0">
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="appearance-none rounded-full border border-ink/12 bg-white px-3.5 py-2 pr-8 text-xs font-medium text-ink transition hover:border-ink/25 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/15 cursor-pointer shadow-2xs"
            >
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/40 text-[10px]">
              ▼
            </span>
          </div>
        ))}

        {/* Reset Filters button */}
        {hasActiveFilters && onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-teal hover:bg-teal/5 transition"
          >
            <X className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Right stats or extra action toggles */}
      <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-ink/55 pt-1 sm:pt-0">
        {typeof totalResults === "number" && (
          <span className="font-medium whitespace-nowrap">
            Showing <strong className="text-ink">{totalResults}</strong> items
          </span>
        )}
        {rightActions}
      </div>
    </div>
  );
}
