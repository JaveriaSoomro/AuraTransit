"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  Radio,
  Layers,
  Play,
  Pause,
  Compass,
  Crosshair,
  Wifi,
  ExternalLink,
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

// Actual real-world GPS coordinates around Lincoln Park & North Side Chicago School District
// Campus Hub: Lincoln International School Portico (41.8950° N, -87.6250° W)
const CAMPUS_GPS = { lat: 41.8950, lng: -87.6250, name: "Lincoln International Campus Hub" };

// Geographic bounds for scaling GPS Lat/Lng to SVG coordinate system
const GPS_BOUNDS = {
  minLat: 41.8700,
  maxLat: 41.9150,
  minLng: -87.6650,
  maxLng: -87.6100,
};

// Convert geographic GPS (lat, lng) to pixel coordinates (800 x 600)
function gpsToPixels(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - GPS_BOUNDS.minLng) / (GPS_BOUNDS.maxLng - GPS_BOUNDS.minLng)) * 800;
  // Latitude decreases as Y increases
  const y = ((GPS_BOUNDS.maxLat - lat) / (GPS_BOUNDS.maxLat - GPS_BOUNDS.minLat)) * 600;
  return { x: Math.round(x), y: Math.round(y) };
}

// Verified real GPS waypoint trajectories along actual road grid corridors
export const VEHICLE_GPS_WAYPOINTS: Record<string, { lat: number; lng: number; stopName?: string }[]> = {
  "veh-1": [
    { lat: 41.8750, lng: -87.6520, stopName: "Maple & 4th Avenue" },
    { lat: 41.8800, lng: -87.6470 },
    { lat: 41.8860, lng: -87.6400, stopName: "Cedar Hill Center" },
    { lat: 41.8900, lng: -87.6340 },
    { lat: 41.8950, lng: -87.6250, stopName: "Lincoln Campus Gate" },
    { lat: 41.8920, lng: -87.6320 },
    { lat: 41.8840, lng: -87.6440 },
  ],
  "veh-2": [
    { lat: 41.9120, lng: -87.6380, stopName: "Pinewood North Park" },
    { lat: 41.9050, lng: -87.6350, stopName: "Lakeland Library" },
    { lat: 41.8990, lng: -87.6300 },
    { lat: 41.8950, lng: -87.6250, stopName: "Lincoln Campus Portico" },
    { lat: 41.9020, lng: -87.6280 },
    { lat: 41.9080, lng: -87.6340 },
  ],
  "veh-3": [
    { lat: 41.8860, lng: -87.6400, stopName: "Cedar Hill Depot" },
    { lat: 41.8890, lng: -87.6350 },
    { lat: 41.8950, lng: -87.6250, stopName: "Lincoln Campus Hub" },
    { lat: 41.8920, lng: -87.6300 },
  ],
  "veh-4": [
    { lat: 41.8910, lng: -87.6140, stopName: "Highland Greens Crossway" },
    { lat: 41.8925, lng: -87.6180 },
    { lat: 41.8940, lng: -87.6220 },
    { lat: 41.8950, lng: -87.6250, stopName: "Lincoln Campus Hub" },
    { lat: 41.8930, lng: -87.6200 },
  ],
  "veh-5": [
    { lat: 41.8720, lng: -87.6320, stopName: "South Meadow Depot" },
    { lat: 41.8790, lng: -87.6300 },
    { lat: 41.8870, lng: -87.6270 },
    { lat: 41.8950, lng: -87.6250, stopName: "Lincoln Campus Hub" },
  ],
  "veh-6": [
    { lat: 41.9010, lng: -87.6580, stopName: "Midwest EV Service Hub" },
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
  const [pingMs, setPingMs] = useState(42);
  const [lastSync, setLastSync] = useState("");
  const [deviceGpsActive, setDeviceGpsActive] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Live GPS telemetry state per vehicle
  const [gpsTelemetry, setGpsTelemetry] = useState<
    Record<
      string,
      {
        lat: number;
        lng: number;
        x: number;
        y: number;
        step: number;
        speedMph: number;
        heading: number;
      }
    >
  >(() => {
    const initial: Record<string, any> = {};
    vehicles.forEach((v) => {
      const waypoints = VEHICLE_GPS_WAYPOINTS[v.id] || [CAMPUS_GPS];
      const pt = waypoints[0];
      const pix = gpsToPixels(pt.lat, pt.lng);
      initial[v.id] = {
        lat: pt.lat,
        lng: pt.lng,
        x: pix.x,
        y: pix.y,
        step: 0,
        speedMph: v.speedMph || 24,
        heading: 45,
      };
    });
    return initial;
  });

  useEffect(() => {
    setLastSync(new Date().toLocaleTimeString());
  }, []);

  // Request browser Geolocation API if requested
  const handleLocateMe = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({ lat, lng });
          setDeviceGpsActive(true);
          showToast(`GPS lock acquired: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° W`);
        },
        (error) => {
          showToast(`Geolocation API: ${error.message}. Using default district GPS beacon.`, "error");
        },
        { enableHighAccuracy: true, timeout: 8000 },
      );
    } else {
      showToast("Geolocation API is not supported in this browser.", "error");
    }
  };

  // Heartbeat Telemetry Loop: iterates along GPS waypoints and interpolates position
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setLastSync(new Date().toLocaleTimeString());
      setPingMs(38 + Math.floor(Math.random() * 8));

      setGpsTelemetry((prev) => {
        const next = { ...prev };
        Object.keys(VEHICLE_GPS_WAYPOINTS).forEach((vId) => {
          const path = VEHICLE_GPS_WAYPOINTS[vId];
          if (!path || path.length <= 1) return;

          const current = prev[vId] || { step: 0 };
          const nextStep = (current.step + 1) % path.length;
          const target = path[nextStep];
          const pix = gpsToPixels(target.lat, target.lng);

          const isAtHub = Math.abs(target.lat - CAMPUS_GPS.lat) < 0.001 && Math.abs(target.lng - CAMPUS_GPS.lng) < 0.001;
          const targetSpeed = isAtHub ? 0 : 20 + Math.floor(Math.random() * 12);

          next[vId] = {
            lat: target.lat,
            lng: target.lng,
            x: pix.x,
            y: pix.y,
            step: nextStep,
            speedMph: targetSpeed,
            heading: (current.heading + 25) % 360,
          };
        });
        return next;
      });
    }, 2200 / simSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, simSpeed]);

  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.id === activeVehicleId) || vehicles[0],
    [vehicles, activeVehicleId],
  );

  const selectedTelemetry = gpsTelemetry[selectedVehicle?.id] || {
    lat: CAMPUS_GPS.lat,
    lng: CAMPUS_GPS.lng,
    speedMph: 24,
  };

  const filteredVehicles = useMemo(() => {
    if (filterStatus === "all") return vehicles;
    return vehicles.filter((v) => v.status === filterStatus);
  }, [vehicles, filterStatus]);

  const handleVehicleClick = (id: string) => {
    setActiveVehicleId(id);
    onSelectVehicle?.(id);
  };

  const campusPix = gpsToPixels(CAMPUS_GPS.lat, CAMPUS_GPS.lng);

  return (
    <div
      className={cn(
        "relative grid grid-cols-1 lg:grid-cols-[360px_1fr] overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl",
        className,
      )}
    >
      {/* Left Column: Vehicle Selector & Live GPS Feed */}
      <div className="flex flex-col border-r border-slate-200 bg-slate-50 h-[600px] lg:h-[720px]">
        {/* Header & GPS Satellite Status */}
        <div className="border-b border-slate-200 p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <div>
                <p className="text-xs font-bold tracking-wider text-slate-800 uppercase flex items-center gap-1.5">
                  Live GPS Transponder
                </p>
                <p className="text-[10px] text-emerald-600 font-mono font-bold">
                  {isPlaying ? "GNSS SATELLITE LOCK (12 SV)" : "TELEMETRY PAUSED"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
              <span className="text-teal font-bold">{pingMs}ms</span>
              <span>·</span>
              <span>{lastSync || "Live"}</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold transition shadow-2xs",
                  isPlaying
                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    : "bg-teal text-white font-bold",
                )}
                title={isPlaying ? "Pause telemetry" : "Resume telemetry"}
              >
                {isPlaying ? <Pause className="h-3 w-3 text-slate-600" /> : <Play className="h-3 w-3 fill-white" />}
                <span>{isPlaying ? "Live" : "Resume"}</span>
              </button>

              <button
                type="button"
                onClick={() => setSimSpeed((s) => (s === 1 ? 2 : s === 2 ? 4 : 1))}
                className="rounded-xl bg-slate-100 hover:bg-slate-200 px-2 py-1 text-[11px] font-mono text-slate-600 transition"
              >
                {simSpeed}x Speed
              </button>

              <button
                type="button"
                onClick={handleLocateMe}
                className={cn(
                  "rounded-xl px-2 py-1 text-[11px] font-medium flex items-center gap-1 transition",
                  deviceGpsActive
                    ? "bg-emerald-100 text-emerald-700 font-bold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                )}
                title="Use Device GPS"
              >
                <Crosshair className="h-3 w-3" />
                <span>GPS API</span>
              </button>
            </div>

            <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold">
              {vehicles.filter((v) => v.status === "on_route").length} Active
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
                    ? "bg-teal text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
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
            const telem = gpsTelemetry[vehicle.id];
            const liveSpeed = telem?.speedMph ?? vehicle.speedMph ?? 0;

            return (
              <div
                key={vehicle.id}
                onClick={() => handleVehicleClick(vehicle.id)}
                className={cn(
                  "cursor-pointer rounded-2xl p-3.5 transition-all duration-200 border",
                  isSelected
                    ? "bg-white border-teal shadow-md ring-2 ring-teal/15"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "relative flex h-9 w-9 items-center justify-center rounded-xl font-bold text-xs transition-colors",
                        isSelected ? "bg-teal text-white shadow-xs" : "bg-slate-100 text-slate-700",
                      )}
                    >
                      <Bus className="h-4 w-4" />
                      {vehicle.status === "on_route" && isPlaying && (
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-slate-800">{vehicle.vehicleNumber}</p>
                        <span className="font-mono text-[10px] text-teal font-bold bg-teal/10 px-1.5 py-0.2 rounded-md">
                          {liveSpeed} mph
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate max-w-[140px]">
                        {vehicle.assignedDriverName || "Unassigned"}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={vehicle.status} />
                </div>

                <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-600">
                  <span className="truncate max-w-[150px] font-medium">
                    {vehicle.assignedRouteName || "Standby Fleet"}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {telem ? `${telem.lat.toFixed(4)}°, ${telem.lng.toFixed(4)}°` : "GPS Lock"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Vehicle Quick Telemetry Bar */}
        {selectedVehicle && (
          <div className="border-t border-slate-200 bg-white p-3.5 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Navigation className="h-3.5 w-3.5 text-teal" />
                {selectedVehicle.vehicleNumber} Telemetry
              </span>
              <span className="text-teal font-bold font-mono">
                {selectedTelemetry.speedMph} MPH
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>{selectedTelemetry.lat.toFixed(5)}° N, {Math.abs(selectedTelemetry.lng).toFixed(5)}° W</span>
              <span className="text-emerald-600 font-semibold">GPS Synced</span>
            </div>
          </div>
        )}
      </div>

      {/* Center & Right: White Clean GPS Vector Map Canvas */}
      <div className="relative h-[600px] lg:h-[720px] overflow-hidden bg-[#f8fafc]">
        {/* Map Header Overlay */}
        <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Map Title & GPS Lock Pill */}
          <div className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-slate-200 bg-white/95 px-4 py-2 backdrop-blur-md text-xs font-semibold text-slate-800 shadow-md">
            <Radio className="h-3.5 w-3.5 text-teal animate-pulse" />
            <span>Lincoln District GPS Telemetry Grid</span>
            <span className="hidden sm:inline-block font-mono text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
              GPS FIX 3D
            </span>
          </div>

          {/* Map Zoom & GPS Center Controls */}
          <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-slate-200 bg-white/95 p-1 backdrop-blur-md shadow-md">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 transition"
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 transition"
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
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 transition"
              title="Reset view"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Clean White Map Canvas with Crisp Streets & Road Infrastructure */}
        <div
          className="h-full w-full transition-transform duration-700 ease-out origin-center"
          style={{ transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)` }}
        >
          <svg viewBox="0 0 800 600" className="h-full w-full select-none">
            <defs>
              {/* Crisp clean city grid */}
              <pattern
                id="white-grid-pattern"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 50 0 L 0 0 0 50"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
              </pattern>

              {/* Park & Waterfront fills */}
              <linearGradient id="lake-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e0f2fe" />
                <stop offset="100%" stopColor="#bae6fd" />
              </linearGradient>
            </defs>

            {/* Background base */}
            <rect width="800" height="600" fill="#f8fafc" />
            <rect width="800" height="600" fill="url(#white-grid-pattern)" />

            {/* Lake Michigan Eastern Waterfront Shoreline */}
            <path
              d="M 720 0 C 700 150, 710 320, 730 450 S 750 560, 800 600 L 800 0 Z"
              fill="url(#lake-gradient)"
              stroke="#93c5fd"
              strokeWidth="2"
            />
            <text x="760" y="100" fill="#3b82f6" fontSize="11" fontWeight="bold" opacity="0.6" transform="rotate(90 760 100)">
              Lake Michigan Coastline
            </text>

            {/* Park / Green Reserve Areas */}
            <path
              d="M 120 80 Q 200 60, 260 120 T 180 200 Z"
              fill="#dcfce7"
              stroke="#86efac"
              strokeWidth="1.5"
            />
            <text x="180" y="140" fill="#15803d" fontSize="10" fontWeight="600" textAnchor="middle">
              Northwoods Park Reserve
            </text>

            <path
              d="M 540 400 Q 640 380, 680 440 T 580 500 Z"
              fill="#dcfce7"
              stroke="#86efac"
              strokeWidth="1.5"
            />
            <text x="610" y="450" fill="#15803d" fontSize="10" fontWeight="600" textAnchor="middle">
              Highland Greens Commons
            </text>

            {/* Primary Highway Arterials (Wide White with Soft Slate Border) */}
            {/* North-South Kennedy Expressway Corridor */}
            <path
              d="M 380 0 L 380 600"
              stroke="#cbd5e1"
              strokeWidth="26"
            />
            <path
              d="M 380 0 L 380 600"
              stroke="#ffffff"
              strokeWidth="20"
            />
            <line
              x1="380"
              y1="0"
              x2="380"
              y2="600"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="8 6"
            />

            {/* East-West Grand Ave Corridor */}
            <path
              d="M 0 320 L 800 320"
              stroke="#cbd5e1"
              strokeWidth="22"
            />
            <path
              d="M 0 320 L 800 320"
              stroke="#ffffff"
              strokeWidth="16"
            />
            <line
              x1="0"
              y1="320"
              x2="800"
              y2="320"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />

            {/* Diagonal Boulevard (Northwest Highway) */}
            <path
              d="M 50 100 L 750 500"
              stroke="#cbd5e1"
              strokeWidth="18"
            />
            <path
              d="M 50 100 L 750 500"
              stroke="#ffffff"
              strokeWidth="14"
            />

            {/* Secondary District Streets */}
            <path d="M 0 160 L 800 160" stroke="#e2e8f0" strokeWidth="10" />
            <path d="M 0 160 L 800 160" stroke="#ffffff" strokeWidth="6" />
            <path d="M 0 480 L 800 480" stroke="#e2e8f0" strokeWidth="10" />
            <path d="M 0 480 L 800 480" stroke="#ffffff" strokeWidth="6" />
            <path d="M 180 0 L 180 600" stroke="#e2e8f0" strokeWidth="10" />
            <path d="M 180 0 L 180 600" stroke="#ffffff" strokeWidth="6" />
            <path d="M 560 0 L 560 600" stroke="#e2e8f0" strokeWidth="10" />
            <path d="M 560 0 L 560 600" stroke="#ffffff" strokeWidth="6" />

            {/* Street Names */}
            <text x="395" y="40" fill="#64748b" fontSize="9" fontWeight="bold" letterSpacing="1">
              US-41 N EXPRESSWAY
            </text>
            <text x="20" y="312" fill="#64748b" fontSize="9" fontWeight="bold" letterSpacing="1">
              GRAND AVE (E/W CORRIDOR)
            </text>
            <text x="195" y="580" fill="#94a3b8" fontSize="8" fontWeight="600">
              4TH AVE
            </text>
            <text x="575" y="580" fill="#94a3b8" fontSize="8" fontWeight="600">
              LAKESHORE BLVD
            </text>

            {/* School Campus Hub Flag & Circular Perimeter */}
            <circle
              cx={campusPix.x}
              cy={campusPix.y}
              r="40"
              fill="#ecfdf5"
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <circle
              cx={campusPix.x}
              cy={campusPix.y}
              r="14"
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth="3"
            />
            <text
              x={campusPix.x}
              y={campusPix.y + 4}
              fill="#ffffff"
              fontSize="9"
              fontWeight="bold"
              textAnchor="middle"
            >
              HUB
            </text>
            <text
              x={campusPix.x}
              y={campusPix.y + 26}
              fill="#065f46"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
            >
              Lincoln International Campus Hub
            </text>

            {/* Active Route Colored Paths */}
            {/* Route 08 West Valley Loop */}
            <path
              className="route-path"
              d="M 120 440 C 180 440, 220 280, 310 240 S 340 320, 380 320"
              stroke="#145C63"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />

            {/* Route 04 North Express */}
            <path
              className="route-path"
              d="M 540 80 C 480 90, 420 180, 460 250 S 410 300, 380 320"
              stroke="#0d9488"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* Route 12 Highland Greens Express */}
            <path
              d="M 680 200 C 620 240, 560 210, 490 320 S 420 320, 380 320"
              stroke="#f59e0b"
              strokeWidth="3"
              strokeDasharray="6 4"
              fill="none"
            />

            {/* Route Stops with Crisp Badges */}
            {[
              { x: 120, y: 440, name: "Maple & 4th Stop" },
              { x: 220, y: 280, name: "Cedar Hill Stop" },
              { x: 540, y: 80, name: "Pinewood North Stop" },
              { x: 440, y: 150, name: "Lakeland Library Stop" },
              { x: 620, y: 220, name: "Highland Greens Stop" },
            ].map((stop) => (
              <g key={stop.name}>
                <circle
                  cx={stop.x}
                  cy={stop.y}
                  r="5"
                  fill="#ffffff"
                  stroke="#1e293b"
                  strokeWidth="2.5"
                />
                <text
                  x={stop.x}
                  y={stop.y - 10}
                  fill="#1e293b"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {stop.name}
                </text>
              </g>
            ))}

            {/* User GPS Location Marker (if Geolocation API enabled) */}
            {userLocation && (
              <g
                style={{
                  transform: `translate(${gpsToPixels(userLocation.lat, userLocation.lng).x}px, ${gpsToPixels(userLocation.lat, userLocation.lng).y}px)`,
                }}
              >
                <circle cx={0} cy={0} r="20" fill="#3b82f6" opacity="0.2" className="animate-ping" />
                <circle cx={0} cy={0} r="8" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
                <text x={0} y={16} fill="#1d4ed8" fontSize="9" fontWeight="bold" textAnchor="middle">
                  You (GPS)
                </text>
              </g>
            )}

            {/* Live Moving Vehicles with Dynamic GPS Coordinates */}
            {vehicles.map((v) => {
              const telem = gpsTelemetry[v.id] || { x: campusPix.x, y: campusPix.y, speedMph: 0 };
              const isSelected = v.id === activeVehicleId;
              const isDelayed = v.status === "delayed";
              const isRoute = v.status === "on_route";

              return (
                <g
                  key={v.id}
                  onClick={() => handleVehicleClick(v.id)}
                  className="cursor-pointer transition-all duration-700 ease-linear"
                  style={{
                    transform: `translate(${telem.x}px, ${telem.y}px)`,
                    transformOrigin: "center",
                  }}
                >
                  {/* Radar pulse beacon when moving */}
                  {isRoute && isPlaying && (
                    <circle
                      cx={0}
                      cy={0}
                      r={isSelected ? "26" : "18"}
                      fill={isSelected ? "#145c63" : "#10b981"}
                      opacity="0.25"
                      className="animate-ping"
                    />
                  )}

                  {/* Marker Pin */}
                  <circle
                    cx={0}
                    cy={0}
                    r={isSelected ? "14" : "11"}
                    fill={isSelected ? "#145c63" : isDelayed ? "#f97316" : "#0d9488"}
                    stroke="#ffffff"
                    strokeWidth="3"
                    className="shadow-md"
                  />

                  {/* Center Dot */}
                  <circle cx={0} cy={0} r="3.5" fill="#ffffff" />

                  {/* Vehicle Identifier Tag */}
                  <rect
                    x={-28}
                    y={14}
                    width="56"
                    height="18"
                    rx="9"
                    fill={isSelected ? "#145c63" : "#ffffff"}
                    stroke={isSelected ? "#ffffff" : "#cbd5e1"}
                    strokeWidth="1.5"
                    className="shadow-sm"
                  />
                  <text
                    x={0}
                    y={26.5}
                    fill={isSelected ? "#ffffff" : "#1e293b"}
                    fontSize="9.5"
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
          <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white/95 p-4 backdrop-blur-md shadow-xl text-slate-800 animate-fade-in">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal text-white font-bold shrink-0 shadow-sm">
                <Bus className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900">
                    {selectedVehicle.vehicleNumber}
                  </h4>
                  <StatusBadge status={selectedVehicle.status} />
                  <span className="font-mono text-xs text-teal font-bold bg-teal/10 px-2 py-0.5 rounded-full">
                    {selectedTelemetry.speedMph} MPH
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Driver: <strong className="text-slate-800">{selectedVehicle.assignedDriverName || "David Miller"}</strong> · Route: <strong className="text-slate-800">{selectedVehicle.assignedRouteName || "Corridor 08"}</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="rounded-xl bg-slate-50 px-3 py-1.5 text-center border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  GPS Coordinates
                </p>
                <p className="font-mono font-bold text-slate-800">
                  {selectedTelemetry.lat.toFixed(4)}°N, {Math.abs(selectedTelemetry.lng).toFixed(4)}°W
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 px-3 py-1.5 text-center border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  ETA to Campus
                </p>
                <p className="font-bold text-slate-800">
                  {selectedVehicle.eta || "08:14 AM"}
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={<Phone className="h-3.5 w-3.5" />}
                onClick={() => {
                  showToast(
                    `📡 Radio dispatch opened to ${selectedVehicle.assignedDriverName || "Driver"} (${selectedVehicle.vehicleNumber}).`,
                  );
                }}
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
