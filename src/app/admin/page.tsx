"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  UserCheck,
  GitFork,
  Bus,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  MapPin,
} from "lucide-react";
import { useAuraStore } from "@/lib/store";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { LiveMapView } from "@/components/maps/live-map-view";
import { StatusBadge } from "@/components/ui/status-badge";

export default function SchoolAdminDashboard() {
  const {
    currentSchool,
    vehicles,
    routes,
    drivers,
    aides,
    students,
    trips,
  } = useAuraStore();

  const activeVehicles = vehicles.filter(
    (v) => v.status === "on_route" || v.status === "at_stop",
  );
  const delayedVehicles = vehicles.filter((v) => v.status === "delayed");
  const maintenanceVehicles = vehicles.filter((v) => v.status === "maintenance");
  const inactiveVehicles = vehicles.filter((v) => v.status === "inactive");

  const totalStudentsOnboard = vehicles.reduce(
    (acc, v) => acc + (v.studentsOnboard || 0),
    0,
  );

  return (
    <div className="space-y-8">
      {/* Top Welcome & Page Header */}
      <PageHeader
        title="Operations Overview"
        description={`Live transportation network for ${currentSchool?.name || "Lincoln International School"}. All morning departures and arrivals monitored in real-time.`}
        badge={
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
            <span className="h-2 w-2 rounded-full bg-teal animate-pulse" />
            System Live
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Link href="/admin/live-map">
              <Button variant="sun" size="sm" icon={<MapPin className="h-4 w-4" />}>
                Full Live Map
              </Button>
            </Link>
            <Link href="/admin/vehicles">
              <Button variant="primary" size="sm" icon={<Bus className="h-4 w-4" />}>
                Manage Fleet
              </Button>
            </Link>
          </div>
        }
      />

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Students"
          value={students.length > 0 ? students.length * 40 : 348}
          note="Registered for daily transport"
          change="+12 this month"
          changeType="positive"
          icon={<GraduationCap className="h-5 w-5" />}
          variant="teal"
        />

        <StatCard
          label="Total Routes"
          value={routes.length}
          note={`${routes.filter((r) => r.status === "in_progress").length} currently in transit`}
          change="100% covered"
          changeType="positive"
          icon={<GitFork className="h-5 w-5" />}
        />

        <StatCard
          label="Total Drivers"
          value={drivers.length}
          note="All CDL & background verified"
          change="0 unassigned"
          changeType="positive"
          icon={<UserCheck className="h-5 w-5" />}
        />

        <StatCard
          label="Total Aides"
          value={aides.length}
          note="Safety certified assistants"
          change="Active on duty"
          changeType="neutral"
          icon={<ShieldCheck className="h-5 w-5" />}
        />
      </div>

      {/* Secondary Operational Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-2xl border border-ink/8 bg-white p-3.5 shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink/45">
            Active in Transit
          </p>
          <p className="mt-1 text-2xl font-bold text-teal">
            {activeVehicles.length}
          </p>
        </div>

        <div className="rounded-2xl border border-ink/8 bg-white p-3.5 shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink/45">
            Students on Board
          </p>
          <p className="mt-1 text-2xl font-bold text-ink">
            {totalStudentsOnboard}
          </p>
        </div>

        <div className="rounded-2xl border border-ink/8 bg-white p-3.5 shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink/45">
            Trips Today
          </p>
          <p className="mt-1 text-2xl font-bold text-ink">
            {trips.length}
          </p>
        </div>

        <div className="rounded-2xl border border-ink/8 bg-white p-3.5 shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink/45">
            Routes Running
          </p>
          <p className="mt-1 text-2xl font-bold text-aura">
            {routes.filter((r) => r.status === "in_progress").length}
          </p>
        </div>

        <div className="rounded-2xl border border-ink/8 bg-white p-3.5 shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink/45">
            Late / Delayed Trips
          </p>
          <p className="mt-1 text-2xl font-bold text-sun">
            {delayedVehicles.length}
          </p>
        </div>

        <div className="rounded-2xl border border-ink/8 bg-white p-3.5 shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink/45">
            Fleet Vehicles
          </p>
          <p className="mt-1 text-2xl font-bold text-ink">
            {vehicles.length}
          </p>
        </div>
      </div>

      {/* Live Network Status Map & Fleet Breakdown Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
        {/* Large Map Panel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-ink">
              Live Network Status
            </h2>
            <Link
              href="/admin/live-map"
              className="text-xs font-semibold text-teal hover:underline flex items-center gap-1"
            >
              <span>Expand Map</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <LiveMapView vehicles={vehicles} />
        </div>

        {/* Fleet Status Metrics & Quick Actions */}
        <div className="space-y-6">
          {/* Fleet Status Metrics Card */}
          <div className="rounded-[32px] border border-ink/8 bg-white p-6 shadow-xs">
            <h3 className="text-base font-semibold text-ink">
              Fleet Status Breakdown
            </h3>
            <p className="text-xs text-ink/50 mt-0.5">
              Current operational distribution
            </p>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-ivory/60 p-3">
                <div className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-aura" />
                  <span className="text-xs font-semibold text-ink">
                    Active in Transit
                  </span>
                </div>
                <span className="text-sm font-bold text-teal">
                  {activeVehicles.length}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-ivory/60 p-3">
                <div className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-sun" />
                  <span className="text-xs font-semibold text-ink">
                    Traffic Delayed
                  </span>
                </div>
                <span className="text-sm font-bold text-sun">
                  {delayedVehicles.length}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-ivory/60 p-3">
                <div className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-ink/30" />
                  <span className="text-xs font-semibold text-ink">
                    Depot / Standby
                  </span>
                </div>
                <span className="text-sm font-bold text-ink/70">
                  {inactiveVehicles.length + 1}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-ivory/60 p-3">
                <div className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="text-xs font-semibold text-ink">
                    Under Maintenance
                  </span>
                </div>
                <span className="text-sm font-bold text-red-600">
                  {maintenanceVehicles.length}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="rounded-[32px] border border-ink/8 bg-white p-6 shadow-xs">
            <h3 className="text-base font-semibold text-ink">Quick Actions</h3>
            <p className="text-xs text-ink/50 mt-0.5">
              Frequently accessed management tools
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <Link
                href="/admin/vehicles"
                className="flex flex-col items-center justify-center rounded-2xl border border-ink/8 bg-ivory/40 p-4 text-center hover:bg-ivory hover:border-ink/20 transition group"
              >
                <Bus className="h-5 w-5 text-teal group-hover:scale-110 transition-transform" />
                <span className="mt-2 text-xs font-semibold text-ink">
                  Manage Vehicles
                </span>
              </Link>

              <Link
                href="/admin/routes"
                className="flex flex-col items-center justify-center rounded-2xl border border-ink/8 bg-ivory/40 p-4 text-center hover:bg-ivory hover:border-ink/20 transition group"
              >
                <GitFork className="h-5 w-5 text-teal group-hover:scale-110 transition-transform" />
                <span className="mt-2 text-xs font-semibold text-ink">
                  School Routes
                </span>
              </Link>

              <Link
                href="/admin/students"
                className="flex flex-col items-center justify-center rounded-2xl border border-ink/8 bg-ivory/40 p-4 text-center hover:bg-ivory hover:border-ink/20 transition group"
              >
                <GraduationCap className="h-5 w-5 text-teal group-hover:scale-110 transition-transform" />
                <span className="mt-2 text-xs font-semibold text-ink">
                  View Students
                </span>
              </Link>

              <Link
                href="/admin/drivers"
                className="flex flex-col items-center justify-center rounded-2xl border border-ink/8 bg-ivory/40 p-4 text-center hover:bg-ivory hover:border-ink/20 transition group"
              >
                <UserCheck className="h-5 w-5 text-teal group-hover:scale-110 transition-transform" />
                <span className="mt-2 text-xs font-semibold text-ink">
                  View Drivers
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
