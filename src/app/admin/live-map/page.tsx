"use client";

import React, { useState } from "react";
import {
  MapPin,
  RefreshCw,
  SlidersHorizontal,
  Info,
  Layers,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { LiveMapView } from "@/components/maps/live-map-view";
import { useAuraStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";

export default function LiveMapPage() {
  const { vehicles, currentSchool } = useAuraStore();
  const { showToast } = useToast();
  const [selectedId, setSelectedId] = useState<string>(vehicles[0]?.id || "");

  const handleRefresh = () => {
    showToast("Live GPS telemetry refreshed from vehicle beacons.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Live Fleet Map"
        description="Real-time GPS tracking and live status across Lincoln International School routes. Monitor cab movement, upcoming stops, and onboard student counts."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
            <span className="h-2 w-2 rounded-full bg-aura animate-pulse" />
            Active Beacon Feed
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw className="h-4 w-4" />}
              onClick={handleRefresh}
            >
              Refresh Telemetry
            </Button>
          </div>
        }
      />

      {/* Map Information Callout */}
      <div className="flex items-center justify-between rounded-2xl border border-teal/20 bg-teal/5 px-4 py-3 text-xs text-teal">
        <div className="flex items-center gap-2.5">
          <Info className="h-4 w-4 shrink-0" />
          <span>
            Connected to <strong>8 active vehicle transponders</strong>. Cellular latency: <strong>42ms</strong>.
          </span>
        </div>
        <span className="hidden sm:inline-block text-[11px] font-semibold opacity-75">
          Chicago District Zone 3
        </span>
      </div>

      {/* Dedicated Interactive Live Map View */}
      <LiveMapView
        vehicles={vehicles}
        selectedVehicleId={selectedId}
        onSelectVehicle={setSelectedId}
        className="min-h-[680px]"
      />
    </div>
  );
}
