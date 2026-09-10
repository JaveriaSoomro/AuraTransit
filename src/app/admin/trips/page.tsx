"use client";

import React, { useState, useMemo } from "react";
import {
  History,
  Download,
  FileSpreadsheet,
  FileText,
  Clock,
  Bus,
  UserCheck,
  GitFork,
  AlertTriangle,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { useAuraStore } from "@/lib/store";
import { TripHistoryItem } from "@/types/dashboard";
import { PageHeader } from "@/components/layout/page-header";
import { FilterBar } from "@/components/layout/filter-bar";
import { DataTable, Column } from "@/components/layout/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { RouteMapPreview } from "@/components/maps/route-map-preview";
import { useToast } from "@/components/ui/toast";

export default function TripHistoryPage() {
  const { trips, routes } = useAuraStore();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewTrip, setViewTrip] = useState<TripHistoryItem | null>(null);

  const filteredData = useMemo(() => {
    return trips.filter((t) => {
      const matchesSearch =
        t.tripNumber.toLowerCase().includes(search.toLowerCase()) ||
        t.routeName.toLowerCase().includes(search.toLowerCase()) ||
        t.driverName.toLowerCase().includes(search.toLowerCase()) ||
        t.vehicleNumber.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || t.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [trips, search, statusFilter]);

  const handleExportCSV = () => {
    showToast("Exporting Trip History to CSV format...");
  };

  const handleExportPDF = () => {
    showToast("Generating official School Transportation Audit PDF...");
  };

  const columns: Column<TripHistoryItem>[] = [
    {
      key: "date",
      header: "Date / Run",
      render: (t) => (
        <div>
          <p className="font-semibold text-ink">{t.date}</p>
          <p className="font-mono text-xs text-ink/45">{t.tripNumber}</p>
        </div>
      ),
    },
    {
      key: "routeName",
      header: "Route",
      render: (t) => (
        <span className="text-xs font-semibold text-teal">{t.routeName}</span>
      ),
    },
    {
      key: "vehicleNumber",
      header: "Vehicle",
      render: (t) => (
        <span className="text-xs font-mono bg-ivory px-2 py-0.5 rounded border border-ink/8 text-ink">
          {t.vehicleNumber}
        </span>
      ),
    },
    {
      key: "driverName",
      header: "Driver",
      render: (t) => <span className="text-xs text-ink">{t.driverName}</span>,
    },
    {
      key: "studentsCount",
      header: "Students",
      render: (t) => (
        <span className="text-xs font-bold text-ink">{t.studentsCount}</span>
      ),
    },
    {
      key: "startTime",
      header: "Departure",
      render: (t) => (
        <span className="font-mono text-xs text-ink/70">{t.startTime}</span>
      ),
    },
    {
      key: "arrivalTime",
      header: "Arrival",
      render: (t) => (
        <span className="font-mono text-xs text-ink/70">{t.arrivalTime}</span>
      ),
    },
    {
      key: "durationMinutes",
      header: "Duration",
      render: (t) => (
        <span className="text-xs text-ink/70">{t.durationMinutes} min</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (t) => <StatusBadge status={t.status} />,
    },
    {
      key: "actions",
      header: "Details",
      align: "right",
      render: (t) => (
        <button
          type="button"
          onClick={() => setViewTrip(t)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink/60 hover:bg-ivory hover:text-teal transition"
          title="Inspect Trip"
        >
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trip History & Punctuality Audit"
        description="Comprehensive audit of all completed, in-progress, and delayed runs across Lincoln International School. Analyze boarding events and travel times."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<FileSpreadsheet className="h-4 w-4 text-teal" />}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<FileText className="h-4 w-4 text-sun" />}
              onClick={handleExportPDF}
            >
              Export PDF
            </Button>
          </div>
        }
      />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search trips by ID, route, vehicle, or driver..."
        totalResults={filteredData.length}
        onResetFilters={() => {
          setSearch("");
          setStatusFilter("all");
        }}
        filters={[
          {
            key: "status",
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: "All Statuses", value: "all" },
              { label: "Completed", value: "completed" },
              { label: "In Progress", value: "in_progress" },
              { label: "Delayed", value: "delayed" },
              { label: "Cancelled", value: "cancelled" },
            ],
          },
        ]}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        keyExtractor={(t) => t.id}
        onRowClick={(t) => setViewTrip(t)}
      />

      {/* Trip Inspector Drawer */}
      <Drawer
        open={!!viewTrip}
        onClose={() => setViewTrip(null)}
        title={viewTrip ? `${viewTrip.tripNumber} · Audit Log` : "Trip Details"}
        subtitle={viewTrip ? `${viewTrip.date} · ${viewTrip.routeName}` : ""}
        footer={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setViewTrip(null)}
          >
            Close
          </Button>
        }
      >
        {viewTrip && (
          <div className="space-y-6">
            <RouteMapPreview routeName={viewTrip.routeName} />

            <div className="flex items-center justify-between rounded-2xl bg-ivory/60 p-4 border border-ink/8">
              <div>
                <p className="text-xs text-ink/50 uppercase tracking-wider font-semibold">
                  Status
                </p>
                <div className="mt-1">
                  <StatusBadge status={viewTrip.status} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-ink/50 uppercase tracking-wider font-semibold">
                  Run Time
                </p>
                <p className="text-base font-bold text-ink">
                  {viewTrip.durationMinutes} minutes
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-ivory/50 p-3 border border-ink/6">
                <span className="text-ink/50 block">Assigned Bus</span>
                <span className="font-bold text-teal mt-0.5 block">
                  {viewTrip.vehicleNumber}
                </span>
              </div>
              <div className="rounded-xl bg-ivory/50 p-3 border border-ink/6">
                <span className="text-ink/50 block">Driver</span>
                <span className="font-bold text-ink mt-0.5 block">
                  {viewTrip.driverName}
                </span>
              </div>
              <div className="rounded-xl bg-ivory/50 p-3 border border-ink/6">
                <span className="text-ink/50 block">Departed</span>
                <span className="font-mono text-ink mt-0.5 block">
                  {viewTrip.startTime}
                </span>
              </div>
              <div className="rounded-xl bg-ivory/50 p-3 border border-ink/6">
                <span className="text-ink/50 block">Arrived</span>
                <span className="font-mono text-ink mt-0.5 block">
                  {viewTrip.arrivalTime}
                </span>
              </div>
            </div>

            {viewTrip.notes && (
              <div className="rounded-2xl border border-ink/8 bg-white p-4 text-xs">
                <p className="font-bold text-ink">Dispatch & Driver Notes</p>
                <p className="text-ink/75 mt-1 leading-relaxed">{viewTrip.notes}</p>
              </div>
            )}

            {/* Boarding Events Timeline */}
            {viewTrip.events && viewTrip.events.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink/50">
                  Recorded Chronological Telemetry
                </h4>
                <div className="relative border-l-2 border-teal/20 pl-4 ml-2 space-y-4">
                  {viewTrip.events.map((ev, i) => (
                    <div key={i} className="relative">
                      <span className="absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-teal" />
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-ink">
                          {ev.description}
                        </p>
                        <span className="text-[11px] font-mono text-teal">
                          {ev.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
