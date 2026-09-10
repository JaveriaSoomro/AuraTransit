"use client";

import React, { useState, useMemo } from "react";
import {
  Bus,
  MapPin,
  Clock,
  Users,
  Navigation,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Phone,
  AlertTriangle,
  Radio,
  Layers,
} from "lucide-react";
import { Vehicle } from "@/types/dashboard";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LiveMapViewProps {
  vehicles: Vehicle[];
  selectedVehicleId?: string;
  onSelectVehicle?: (id: string) => void;
  className?: string;
}

export function LiveMapView({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  className,
}: LiveMapViewProps) {
  const [activeVehicleId, setActiveVehicleId] = useState<string>(
    selectedVehicleId || vehicles[0]?.id || "",
  );
  const [zoomLevel, setZoomLevel] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [mapStyle, setMapStyle] = useState<"branded" | "satellite">("branded");

  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.id === activeVehicleId) || vehicles[0],
    [vehicles, activeVehicleId],
  );

  const filteredVehicles = useMemo(() => {
    if (filterStatus === "all") return vehicles;
    return vehicles.filter((v) => v.status === filterStatus);
  }, [vehicles, filterStatus]);

  const handleVehicleClick = (id: string) => {
    setActiveVehicleId(id);
    onSelectVehicle?.(id);
  };

  // Map coordinates simulation for SVG overlay
  const vehicleMarkers = [
    { id: "veh-1", x: 280, y: 190, label: "BUS-104", status: "on_route" },
    { id: "veh-2", x: 440, y: 120, label: "BUS-108", status: "on_route" },
    { id: "veh-3", x: 210, y: 280, label: "BUS-101", status: "at_stop" },
    { id: "veh-4", x: 530, y: 220, label: "BUS-112", status: "delayed" },
    { id: "veh-5", x: 350, y: 320, label: "VAN-201", status: "active" },
    { id: "veh-6", x: 160, y: 160, label: "EV-301", status: "maintenance" },
  ];

  return (
    <div
      className={cn(
        "relative grid grid-cols-1 lg:grid-cols-[340px_1fr] overflow-hidden rounded-[32px] border border-ink/8 bg-[#102f34] shadow-xl",
        className,
      )}
    >
      {/* Left Column: Vehicle Selector & Telemetry List */}
      <div className="flex flex-col border-r border-white/10 bg-[#0e272b] h-[580px] lg:h-[700px]">
        {/* Header & Status Filter Pills */}
        <div className="border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-aura animate-pulse" />
              <p className="text-xs font-bold tracking-wider text-ivory uppercase">
                Fleet Movement
              </p>
            </div>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-sun">
              {vehicles.filter((v) => v.status === "on_route").length} Active
            </span>
          </div>

          {/* Quick Filter buttons */}
          <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
            {[
              { id: "all", label: "All Fleet" },
              { id: "on_route", label: "On Route" },
              { id: "at_stop", label: "At Stop" },
              { id: "delayed", label: "Delayed" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition",
                  filterStatus === tab.id
                    ? "bg-sun text-ink shadow-xs"
                    : "bg-white/8 text-ivory/70 hover:bg-white/15 hover:text-white",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Vehicle List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filteredVehicles.map((vehicle) => {
            const isSelected = vehicle.id === activeVehicleId;
            return (
              <div
                key={vehicle.id}
                onClick={() => handleVehicleClick(vehicle.id)}
                className={cn(
                  "cursor-pointer rounded-[24px] p-3.5 transition-all duration-200 border",
                  isSelected
                    ? "bg-white/15 border-sun/60 shadow-md"
                    : "bg-white/5 border-white/8 hover:bg-white/10 hover:border-white/15",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-xl font-bold text-xs",
                        isSelected ? "bg-sun text-ink" : "bg-white/10 text-ivory",
                      )}
                    >
                      <Bus className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-ivory">
                        {vehicle.vehicleNumber}
                      </p>
                      <p className="text-[11px] text-ivory/60">
                        {vehicle.assignedDriverName || "Unassigned"}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={vehicle.status} />
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-white/8 pt-2.5 text-[11px] text-ivory/70">
                  <span className="truncate max-w-[150px]">
                    {vehicle.assignedRouteName || "Standby Depot"}
                  </span>
                  <span className="font-semibold text-sun">
                    {vehicle.eta || "On Schedule"}
                  </span>
                </div>

                {vehicle.studentsOnboard !== undefined && vehicle.studentsOnboard > 0 && (
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-aura font-medium">
                    <Users className="h-3 w-3" />
                    <span>{vehicle.studentsOnboard} students aboard</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Vehicle Quick Telemetry Bar */}
        {selectedVehicle && (
          <div className="border-t border-white/10 bg-[#0a1e21] p-3.5">
            <div className="flex items-center justify-between text-xs text-ivory">
              <span className="font-semibold">{selectedVehicle.vehicleNumber}</span>
              <span className="text-sun font-bold">
                {selectedVehicle.speedMph || 0} MPH
              </span>
            </div>
            <p className="mt-1 text-[11px] text-ivory/60 truncate">
              {selectedVehicle.currentLocation?.name || "Lincoln District Depot"}
            </p>
          </div>
        )}
      </div>

      {/* Center & Right: High-Fidelity Interactive Map Canvas */}
      <div className="relative h-[580px] lg:h-[700px] overflow-hidden bg-[#0a2327]">
        {/* Map Header Overlay */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          {/* Map Title Pill */}
          <div className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-white/15 bg-[#102f34]/90 px-4 py-2 backdrop-blur-md text-xs font-semibold text-ivory shadow-lg">
            <Radio className="h-3.5 w-3.5 text-aura animate-pulse" />
            <span>Lincoln International School District Telemetry</span>
          </div>

          {/* Map Controls */}
          <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/15 bg-[#102f34]/90 p-1 backdrop-blur-md shadow-lg">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.6))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ivory/80 hover:bg-white/10 hover:text-white transition"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ivory/80 hover:bg-white/10 hover:text-white transition"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ivory/80 hover:bg-white/10 hover:text-white transition"
              aria-label="Reset zoom"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Vector SVG District Map (With smooth transform for zoom) */}
        <div
          className="h-full w-full transition-transform duration-500 ease-out origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg viewBox="0 0 800 600" className="h-full w-full select-none">
            <defs>
              <pattern
                id="grid-pattern"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.04)"
                  strokeWidth="1"
                />
              </pattern>
              <radialGradient id="school-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#78b89a" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#78b89a" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background Grid */}
            <rect width="800" height="600" fill="url(#grid-pattern)" />

            {/* Roads and Arterials */}
            {/* Main North-South expressway */}
            <path
              d="M 380 0 L 380 600"
              stroke="#145c63"
              strokeWidth="20"
              strokeOpacity="0.7"
            />
            {/* Grand Ave east-west */}
            <path
              d="M 0 320 L 800 320"
              stroke="#145c63"
              strokeWidth="16"
              strokeOpacity="0.6"
            />
            {/* Diagonal Parkway */}
            <path
              d="M 50 100 L 750 500"
              stroke="#174f55"
              strokeWidth="12"
              strokeOpacity="0.5"
            />
            {/* Secondary cross streets */}
            <path
              d="M 0 160 L 800 160"
              stroke="#123a3f"
              strokeWidth="8"
              strokeOpacity="0.4"
            />
            <path
              d="M 0 480 L 800 480"
              stroke="#123a3f"
              strokeWidth="8"
              strokeOpacity="0.4"
            />
            <path
              d="M 180 0 L 180 600"
              stroke="#123a3f"
              strokeWidth="8"
              strokeOpacity="0.4"
            />
            <path
              d="M 580 0 L 580 600"
              stroke="#123a3f"
              strokeWidth="8"
              strokeOpacity="0.4"
            />

            {/* School Campus Zone & Hub */}
            <circle cx="380" cy="320" r="70" fill="url(#school-glow)" />
            <rect
              x="355"
              y="295"
              width="50"
              height="50"
              rx="16"
              fill="#145C63"
              stroke="#F4C95D"
              strokeWidth="3"
            />
            <text
              x="380"
              y="325"
              fill="#FFFFFF"
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
            >
              LIS
            </text>
            <text
              x="380"
              y="360"
              fill="#F7F3E8"
              fontSize="11"
              fontWeight="600"
              textAnchor="middle"
            >
              Lincoln International Campus
            </text>

            {/* Active Route Lines */}
            {/* Route 08 West Valley (Sun Yellow) */}
            <path
              className="route-path"
              d="M 120 440 C 180 440, 220 280, 310 240 S 340 320, 380 320"
              stroke="#F4C95D"
              strokeWidth="4.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* Route 04 North Loop (Aura Green) */}
            <path
              className="route-path"
              d="M 540 80 C 480 90, 420 180, 460 250 S 410 300, 380 320"
              stroke="#78B89A"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />

            {/* Route 12 Highland Park (Delayed route - Warm accent) */}
            <path
              d="M 680 200 C 620 240, 560 210, 490 320 S 420 320, 380 320"
              stroke="#f4a25d"
              strokeWidth="3.5"
              strokeDasharray="6 6"
              fill="none"
            />

            {/* Designated Stops along the way */}
            {[
              { x: 120, y: 440, name: "Maple & 4th" },
              { x: 220, y: 280, name: "Cedar Hill" },
              { x: 540, y: 80, name: "Pinewood" },
              { x: 440, y: 150, name: "Lakeland" },
              { x: 620, y: 220, name: "Highland Greens" },
            ].map((stop) => (
              <g key={stop.name}>
                <circle
                  cx={stop.x}
                  cy={stop.y}
                  r="6"
                  fill="#F7F3E8"
                  stroke="#102f34"
                  strokeWidth="2"
                />
                <text
                  x={stop.x}
                  y={stop.y - 10}
                  fill="rgba(247, 243, 232, 0.75)"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {stop.name}
                </text>
              </g>
            ))}

            {/* Interactive Vehicle Markers */}
            {vehicleMarkers.map((vm) => {
              const isSelected = vm.id === activeVehicleId;
              const isDelayed = vm.status === "delayed";
              const isRoute = vm.status === "on_route";

              return (
                <g
                  key={vm.id}
                  onClick={() => handleVehicleClick(vm.id)}
                  className="cursor-pointer transition-transform"
                >
                  {/* Pulse halo for active vehicles */}
                  {isRoute && (
                    <circle
                      cx={vm.x}
                      cy={vm.y}
                      r={isSelected ? "22" : "16"}
                      fill={isSelected ? "#F4C95D" : "#78B89A"}
                      opacity="0.25"
                      className="animate-ping"
                    />
                  )}

                  {/* Marker Body */}
                  <circle
                    cx={vm.x}
                    cy={vm.y}
                    r={isSelected ? "14" : "11"}
                    fill={
                      isSelected
                        ? "#F4C95D"
                        : isDelayed
                        ? "#f4a25d"
                        : "#78B89A"
                    }
                    stroke="#183238"
                    strokeWidth="2.5"
                  />

                  <circle
                    cx={vm.x}
                    cy={vm.y}
                    r="4"
                    fill="#183238"
                  />

                  {/* Vehicle Tag */}
                  <rect
                    x={vm.x - 28}
                    y={vm.y + 14}
                    width="56"
                    height="18"
                    rx="9"
                    fill={isSelected ? "#F4C95D" : "#183238"}
                    stroke={isSelected ? "#FFFFFF" : "rgba(255,255,255,0.2)"}
                    strokeWidth="1"
                  />
                  <text
                    x={vm.x}
                    y={vm.y + 27}
                    fill={isSelected ? "#183238" : "#FFFFFF"}
                    fontSize="9.5"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {vm.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Bottom Floating Telemetry Card for Selected Vehicle */}
        {selectedVehicle && (
          <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-[28px] border border-white/15 bg-[#102f34]/95 p-4 backdrop-blur-md shadow-2xl text-ivory">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sun text-ink font-bold shrink-0">
                <Bus className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white">
                    {selectedVehicle.vehicleNumber}
                  </h4>
                  <StatusBadge status={selectedVehicle.status} />
                </div>
                <p className="text-xs text-ivory/70 mt-0.5">
                  Driver: <strong className="text-white">{selectedVehicle.assignedDriverName || "Unassigned"}</strong> · Route: <strong className="text-white">{selectedVehicle.assignedRouteName || "None"}</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="rounded-xl bg-white/6 px-3 py-1.5">
                <p className="text-[10px] text-ivory/50 uppercase tracking-wider">
                  Students Aboard
                </p>
                <p className="font-bold text-sun">
                  {selectedVehicle.studentsOnboard || 0} / {selectedVehicle.capacity}
                </p>
              </div>

              <div className="rounded-xl bg-white/6 px-3 py-1.5">
                <p className="text-[10px] text-ivory/50 uppercase tracking-wider">
                  Live Speed
                </p>
                <p className="font-bold text-aura">
                  {selectedVehicle.speedMph || 0} MPH
                </p>
              </div>

              <div className="rounded-xl bg-white/6 px-3 py-1.5">
                <p className="text-[10px] text-ivory/50 uppercase tracking-wider">
                  Estimated Arrival
                </p>
                <p className="font-bold text-white">
                  {selectedVehicle.eta || "On Schedule"}
                </p>
              </div>

              <Button
                variant="sun"
                size="sm"
                icon={<Phone className="h-3.5 w-3.5" />}
                onClick={() => alert(`Calling driver of ${selectedVehicle.vehicleNumber}...`)}
              >
                Contact Cab
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
