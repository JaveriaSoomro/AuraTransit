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
  Building2,
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

export default function SuperAdminTripsPage() {
  const { trips, routes, schools } = useAuraStore();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [schoolFilter, setSchoolFilter] = useState("all");
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
      const matchesSchool =
        schoolFilter === "all" || (t.schoolId || "sch-1") === schoolFilter;
      return matchesSearch && matchesStatus && matchesSchool;
    });
  }, [trips, search, statusFilter, schoolFilter]);

  const handleExportCSV = () => {
    showToast("Exporting multi-district telemetry log to CSV...");
  };

  const handleExportPDF = () => {
    showToast("Compiling cross-campus transportation compliance PDF...");
  };

  const columns: Column<TripHistoryItem>[] = [
    {
      key: "date",
      header: "Run / Date",
      render: (t) => (
        <div>
          <p className="font-semibold text-ink">{t.date}</p>
          <p className="font-mono text-xs text-ink/45">{t.tripNumber}</p>
        </div>
      ),
    },
    {
      key: "school",
      header: "Campus District",
      render: (t) => {
        const sch = schools.find((s) => s.id === t.schoolId);
        return (
          <span className="text-xs font-medium text-ink">
            {sch?.name || t.schoolName || "Lincoln International School"}
          </span>
        );
      },
    },
    {
      key: "routeName",
      header: "Route",
      render: (t) => (
        <span className="text-xs font-semibold text-teal">{t.routeName}</span>
      ),
    },
    {
      key: "driverName",
      header: "Driver",
      render: (t) => <span className="text-xs text-ink">{t.driverName}</span>,
    },
    {
      key: "vehicleNumber",
      header: "Vehicle",
      render: (t) => (
        <span className="font-mono text-xs text-ink/75 bg-ivory px-2 py-0.5 rounded border border-ink/8">
          {t.vehicleNumber}
        </span>
      ),
    },
    {
      key: "students",
      header: "Riders",
      render: (t) => (
        <span className="text-xs font-semibold text-ink">
          {t.studentsBoarded || t.studentsCount}/{t.totalExpectedStudents || t.studentsCount}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (t) => <StatusBadge status={t.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (t) => (
        <button
          type="button"
          onClick={() => setViewTrip(t)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink/60 hover:bg-ivory hover:text-teal transition ml-auto"
          title="Trip Telemetry"
        >
          <Eye className="h-3.5 w-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cross-Tenant Trips & Audit Logs"
        description="System-wide operational log tracking scheduled runs, on-time arrivals, driver behavior, and boarding compliance across districts."
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
              variant="primary"
              size="sm"
              icon={<FileText className="h-4 w-4" />}
              onClick={handleExportPDF}
            >
              Audit PDF
            </Button>
          </div>
        }
      />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search trips by ID, route, or driver..."
        totalResults={filteredData.length}
        onResetFilters={() => {
          setSearch("");
          setStatusFilter("all");
          setSchoolFilter("all");
        }}
        filters={[
          {
            key: "school",
            label: "Campus",
            value: schoolFilter,
            onChange: setSchoolFilter,
            options: [
              { label: "All Campuses", value: "all" },
              ...schools.map((s) => ({ label: s.name, value: s.id })),
            ],
          },
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
            ],
          },
        ]}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        keyExtractor={(t) => t.id}
      />

      {/* Trip Details Drawer */}
      <Drawer
        open={!!viewTrip}
        onClose={() => setViewTrip(null)}
        title={viewTrip ? `${viewTrip.tripNumber} — ${viewTrip.routeName}` : "Trip Audit"}
        description={`Date: ${viewTrip?.date} · District Audit Trail`}
        width="lg"
      >
        {viewTrip && (
          <div className="space-y-6 text-sm text-ink">
            {routes.find((r) => r.id === viewTrip.routeId) ? (
              <RouteMapPreview
                route={routes.find((r) => r.id === viewTrip.routeId)!}
                className="h-48"
              />
            ) : null}

            <div className="flex items-center justify-between rounded-2xl bg-ivory/50 p-4 border border-ink/8">
              <div>
                <p className="text-xs text-ink/60">Status</p>
                <div className="mt-1">
                  <StatusBadge status={viewTrip.status} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-ink/60">Ridership</p>
                <p className="font-bold text-ink text-base">
                  {viewTrip.studentsBoarded || viewTrip.studentsCount} / {viewTrip.totalExpectedStudents || viewTrip.studentsCount}{" "}
                  <span className="text-xs font-normal text-ink/60">boarded</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-ink/8 p-3">
                <span className="text-xs text-ink/50 block">Campus</span>
                <span className="font-medium text-xs">
                  {schools.find((s) => s.id === viewTrip.schoolId)?.name ||
                    viewTrip.schoolName ||
                    "Lincoln International School"}
                </span>
              </div>
              <div className="rounded-2xl border border-ink/8 p-3">
                <span className="text-xs text-ink/50 block">Vehicle</span>
                <span className="font-medium text-xs font-mono">
                  {viewTrip.vehicleNumber}
                </span>
              </div>
              <div className="rounded-2xl border border-ink/8 p-3">
                <span className="text-xs text-ink/50 block">Driver</span>
                <span className="font-medium text-xs">{viewTrip.driverName}</span>
              </div>
              <div className="rounded-2xl border border-ink/8 p-3">
                <span className="text-xs text-ink/50 block">Assigned Aide</span>
                <span className="font-medium text-xs">{viewTrip.aideName || "Unassigned"}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-ink/8 bg-ivory/40 p-4 space-y-3">
              <h5 className="font-bold text-xs text-ink flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-teal" /> Run Timing & Log
              </h5>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-ink/60 block">Departed Stop 1</span>
                  <span className="font-semibold text-ink">{viewTrip.startTime}</span>
                </div>
                <div>
                  <span className="text-ink/60 block">Terminal Arrival</span>
                  <span className="font-semibold text-ink">{viewTrip.endTime || viewTrip.arrivalTime}</span>
                </div>
              </div>
              {viewTrip.notes && (
                <div className="border-t border-ink/8 pt-2 mt-2 text-xs">
                  <span className="font-bold text-ink block mb-0.5">Dispatcher Notes:</span>
                  <p className="text-ink/75 italic">{viewTrip.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
