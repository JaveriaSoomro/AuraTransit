"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
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
  Play,
  Pause,
  RefreshCw,
  Gauge,
  Compass,
  Satellite,
  Volume2,
  CheckCircle2,
} from "lucide-react";
import { Vehicle } from "@/types/dashboard";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

interface LiveMapViewProps {
  vehicles: Vehicle[];
  selectedVehicleId?: string;
  onSelectVehicle?: (id: string) => void;
  className?: string;
}

// Coordinate waypoint paths along realistic school transit corridors
const ROUTE_PATHS: Record<string, { x: number; y: number }[]> = {
  "veh-1": [
    { x: 120, y: 440 },
    { x: 160, y: 390 },
    { x: 220, y: 280 },
    { x: 280, y: 240 },
    { x: 330, y: 260 },
    { x: 380, y: 320 },
    { x: 340, y: 380 },
    { x: 260, y: 420 },
    { x: 180, y: 440 },
  ],
  "veh-2": [
    { x: 540, y: 80 },
    { x: 490, y: 130 },
    { x: 440, y: 150 },
    { x: 430, y: 220 },
    { x: 460, y: 260 },
    { x: 420, y: 300 },
    { x: 380, y: 320 },
    { x: 450, y: 220 },
    { x: 520, y: 140 },
  ],
  "veh-3": [
    { x: 220, y: 280 },
    { x: 220, y: 280 },
    { x: 240, y: 300 },
    { x: 270, y: 320 },
    { x: 310, y: 320 },
    { x: 380, y: 320 },
  ],
  "veh-4": [
    { x: 680, y: 200 },
    { x: 640, y: 215 },
    { x: 620, y: 220 },
    { x: 580, y: 240 },
    { x: 530, y: 280 },
    { x: 480, y: 310 },
    { x: 380, y: 320 },
  ],
  "veh-5": [
    { x: 350, y: 480 },
    { x: 360, y: 440 },
    { x: 370, y: 400 },
    { x: 380, y: 350 },
    { x: 380, y: 320 },
    { x: 360, y: 280 },
  ],
  "veh-6": [
    { x: 160, y: 160 },
    { x: 160, y: 160 },
  ],
};

export function LiveMapView({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  className,
}: LiveMapViewProps) {
  const { showToast } = useToast();
  const [activeVehicleId, setActiveVehicleId] = useState<string>(
    selectedVehicleId || vehicles[0]?.id || "",
  );
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [tick, setTick] = useState(0);
  const [pingMs, setPingMs] = useState(38);
  const [lastSync, setLastSync] = useState("");

  // Live positions mapped per vehicle
  const [positions, setPositions] = useState<
    Record<string, { x: number; y: number; step: number; speed: number }>
  >({
    "veh-1": { x: 280, y: 240, step: 3, speed: 26 },
    "veh-2": { x: 440, y: 150, step: 2, speed: 31 },
    "veh-3": { x: 220, y: 280, step: 0, speed: 0 },
    "veh-4": { x: 620, y: 220, step: 2, speed: 12 },
    "veh-5": { x: 360, y: 440, step: 1, speed: 22 },
    "veh-6": { x: 160, y: 160, step: 0, speed: 0 },
  });

  // Keep lastSync in sync with local time
  useEffect(() => {
    setLastSync(new Date().toLocaleTimeString());
  }, []);

  // Heartbeat Telemetry Loop: moves vehicles smoothly along real routes
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTick((t) => t + 1);
      setLastSync(new Date().toLocaleTimeString());
      setPingMs(36 + Math.floor(Math.random() * 8));

      setPositions((prev) => {
        const next = { ...prev };
        Object.keys(ROUTE_PATHS).forEach((vId) => {
          const path = ROUTE_PATHS[vId];
          if (!path || path.length <= 1) return;

          const current = prev[vId] || { x: path[0].x, y: path[0].y, step: 0, speed: 25 };
          const nextStep = (current.step + 1) % path.length;
          const targetCoord = path[nextStep];

          // Realistic speed variation
          const isAtSchool = targetCoord.x === 380 && targetCoord.y === 320;
          const isAtStop = nextStep === 2 || nextStep === 0;
          let newSpeed = 24 + Math.floor(Math.random() * 10);
          if (isAtSchool || (vId === "veh-3" && current.step === 0)) newSpeed = 0;
          else if (isAtStop) newSpeed = 14;
          else if (vId === "veh-4") newSpeed = 11; // delayed vehicle in traffic

          next[vId] = {
            x: targetCoord.x,
            y: targetCoord.y,
            step: nextStep,
            speed: newSpeed,
          };
        });
        return next;
      });
    }, 2000 / simSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, simSpeed]);

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

  const handlePingDriver = (vehicleNumber: string, driverName?: string) => {
    showToast(
      `📡 Radio ping sent to ${driverName || "Driver"} (${vehicleNumber}). Telemetry acknowledged.`,
    );
  };

  return (
    <div
      className={cn(
        "relative grid grid-cols-1 lg:grid-cols-[360px_1fr] overflow-hidden rounded-[32px] border border-ink/8 bg-[#102f34] shadow-2xl",
        className,
      )}
    >
      {/* Left Column: Vehicle Selector & Telemetry List */}
      <div className="flex flex-col border-r border-white/10 bg-[#0e272b] h-[600px] lg:h-[720px]">
        {/* Header & Live Status Radar */}
        <div className="border-b border-white/10 p-4 bg-[#0a1e21]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aura opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-aura" />
              </span>
              <div>
                <p className="text-xs font-bold tracking-wider text-ivory uppercase flex items-center gap-1.5">
                  Live GPS Relay
                </p>
                <p className="text-[10px] text-aura font-mono">
                  {isPlaying ? "INGESTING 5G TELEMETRY" : "FEED PAUSED"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-ivory/60 font-mono">
              <span className="text-sun font-bold">{pingMs}ms</span>
              <span>·</span>
              <span>{lastSync || "Live"}</span>
            </div>
          </div>

          {/* Controls Bar: Pause/Play, Speed Multiplier */}
          <div className="mt-3 flex items-center justify-between border-t border-white/8 pt-2.5">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition",
                  isPlaying
                    ? "bg-white/10 text-ivory hover:bg-white/15"
                    : "bg-sun text-ink font-bold",
                )}
                title={isPlaying ? "Pause simulation" : "Resume live telemetry"}
              >
                {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 fill-ink" />}
                <span>{isPlaying ? "Live" : "Resume"}</span>
              </button>

              <button
                type="button"
                onClick={() => setSimSpeed((s) => (s === 1 ? 2 : s === 2 ? 4 : 1))}
                className="rounded-lg bg-white/5 hover:bg-white/10 px-2 py-1 text-[11px] font-mono text-ivory/80 transition"
                title="Simulation speed multiplier"
              >
                {simSpeed}x Speed
              </button>
            </div>

            <span className="rounded-full bg-aura/20 text-aura border border-aura/30 px-2 py-0.5 text-[10px] font-bold">
              {vehicles.filter((v) => v.status === "on_route").length} On Route
            </span>
          </div>

          {/* Quick Filter buttons */}
          <div className="mt-3 flex gap-1.5 overflow-x-auto pb-0.5">
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
            const livePos = positions[vehicle.id];
            const liveSpeed = livePos?.speed ?? (vehicle.speedMph || 0);

            return (
              <div
                key={vehicle.id}
                onClick={() => handleVehicleClick(vehicle.id)}
                className={cn(
                  "cursor-pointer rounded-[24px] p-3.5 transition-all duration-300 border",
                  isSelected
                    ? "bg-white/15 border-sun/70 shadow-lg scale-[1.01]"
                    : "bg-white/5 border-white/8 hover:bg-white/10 hover:border-white/15",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "relative flex h-9 w-9 items-center justify-center rounded-xl font-bold text-xs transition-colors",
                        isSelected ? "bg-sun text-ink shadow-sm" : "bg-white/10 text-ivory",
                      )}
                    >
                      <Bus className="h-4 w-4" />
                      {vehicle.status === "on_route" && isPlaying && (
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aura opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-aura" />
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-ivory">{vehicle.vehicleNumber}</p>
                        <span className="font-mono text-[10px] text-aura font-bold">
                          {liveSpeed} mph
                        </span>
                      </div>
                      <p className="text-[11px] text-ivory/60 truncate max-w-[140px]">
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
                  <div className="mt-1 flex items-center justify-between text-[10px] text-aura font-medium">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{vehicle.studentsOnboard} students onboard</span>
                    </div>
                    <span className="font-mono text-ivory/50">Capacity {vehicle.capacity}</span>
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
              <span className="font-semibold">{selectedVehicle.vehicleNumber} Telemetry</span>
              <span className="text-sun font-bold font-mono">
                {positions[selectedVehicle.id]?.speed ?? selectedVehicle.speedMph ?? 24} MPH
              </span>
            </div>
            <p className="mt-1 text-[11px] text-ivory/60 truncate">
              {selectedVehicle.currentLocation?.name || "Corridor 08 / West Blvd"}
            </p>
          </div>
        )}
      </div>

      {/* Center & Right: High-Fidelity Interactive Map Canvas */}
      <div className="relative h-[600px] lg:h-[720px] overflow-hidden bg-[#0a2327]">
        {/* Map Header Overlay */}
        <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Map Title & Telemetry Lock Pill */}
          <div className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-white/15 bg-[#102f34]/95 px-4 py-2 backdrop-blur-md text-xs font-semibold text-ivory shadow-xl">
            <Radio className="h-3.5 w-3.5 text-aura animate-pulse" />
            <span>Lincoln School District Telemetry Radar</span>
            <span className="hidden sm:inline-block font-mono text-[10px] text-aura bg-aura/15 px-2 py-0.5 rounded-full">
              LIVE CONNECTED
            </span>
          </div>

          {/* Map Zoom & View Controls */}
          <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/15 bg-[#102f34]/95 p-1 backdrop-blur-md shadow-xl">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ivory/80 hover:bg-white/10 hover:text-white transition"
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ivory/80 hover:bg-white/10 hover:text-white transition"
              title="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setZoomLevel(1);
                setPanOffset({ x: 0, y: 0 });
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ivory/80 hover:bg-white/10 hover:text-white transition"
              title="Reset center"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Live Vector District Map Canvas */}
        <div
          className="h-full w-full transition-transform duration-700 ease-out origin-center"
          style={{ transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)` }}
        >
          <svg viewBox="0 0 800 600" className="h-full w-full select-none">
            <defs>
              <pattern
                id="grid-pattern-live"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="1"
                />
              </pattern>
              <radialGradient id="school-glow-live" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#78b89a" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#78b89a" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background Grid */}
            <rect width="800" height="600" fill="url(#grid-pattern-live)" />

            {/* Highway Corridors */}
            <path
              d="M 380 0 L 380 600"
              stroke="#145c63"
              strokeWidth="22"
              strokeOpacity="0.75"
            />
            <path
              d="M 0 320 L 800 320"
              stroke="#145c63"
              strokeWidth="18"
              strokeOpacity="0.65"
            />
            <path
              d="M 50 100 L 750 500"
              stroke="#174f55"
              strokeWidth="14"
              strokeOpacity="0.55"
            />
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

            {/* School Campus Zone & Terminal */}
            <circle cx="380" cy="320" r="75" fill="url(#school-glow-live)" />
            <rect
              x="355"
              y="295"
              width="50"
              height="50"
              rx="16"
              fill="#145C63"
              stroke="#F4C95D"
              strokeWidth="3.5"
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
              Lincoln International Campus (Hub)
            </text>

            {/* Active Route Vector Traces */}
            {/* Route 08 West Valley Loop (Sun) */}
            <path
              className="route-path"
              d="M 120 440 C 180 440, 220 280, 310 240 S 340 320, 380 320"
              stroke="#F4C95D"
              strokeWidth="4.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* Route 04 North Express (Aura) */}
            <path
              className="route-path"
              d="M 540 80 C 480 90, 420 180, 460 250 S 410 300, 380 320"
              stroke="#78B89A"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />

            {/* Route 12 Highland Park (Warm accent) */}
            <path
              d="M 680 200 C 620 240, 560 210, 490 320 S 420 320, 380 320"
              stroke="#f4a25d"
              strokeWidth="3.5"
              strokeDasharray="6 6"
              fill="none"
            />

            {/* Route Stops with Pulsing Rings */}
            {[
              { x: 120, y: 440, name: "Maple & 4th Stop" },
              { x: 220, y: 280, name: "Cedar Hill Stop" },
              { x: 540, y: 80, name: "Pinewood Stop" },
              { x: 440, y: 150, name: "Lakeland Stop" },
              { x: 620, y: 220, name: "Highland Greens" },
            ].map((stop) => (
              <g key={stop.name}>
                <circle
                  cx={stop.x}
                  cy={stop.y}
                  r="6"
                  fill="#F7F3E8"
                  stroke="#102f34"
                  strokeWidth="2.5"
                />
                <text
                  x={stop.x}
                  y={stop.y - 12}
                  fill="rgba(247, 243, 232, 0.85)"
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {stop.name}
                </text>
              </g>
            ))}

            {/* Live Moving Vehicles with Dynamic Coordinates */}
            {vehicles.map((v) => {
              const pos = positions[v.id] || { x: 380, y: 320, speed: 0 };
              const isSelected = v.id === activeVehicleId;
              const isDelayed = v.status === "delayed";
              const isRoute = v.status === "on_route";

              return (
                <g
                  key={v.id}
                  onClick={() => handleVehicleClick(v.id)}
                  className="cursor-pointer transition-all duration-700 ease-linear"
                  style={{
                    transform: `translate(${pos.x}px, ${pos.y}px)`,
                    transformOrigin: "center",
                  }}
                >
                  {/* Radar pulse beacon when moving */}
                  {isRoute && isPlaying && (
                    <circle
                      cx={0}
                      cy={0}
                      r={isSelected ? "28" : "20"}
                      fill={isSelected ? "#F4C95D" : "#78B89A"}
                      opacity="0.3"
                      className="animate-ping"
                    />
                  )}

                  {/* Marker Pin */}
                  <circle
                    cx={0}
                    cy={0}
                    r={isSelected ? "15" : "12"}
                    fill={isSelected ? "#F4C95D" : isDelayed ? "#f4a25d" : "#78B89A"}
                    stroke="#183238"
                    strokeWidth="3"
                  />

                  {/* Center Dot / Icon */}
                  <circle cx={0} cy={0} r="4" fill="#183238" />

                  {/* Vehicle Identifier Tag */}
                  <rect
                    x={-30}
                    y={16}
                    width="60"
                    height="19"
                    rx="9.5"
                    fill={isSelected ? "#F4C95D" : "#183238"}
                    stroke={isSelected ? "#FFFFFF" : "rgba(255,255,255,0.3)"}
                    strokeWidth="1.2"
                  />
                  <text
                    x={0}
                    y={29}
                    fill={isSelected ? "#183238" : "#FFFFFF"}
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {v.vehicleNumber}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Bottom Floating Telemetry Card for Selected Vehicle */}
        {selectedVehicle && (
          <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-[28px] border border-white/15 bg-[#102f34]/95 p-4 backdrop-blur-md shadow-2xl text-ivory animate-fade-in">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sun text-ink font-bold shrink-0 shadow-sm">
                <Bus className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white">
                    {selectedVehicle.vehicleNumber}
                  </h4>
                  <StatusBadge status={selectedVehicle.status} />
                  <span className="font-mono text-xs text-aura font-bold">
                    {positions[selectedVehicle.id]?.speed ?? selectedVehicle.speedMph ?? 24} MPH
                  </span>
                </div>
                <p className="text-xs text-ivory/70 mt-0.5">
                  Driver: <strong className="text-white">{selectedVehicle.assignedDriverName || "David Miller"}</strong> · Route: <strong className="text-white">{selectedVehicle.assignedRouteName || "Corridor 08"}</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="rounded-xl bg-white/6 px-3 py-1.5 text-center">
                <p className="text-[10px] text-ivory/50 uppercase tracking-wider">
                  Students Aboard
                </p>
                <p className="font-bold text-sun">
                  {selectedVehicle.studentsOnboard || 18} / {selectedVehicle.capacity}
                </p>
              </div>

              <div className="rounded-xl bg-white/6 px-3 py-1.5 text-center">
                <p className="text-[10px] text-ivory/50 uppercase tracking-wider">
                  ETA to School
                </p>
                <p className="font-bold text-white">
                  {selectedVehicle.eta || "08:14 AM"}
                </p>
              </div>

              <Button
                variant="sun"
                size="sm"
                icon={<Phone className="h-3.5 w-3.5" />}
                onClick={() =>
                  handlePingDriver(
                    selectedVehicle.vehicleNumber,
                    selectedVehicle.assignedDriverName,
                  )
                }
              >
                Dispatch Radio
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
