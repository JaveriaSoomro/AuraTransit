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
      className={`relative h-44 w-full overflow-hidden rounded-2xl bg-[#0c3136] border border-white/10 ${className}`}
    >
      <svg viewBox="0 0 400 160" className="h-full w-full">
        {/* Subtle grid */}
        <line x1="0" y1="40" x2="400" y2="40" stroke="#145c63" strokeWidth="1" opacity="0.4" />
        <line x1="0" y1="80" x2="400" y2="80" stroke="#145c63" strokeWidth="2" opacity="0.6" />
        <line x1="0" y1="120" x2="400" y2="120" stroke="#145c63" strokeWidth="1" opacity="0.4" />
        <line x1="100" y1="0" x2="100" y2="160" stroke="#145c63" strokeWidth="1" opacity="0.4" />
        <line x1="200" y1="0" x2="200" y2="160" stroke="#145c63" strokeWidth="2" opacity="0.6" />
        <line x1="300" y1="0" x2="300" y2="160" stroke="#145c63" strokeWidth="1" opacity="0.4" />

        {/* Animated route trace */}
        <path
          className="route-path"
          d="M 30 120 Q 120 30, 200 80 T 370 40"
          stroke="#F4C95D"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Stop markers */}
        <circle cx="30" cy="120" r="6" fill="#78B89A" stroke="#102f34" strokeWidth="2" />
        <circle cx="140" cy="65" r="5" fill="#F7F3E8" stroke="#102f34" strokeWidth="1.5" />
        <circle cx="200" cy="80" r="5" fill="#F7F3E8" stroke="#102f34" strokeWidth="1.5" />
        <circle cx="280" cy="85" r="5" fill="#F7F3E8" stroke="#102f34" strokeWidth="1.5" />
        <circle cx="370" cy="40" r="7" fill="#F4C95D" stroke="#102f34" strokeWidth="2" />
      </svg>

      <div className="absolute bottom-2.5 left-3 rounded-lg bg-[#102f34]/90 px-2.5 py-1 text-[11px] font-semibold text-ivory backdrop-blur-xs">
        {effectiveRouteName} · {effectiveStops.length > 0 ? `${effectiveStops.length} Stops` : "Active Route Trace"}
      </div>
    </div>
  );
}
