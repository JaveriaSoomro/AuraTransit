import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}: InputProps) {
  const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={generatedId}
          className="block text-xs font-semibold text-ink/75"
        >
          {label}
        </label>
      )}
      <input
        id={generatedId}
        className={cn(
          "w-full rounded-2xl border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink/35 transition focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/15 disabled:bg-ink/5 disabled:cursor-not-allowed",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/15",
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-ink/50">{helperText}</p>
      )}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export function Select({
  label,
  error,
  options,
  className,
  id,
  ...props
}: SelectProps) {
  const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={generatedId}
          className="block text-xs font-semibold text-ink/75"
        >
          {label}
        </label>
      )}
      <select
        id={generatedId}
        className={cn(
          "w-full rounded-2xl border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink transition focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/15 disabled:bg-ink/5 disabled:cursor-not-allowed",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/15",
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  className,
  id,
  ...props
}: TextareaProps) {
  const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={generatedId}
          className="block text-xs font-semibold text-ink/75"
        >
          {label}
        </label>
      )}
      <textarea
        id={generatedId}
        rows={3}
        className={cn(
          "w-full rounded-2xl border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink/35 transition focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/15 disabled:bg-ink/5 disabled:cursor-not-allowed",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/15",
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
