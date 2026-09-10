"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "sun" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  }[size];

  const variantStyles = {
    primary:
      "bg-teal text-white hover:bg-[#0e4348] active:scale-[0.99] shadow-sm font-semibold",
    secondary:
      "bg-white border border-ink/12 text-ink hover:bg-ivory hover:border-ink/25 font-semibold shadow-xs",
    sun:
      "bg-sun text-ink hover:brightness-95 active:scale-[0.99] font-semibold shadow-xs",
    ghost:
      "text-ink/70 hover:text-ink hover:bg-ink/5 font-medium",
    outline:
      "border border-teal text-teal hover:bg-teal/5 font-semibold",
    danger:
      "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-semibold",
  }[variant];

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none",
        sizeStyles,
        variantStyles,
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
