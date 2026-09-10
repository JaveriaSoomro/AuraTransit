"use client";

import React, { useState } from "react";
import {
  MapPin,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Clock,
  Users,
  CheckCircle2,
  Compass,
  Building,
  Navigation,
} from "lucide-react";
import { RouteStop } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form-field";
import { cn } from "@/lib/utils";

// Catalog of school district verified transit stops for quick 1-click addition
export const PREDEFINED_DISTRICT_STOPS: Omit<RouteStop, "id" | "order" | "status">[] = [
  {
    name: "Lincoln Campus — Main Portico Gate",
    address: "742 Evergreen Terrace (Campus Hub)",
    scheduledTime: "07:15 AM",
    studentsCount: 4,
    lat: 41.895,
    lng: -87.615,
  },
  {
    name: "Cedar Hill Community Center",
    address: "128 Cedar Hill Rd, West District",
    scheduledTime: "07:22 AM",
    studentsCount: 7,
    lat: 41.883,
    lng: -87.635,
  },
  {
    name: "Maple Ave & 4th Intersection",
    address: "402 Maple Ave",
    scheduledTime: "07:30 AM",
    studentsCount: 6,
    lat: 41.88,
    lng: -87.64,
  },
  {
    name: "Highland Greens Park & Ride",
    address: "420 Maple Way & Highland",
    scheduledTime: "07:38 AM",
    studentsCount: 8,
    lat: 41.888,
    lng: -87.632,
  },
  {
    name: "West Gate Crossing Transit Depot",
    address: "890 West Gate Blvd",
    scheduledTime: "07:44 AM",
    studentsCount: 5,
    lat: 41.886,
    lng: -87.63,
  },
  {
    name: "Grand Ave & Elm St Station",
    address: "1405 Grand Ave",
    scheduledTime: "07:50 AM",
    studentsCount: 4,
    lat: 41.889,
    lng: -87.625,
  },
  {
    name: "Oakridge Residential Roundabout",
    address: "220 River Oaks Dr",
    scheduledTime: "07:56 AM",
    studentsCount: 5,
    lat: 41.892,
    lng: -87.62,
  },
  {
    name: "Lincoln Elementary South Commons",
    address: "100 West Blvd",
    scheduledTime: "08:02 AM",
    studentsCount: 6,
    lat: 41.894,
    lng: -87.618,
  },
];

interface RouteStopJourneyBuilderProps {
  stops: RouteStop[];
  onChange: (stops: RouteStop[]) => void;
}

export function RouteStopJourneyBuilder({
  stops,
  onChange,
}: RouteStopJourneyBuilderProps) {
  // Custom new stop form state
  const [customName, setCustomName] = useState("");
  const [customAddress, setCustomAddress] = useState("");
  const [customTime, setCustomTime] = useState("07:30 AM");
  const [customStudents, setCustomStudents] = useState("5");
  const [showAddCustom, setShowAddCustom] = useState(false);

  // Add a predefined stop from catalog
  const handleAddPredefined = (catalogStop: (typeof PREDEFINED_DISTRICT_STOPS)[number]) => {
    const newOrder = stops.length + 1;
    const newStop: RouteStop = {
      id: `stop-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: catalogStop.name,
      address: catalogStop.address,
      scheduledTime: catalogStop.scheduledTime,
      studentsCount: catalogStop.studentsCount,
      status: "upcoming",
      order: newOrder,
      lat: catalogStop.lat,
      lng: catalogStop.lng,
    };
    onChange([...stops, newStop]);
  };

  // Add custom user-entered stop
  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newOrder = stops.length + 1;
    const newStop: RouteStop = {
      id: `stop-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: customName.trim(),
      address: customAddress.trim() || "District Designated Waypoint",
      scheduledTime: customTime || "07:30 AM",
      studentsCount: parseInt(customStudents, 10) || 0,
      status: "upcoming",
      order: newOrder,
    };

    onChange([...stops, newStop]);
    setCustomName("");
    setCustomAddress("");
    setShowAddCustom(false);
  };

  // Move a stop up in sequence
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...stops];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    const reordered = updated.map((st, i) => ({ ...st, order: i + 1 }));
    onChange(reordered);
  };

  // Move a stop down in sequence
  const handleMoveDown = (index: number) => {
    if (index === stops.length - 1) return;
    const updated = [...stops];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    const reordered = updated.map((st, i) => ({ ...st, order: i + 1 }));
    onChange(reordered);
  };

  // Delete a stop
  const handleDeleteStop = (id: string) => {
    const remaining = stops.filter((s) => s.id !== id);
    const reordered = remaining.map((st, i) => ({ ...st, order: i + 1 }));
    onChange(reordered);
  };

  const totalBoarding = stops.reduce((sum, s) => sum + (s.studentsCount || 0), 0);

  return (
    <div className="space-y-5">
      {/* Overview Pill Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-teal/5 border border-teal/15 p-3.5 text-xs text-teal">
        <div className="flex items-center gap-2">
          <Navigation className="h-4 w-4 shrink-0 text-teal" />
          <span>
            Route Journey Sequence: <strong>{stops.length} Selected Stops</strong>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-ink">
            Total Boarding Riders: <strong className="text-teal font-bold">{totalBoarding}</strong>
          </span>
          {stops.length > 0 && (
            <span className="font-mono text-[11px] text-ink/60 bg-white/80 px-2 py-0.5 rounded-full border border-teal/10">
              {stops[0]?.scheduledTime} → {stops[stops.length - 1]?.scheduledTime}
            </span>
          )}
        </div>
      </div>

      {/* Selected Stops Sequence Timeline */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink/60 flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5 text-teal" /> Stop Sequence & Timings
          </h4>
          <span className="text-[11px] text-ink/40">
            Reorder or adjust times
          </span>
        </div>

        {stops.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-ink/15 p-6 text-center text-xs text-ink/50 bg-ivory/30">
            <MapPin className="h-6 w-6 text-ink/30 mx-auto mb-2" />
            <p className="font-semibold text-ink/70">No stops added to this journey yet.</p>
            <p className="mt-1">Pick from the verified stops catalog below or create a custom station stop.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {stops.map((stop, index) => {
              const isFirst = index === 0;
              const isLast = index === stops.length - 1;

              return (
                <div
                  key={stop.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-white p-3 shadow-2xs hover:border-teal/30 transition group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-2xs",
                        isFirst
                          ? "bg-teal"
                          : isLast
                          ? "bg-sun text-ink font-extrabold"
                          : "bg-teal/70",
                      )}
                    >
                      {stop.order}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-ink truncate">
                          {stop.name}
                        </p>
                        {isFirst && (
                          <span className="rounded-full bg-teal/10 px-2 py-0.2 text-[9px] font-bold text-teal uppercase tracking-wide">
                            First Pickup
                          </span>
                        )}
                        {isLast && stops.length > 1 && (
                          <span className="rounded-full bg-sun/30 px-2 py-0.2 text-[9px] font-bold text-ink uppercase tracking-wide">
                            Campus Hub
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-ink/50 truncate">{stop.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Time Input */}
                    <div className="flex items-center gap-1 rounded-xl bg-ivory/70 px-2 py-1 border border-ink/8 text-[11px] font-mono">
                      <Clock className="h-3 w-3 text-ink/40" />
                      <input
                        type="text"
                        value={stop.scheduledTime}
                        onChange={(e) => {
                          const updated = [...stops];
                          updated[index] = { ...updated[index], scheduledTime: e.target.value };
                          onChange(updated);
                        }}
                        className="w-16 bg-transparent font-semibold text-ink focus:outline-none"
                        title="Scheduled time"
                      />
                    </div>

                    {/* Students Count Input */}
                    <div className="flex items-center gap-1 rounded-xl bg-ivory/70 px-2 py-1 border border-ink/8 text-[11px]">
                      <Users className="h-3 w-3 text-ink/40" />
                      <input
                        type="number"
                        min="0"
                        max="70"
                        value={stop.studentsCount}
                        onChange={(e) => {
                          const updated = [...stops];
                          updated[index] = {
                            ...updated[index],
                            studentsCount: parseInt(e.target.value, 10) || 0,
                          };
                          onChange(updated);
                        }}
                        className="w-8 bg-transparent font-bold text-teal text-center focus:outline-none"
                        title="Number of students boarding"
                      />
                    </div>

                    {/* Up / Down Reorder */}
                    <div className="flex items-center gap-0.5 border-l border-ink/10 pl-2">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(index)}
                        disabled={isFirst}
                        className="h-6 w-6 rounded-md text-ink/40 hover:text-teal hover:bg-teal/5 disabled:opacity-20 flex items-center justify-center transition"
                        title="Move Up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(index)}
                        disabled={isLast}
                        className="h-6 w-6 rounded-md text-ink/40 hover:text-teal hover:bg-teal/5 disabled:opacity-20 flex items-center justify-center transition"
                        title="Move Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Remove Stop */}
                    <button
                      type="button"
                      onClick={() => handleDeleteStop(stop.id)}
                      className="h-6 w-6 rounded-md text-ink/40 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition"
                      title="Remove Stop"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Select Predefined Stops Catalog */}
      <div className="space-y-2 pt-2 border-t border-ink/8">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink/60 flex items-center gap-1.5">
            <Building className="h-3.5 w-3.5 text-teal" /> Verified District Stops Catalog
          </h4>
          <span className="text-[11px] text-teal font-semibold">Click to add to sequence</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
          {PREDEFINED_DISTRICT_STOPS.map((catalogStop) => {
            const alreadyAdded = stops.some((s) => s.name === catalogStop.name);

            return (
              <button
                key={catalogStop.name}
                type="button"
                onClick={() => handleAddPredefined(catalogStop)}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-2xl border p-2.5 text-left text-xs transition",
                  alreadyAdded
                    ? "border-teal/30 bg-teal/5 text-ink hover:bg-teal/10"
                    : "border-ink/8 bg-white hover:border-teal/40 hover:bg-ivory/50 text-ink",
                )}
              >
                <div className="min-w-0">
                  <p className="font-semibold text-ink text-xs truncate flex items-center gap-1">
                    {alreadyAdded && <CheckCircle2 className="h-3 w-3 text-teal shrink-0" />}
                    {catalogStop.name}
                  </p>
                  <p className="text-[10px] text-ink/50 truncate">{catalogStop.address}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-mono font-bold text-teal bg-teal/10 px-1.5 py-0.5 rounded-md">
                    +{catalogStop.studentsCount} pax
                  </span>
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-teal text-white">
                    <Plus className="h-3 w-3" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Custom Stop Toggle & Form */}
      <div className="pt-2 border-t border-ink/8">
        {!showAddCustom ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            icon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => setShowAddCustom(true)}
            className="w-full text-xs text-teal font-semibold hover:bg-teal/5 border border-dashed border-teal/30 py-2.5 rounded-2xl"
          >
            Add Custom Stop Location
          </Button>
        ) : (
          <div className="rounded-2xl border border-teal/20 bg-ivory/50 p-3.5 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-ink flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-teal" /> New Custom Stop
              </p>
              <button
                type="button"
                onClick={() => setShowAddCustom(false)}
                className="text-[11px] text-ink/50 hover:text-ink"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Input
                label="Stop Name"
                placeholder="e.g. Pine Ridge Elementary Gate"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
              <Input
                label="Address / Landmark"
                placeholder="e.g. 520 Pine Ridge Way"
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <Input
                label="Scheduled Time"
                placeholder="07:35 AM"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
              />
              <Input
                label="Riders Boarding"
                placeholder="4"
                type="number"
                value={customStudents}
                onChange={(e) => setCustomStudents(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setShowAddCustom(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                icon={<Plus className="h-3 w-3" />}
                onClick={handleAddCustom}
                disabled={!customName.trim()}
              >
                Append Stop
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
