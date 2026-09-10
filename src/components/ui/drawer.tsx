"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: "md" | "lg" | "xl";
}

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  description,
  children,
  footer,
  width = "lg",
}: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const widthClass = {
    md: "max-w-md",
    lg: "max-w-xl",
    xl: "max-w-2xl",
  }[width];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
        <div
          className={cn(
            "relative w-screen bg-white shadow-2xl flex flex-col border-l border-ink/8 sm:rounded-l-[32px] overflow-hidden",
            widthClass,
          )}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-ink/8 px-6 py-5 sm:px-8">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-ink">
                {title}
              </h3>
              {(subtitle || description) && (
                <p className="mt-0.5 text-xs text-ink/55">{subtitle || description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory text-ink/70 hover:bg-ink/5 hover:text-ink transition"
              aria-label="Close drawer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-6">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 border-t border-ink/8 bg-ivory/40 px-6 py-4 sm:px-8">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
