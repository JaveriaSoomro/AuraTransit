"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Bus,
  GitFork,
  UserCheck,
  GraduationCap,
  Building2,
  Users,
} from "lucide-react";
import { useAuraStore } from "@/lib/store";

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

export function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const {
    vehicles,
    routes,
    drivers,
    students,
    schools,
    users,
  } = useAuraStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        // toggle search
        window.dispatchEvent(new CustomEvent("toggle-global-search"));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!open) return null;

  const q = query.trim().toLowerCase();

  const filteredVehicles = q
    ? vehicles.filter(
        (v) =>
          v.vehicleNumber.toLowerCase().includes(q) ||
          v.registrationNumber.toLowerCase().includes(q) ||
          (v.assignedDriverName && v.assignedDriverName.toLowerCase().includes(q)),
      )
    : vehicles.slice(0, 3);

  const filteredRoutes = q
    ? routes.filter(
        (r) =>
          r.routeNumber.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q),
      )
    : routes.slice(0, 3);

  const filteredStudents = q
    ? students.filter(
        (s) =>
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
          s.studentId.toLowerCase().includes(q),
      )
    : students.slice(0, 3);

  const filteredDrivers = q
    ? drivers.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.email.toLowerCase().includes(q),
      )
    : drivers.slice(0, 3);

  const filteredSchools = q
    ? schools.filter((s) => s.name.toLowerCase().includes(q))
    : schools.slice(0, 2);

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 pt-16 sm:p-6 sm:pt-24">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[32px] border border-ink/10 bg-white shadow-2xl animate-in fade-in-0 zoom-in-95">
        {/* Search Input */}
        <div className="flex items-center border-b border-ink/8 px-6 py-4">
          <Search className="h-5 w-5 text-ink/40 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Lincoln school, routes, vehicles, students, drivers..."
            className="w-full bg-transparent text-base font-medium text-ink placeholder:text-ink/35 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-ink/40 hover:text-ink mr-2"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block rounded-md border border-ink/15 bg-ivory px-2 py-0.5 text-[10px] font-semibold text-ink/50">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Vehicles */}
          {filteredVehicles.length > 0 && (
            <div>
              <p className="px-3 text-[10px] font-bold tracking-widest text-ink/40 uppercase">
                Vehicles
              </p>
              <div className="mt-1 space-y-1">
                {filteredVehicles.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleSelect("/admin/vehicles")}
                    className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left hover:bg-ivory transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal/10 text-teal">
                        <Bus className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          {v.vehicleNumber}
                        </p>
                        <p className="text-xs text-ink/50">
                          {v.model} · {v.assignedDriverName || "Unassigned"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-teal">
                      {v.status.replace("_", " ")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Routes */}
          {filteredRoutes.length > 0 && (
            <div>
              <p className="px-3 text-[10px] font-bold tracking-widest text-ink/40 uppercase">
                Routes
              </p>
              <div className="mt-1 space-y-1">
                {filteredRoutes.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleSelect("/admin/routes")}
                    className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left hover:bg-ivory transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sun/20 text-ink">
                        <GitFork className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          {r.routeNumber} — {r.name}
                        </p>
                        <p className="text-xs text-ink/50">
                          {r.studentsCount} students · {r.stopsCount} stops
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-sun">
                      {r.startTime}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Students */}
          {filteredStudents.length > 0 && (
            <div>
              <p className="px-3 text-[10px] font-bold tracking-widest text-ink/40 uppercase">
                Students
              </p>
              <div className="mt-1 space-y-1">
                {filteredStudents.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelect("/admin/students")}
                    className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left hover:bg-ivory transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-aura/20 text-teal">
                        <GraduationCap className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          {s.firstName} {s.lastName}
                        </p>
                        <p className="text-xs text-ink/50">
                          {s.studentId} · {s.grade} · {s.assignedRouteName || "No Route"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-ink/60">
                      {s.status.replace("_", " ")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Drivers */}
          {filteredDrivers.length > 0 && (
            <div>
              <p className="px-3 text-[10px] font-bold tracking-widest text-ink/40 uppercase">
                Drivers
              </p>
              <div className="mt-1 space-y-1">
                {filteredDrivers.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => handleSelect("/admin/drivers")}
                    className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left hover:bg-ivory transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ivory text-teal">
                        <UserCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          {d.name}
                        </p>
                        <p className="text-xs text-ink/50">
                          {d.phone} · {d.assignedVehicleNumber || "Reserve"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-teal">
                      ★ {d.rating}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Schools */}
          {filteredSchools.length > 0 && (
            <div>
              <p className="px-3 text-[10px] font-bold tracking-widest text-ink/40 uppercase">
                Schools
              </p>
              <div className="mt-1 space-y-1">
                {filteredSchools.map((sch) => (
                  <button
                    key={sch.id}
                    onClick={() => handleSelect("/super-admin/schools")}
                    className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left hover:bg-ivory transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal text-white">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          {sch.name}
                        </p>
                        <p className="text-xs text-ink/50">
                          {sch.address} · {sch.studentsCount} Students
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-teal/10 px-2 py-0.5 text-[10px] font-bold text-teal">
                      {sch.plan}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
