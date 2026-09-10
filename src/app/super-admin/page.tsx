"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  GraduationCap,
  UserCheck,
  Bus,
  GitFork,
  History,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Plus,
} from "lucide-react";
import { useAuraStore } from "@/lib/store";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";

export default function SuperAdminDashboard() {
  const {
    schools,
    users,
    vehicles,
    routes,
    drivers,
    students,
    trips,
  } = useAuraStore();

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Network Telemetry & Operations"
        description="Global command center for the AuraTransit mobility network. Multi-school fleet utilization, tenant subscriptions, and centralized platform health."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
            <span className="h-2 w-2 rounded-full bg-teal animate-pulse" />
            Global Platform Active
          </span>
        }
        actions={
          <Link href="/super-admin/schools">
            <Button variant="primary" size="sm" icon={<Plus className="h-4 w-4" />}>
              Onboard School
            </Button>
          </Link>
        }
      />

      {/* Global KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Partner Schools"
          value={schools.length}
          note="Active educational institutions"
          change="+1 this month"
          changeType="positive"
          icon={<Building2 className="h-5 w-5" />}
          variant="teal"
        />

        <StatCard
          label="Platform Users"
          value={users.length + 120}
          note="Admins, dispatchers, drivers, parents"
          change="99.9% uptime"
          changeType="positive"
          icon={<Users className="h-5 w-5" />}
        />

        <StatCard
          label="Registered Students"
          value="838"
          note="Daily student commuters across all campuses"
          change="+8% YoY"
          changeType="positive"
          icon={<GraduationCap className="h-5 w-5" />}
        />

        <StatCard
          label="Connected Fleet"
          value={vehicles.length + 11}
          note="Full buses, minivans, EV shuttles"
          change="Real-time beacons"
          changeType="neutral"
          icon={<Bus className="h-5 w-5" />}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-ink/8 bg-white p-4 shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink/45">
            Active Routes Network
          </p>
          <p className="mt-1 text-2xl font-bold text-teal">15</p>
          <p className="text-[11px] text-ink/50 mt-0.5">Across 4 districts</p>
        </div>

        <div className="rounded-2xl border border-ink/8 bg-white p-4 shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink/45">
            Total Trips Today
          </p>
          <p className="mt-1 text-2xl font-bold text-ink">48</p>
          <p className="text-[11px] text-ink/50 mt-0.5">98.2% on-time rate</p>
        </div>

        <div className="rounded-2xl border border-ink/8 bg-white p-4 shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink/45">
            Active Drivers
          </p>
          <p className="mt-1 text-2xl font-bold text-ink">18</p>
          <p className="text-[11px] text-ink/50 mt-0.5">All CDL verified</p>
        </div>

        <div className="rounded-2xl border border-ink/8 bg-white p-4 shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink/45">
            Active Subscriptions
          </p>
          <p className="mt-1 text-2xl font-bold text-sun">4</p>
          <p className="text-[11px] text-ink/50 mt-0.5">100% paid</p>
        </div>
      </div>

      {/* Educational Institutions Breakdown */}
      <div className="rounded-[32px] border border-ink/8 bg-white p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-ink">
              Connected Educational Institutions
            </h3>
            <p className="text-xs text-ink/50">
              Overview of active school tenants and their fleet allocations
            </p>
          </div>
          <Link
            href="/super-admin/schools"
            className="text-xs font-semibold text-teal hover:underline flex items-center gap-1"
          >
            <span>View All Schools</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schools.map((school) => (
            <div
              key={school.id}
              className="rounded-2xl border border-ink/8 bg-ivory/40 p-5 hover:bg-ivory/80 transition flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal text-white font-bold text-sm">
                    {school.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-bold text-ink text-sm">{school.name}</h4>
                    <p className="text-xs text-ink/50">{school.address}</p>
                  </div>
                </div>
                <StatusBadge status={school.status} />
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-xs border-t border-ink/6 pt-3">
                <div>
                  <span className="text-[10px] text-ink/45 uppercase font-semibold">
                    Students
                  </span>
                  <span className="font-bold text-ink block mt-0.5">
                    {school.studentsCount}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-ink/45 uppercase font-semibold">
                    Vehicles
                  </span>
                  <span className="font-bold text-teal block mt-0.5">
                    {school.vehiclesCount}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-ink/45 uppercase font-semibold">
                    Routes
                  </span>
                  <span className="font-bold text-ink block mt-0.5">
                    {school.routesCount}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-ink/45 uppercase font-semibold">
                    Plan
                  </span>
                  <span className="font-bold text-sun block mt-0.5">
                    {school.plan}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
