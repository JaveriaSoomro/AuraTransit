import React from "react";
import { Route, RouteStop } from "@/types/dashboard";

interface RouteMapPreviewProps {
  routeName?: string;
  route?: Route;
  stops?: RouteStop[];
  className?: string;
}

export function RouteMapPreview({
  routeName,
  route,
  stops,
  className,
}: RouteMapPreviewProps) {
  const effectiveRouteName = route?.name || routeName || "Active Corridor";
  const effectiveStops = stops || route?.stops || [];
  return (
    <div
      className={`relative h-44 w-full overflow-hidden rounded-2xl bg-[#f8fafc] border border-slate-200 shadow-inner ${className}`}
    >
      <svg viewBox="0 0 400 160" className="h-full w-full">
        {/* Subtle street grid */}
        <line x1="0" y1="40" x2="400" y2="40" stroke="#e2e8f0" strokeWidth="1" />
        <line x1="0" y1="80" x2="400" y2="80" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="0" y1="120" x2="400" y2="120" stroke="#e2e8f0" strokeWidth="1" />
        <line x1="100" y1="0" x2="100" y2="160" stroke="#e2e8f0" strokeWidth="1" />
        <line x1="200" y1="0" x2="200" y2="160" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="300" y1="0" x2="300" y2="160" stroke="#e2e8f0" strokeWidth="1" />

        {/* Animated route trace */}
        <path
          className="route-path"
          d="M 30 120 Q 120 30, 200 80 T 370 40"
          stroke="#145C63"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        {/* Stop markers */}
        <circle cx="30" cy="120" r="6" fill="#145C63" stroke="#ffffff" strokeWidth="2" />
        <circle cx="140" cy="65" r="5" fill="#F4C95D" stroke="#183238" strokeWidth="1.5" />
        <circle cx="200" cy="80" r="5" fill="#F4C95D" stroke="#183238" strokeWidth="1.5" />
        <circle cx="280" cy="85" r="5" fill="#F4C95D" stroke="#183238" strokeWidth="1.5" />
        <circle cx="370" cy="40" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
      </svg>

      <div className="absolute bottom-2.5 left-3 rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-slate-800 shadow-sm border border-slate-200">
        {effectiveRouteName} · {effectiveStops.length > 0 ? `${effectiveStops.length} Stops` : "Active Route Trace"}
      </div>
    </div>
  );
}
