"use client";

import React, { useState, useMemo } from "react";
import {
  GitFork,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Bus,
  UserCheck,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { useAuraStore } from "@/lib/store";
import { Route, RouteStop } from "@/types/dashboard";
import { PageHeader } from "@/components/layout/page-header";
import { FilterBar } from "@/components/layout/filter-bar";
import { DataTable, Column } from "@/components/layout/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Drawer } from "@/components/ui/drawer";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input, Select, Textarea } from "@/components/ui/form-field";
import { RouteMapPreview } from "@/components/maps/route-map-preview";
import { RouteStopJourneyBuilder } from "@/components/routes/route-stop-journey-builder";
import { useToast } from "@/components/ui/toast";

export default function RoutesPage() {
  const {
    routes,
    vehicles,
    drivers,
    aides,
    addRoute,
    updateRoute,
    deleteRoute,
  } = useAuraStore();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editRoute, setEditRoute] = useState<Route | null>(null);
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [viewRoute, setViewRoute] = useState<Route | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Route | null>(null);

  const [formData, setFormData] = useState<{
    routeNumber: string;
    name: string;
    assignedVehicleId: string;
    assignedDriverId: string;
    assignedAideId: string;
    startTime: string;
    expectedArrival: string;
    status: Route["status"];
    description: string;
    stops: Route["stops"];
  }>({
    routeNumber: "",
    name: "",
    assignedVehicleId: "",
    assignedDriverId: "",
    assignedAideId: "",
    startTime: "07:15 AM",
    expectedArrival: "07:55 AM",
    status: "scheduled",
    description: "",
    stops: [
      { id: "s1", name: "Lincoln District Gate", address: "100 West Blvd", scheduledTime: "07:15 AM", studentsCount: 6, status: "upcoming", order: 1 },
      { id: "s2", name: "Highland Greens Stop", address: "420 Maple Way", scheduledTime: "07:30 AM", studentsCount: 8, status: "upcoming", order: 2 },
      { id: "s3", name: "Campus Dropoff Circle", address: "742 Evergreen Terrace", scheduledTime: "07:55 AM", studentsCount: 0, status: "upcoming", order: 3 },
    ],
  });

  const filteredData = useMemo(() => {
    return routes.filter((r) => {
      const matchesSearch =
        r.routeNumber.toLowerCase().includes(search.toLowerCase()) ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        (r.assignedDriverName &&
          r.assignedDriverName.toLowerCase().includes(search.toLowerCase())) ||
        (r.assignedVehicleNumber &&
          r.assignedVehicleNumber.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" || r.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [routes, search, statusFilter]);

  const handleOpenCreate = () => {
    setModalStep(1);
    setFormData({
      routeNumber: `Route ${Math.floor(10 + Math.random() * 89)}`,
      name: "Canyon Ridge Morning Express",
      assignedVehicleId: vehicles[0]?.id || "",
      assignedDriverId: drivers[0]?.id || "",
      assignedAideId: aides[0]?.id || "",
      startTime: "07:15 AM",
      expectedArrival: "07:55 AM",
      status: "scheduled",
      description: "Direct morning commuter run serving eastern suburbs.",
      stops: [
        { id: "s1", name: "Lincoln District Gate", address: "100 West Blvd", scheduledTime: "07:15 AM", studentsCount: 6, status: "upcoming", order: 1 },
        { id: "s2", name: "Highland Greens Stop", address: "420 Maple Way", scheduledTime: "07:30 AM", studentsCount: 8, status: "upcoming", order: 2 },
        { id: "s3", name: "Campus Dropoff Circle", address: "742 Evergreen Terrace", scheduledTime: "07:55 AM", studentsCount: 0, status: "upcoming", order: 3 },
      ],
    });
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (r: Route) => {
    setModalStep(1);
    setEditRoute(r);
    setFormData({
      routeNumber: r.routeNumber,
      name: r.name,
      assignedVehicleId: r.assignedVehicleId || "",
      assignedDriverId: r.assignedDriverId || "",
      assignedAideId: r.assignedAideId || "",
      startTime: r.startTime,
      expectedArrival: r.expectedArrival,
      status: r.status,
      description: r.description || "",
      stops: r.stops,
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.routeNumber || !formData.name) {
      showToast("Please enter route number and name.", "error");
      return;
    }
    if (formData.stops.length === 0) {
      showToast("Please add at least one stop to the route journey.", "error");
      return;
    }

    const assignedDriver = drivers.find((d) => d.id === formData.assignedDriverId);
    const assignedVehicle = vehicles.find((v) => v.id === formData.assignedVehicleId);
    const assignedAide = aides.find((a) => a.id === formData.assignedAideId);

    const calculatedStudents = formData.stops.reduce(
      (sum, s) => sum + (s.studentsCount || 0),
      0,
    );

    addRoute({
      ...formData,
      schoolId: "sch-1",
      assignedDriverName: assignedDriver?.name,
      assignedVehicleNumber: assignedVehicle?.vehicleNumber,
      assignedAideName: assignedAide?.name,
      studentsCount: calculatedStudents || 20,
      stopsCount: formData.stops.length,
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    });

    setCreateModalOpen(false);
    showToast(`Route ${formData.routeNumber} successfully created with ${formData.stops.length} stops.`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRoute) return;

    const assignedDriver = drivers.find((d) => d.id === formData.assignedDriverId);
    const assignedVehicle = vehicles.find((v) => v.id === formData.assignedVehicleId);
    const assignedAide = aides.find((a) => a.id === formData.assignedAideId);

    const calculatedStudents = formData.stops.reduce(
      (sum, s) => sum + (s.studentsCount || 0),
      0,
    );

    updateRoute(editRoute.id, {
      ...formData,
      assignedDriverName: assignedDriver?.name,
      assignedVehicleNumber: assignedVehicle?.vehicleNumber,
      assignedAideName: assignedAide?.name,
      studentsCount: calculatedStudents || editRoute.studentsCount,
      stopsCount: formData.stops.length,
    });

    setEditRoute(null);
    showToast(`Route ${formData.routeNumber} updated.`);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteRoute(deleteTarget.id);
    showToast(`Route ${deleteTarget.routeNumber} has been deleted.`);
    setDeleteTarget(null);
  };

  const columns: Column<Route>[] = [
    {
      key: "routeNumber",
      header: "Route",
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sun/20 text-ink font-bold text-xs shrink-0">
            <GitFork className="h-4 w-4 text-teal" />
          </div>
          <div>
            <p className="font-bold text-ink">{r.routeNumber}</p>
            <p className="text-xs text-ink/55 truncate max-w-[200px]">{r.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: "assignedVehicleNumber",
      header: "Vehicle",
      render: (r) => (
        <span className="text-xs font-semibold text-teal bg-teal/10 px-2.5 py-1 rounded-full">
          {r.assignedVehicleNumber || "Unassigned"}
        </span>
      ),
    },
    {
      key: "assignedDriverName",
      header: "Driver",
      render: (r) => (
        <span className="text-xs font-medium text-ink">
          {r.assignedDriverName || "Unassigned"}
        </span>
      ),
    },
    {
      key: "studentsCount",
      header: "Students",
      render: (r) => (
        <span className="text-xs font-bold text-ink">
          {r.studentsCount} students
        </span>
      ),
    },
    {
      key: "stopsCount",
      header: "Stops",
      render: (r) => (
        <span className="text-xs text-ink/70">{r.stopsCount} stops</span>
      ),
    },
    {
      key: "startTime",
      header: "Departure",
      render: (r) => (
        <span className="font-mono text-xs text-ink/75">{r.startTime}</span>
      ),
    },
    {
      key: "expectedArrival",
      header: "Arrival",
      render: (r) => (
        <span className="font-mono text-xs text-ink/75">
          {r.expectedArrival}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewRoute(r);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink/60 hover:bg-ivory hover:text-teal transition"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEdit(r);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink/60 hover:bg-ivory hover:text-teal transition"
            title="Edit Route"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(r);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full text-red-600 hover:bg-red-50 transition"
            title="Delete Route"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Routes"
        description="Plan, assign and monitor school transportation routes. Configure pickup sequencing, assign drivers and aides, and audit arrival punctuality."
        actions={
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={handleOpenCreate}
          >
            Create Route
          </Button>
        }
      />

      {/* Filter Bar */}
      <FilterBar
        hideSearch={true}
        totalResults={filteredData.length}
        onResetFilters={() => {
          setStatusFilter("all");
        }}
        filters={[
          {
            key: "status",
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: "All Route Statuses", value: "all" },
              { label: "In Progress", value: "in_progress" },
              { label: "Scheduled", value: "scheduled" },
              { label: "Delayed", value: "delayed" },
              { label: "Completed", value: "completed" },
            ],
          },
        ]}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        keyExtractor={(r) => r.id}
        onRowClick={(r) => setViewRoute(r)}
      />

      {/* Create / Edit Modal with 2-Step Journey Builder */}
      <Modal
        open={createModalOpen || !!editRoute}
        onClose={() => {
          setCreateModalOpen(false);
          setEditRoute(null);
        }}
        title={editRoute ? `Edit ${editRoute.routeNumber}` : "Create Route Journey"}
        description={
          modalStep === 1
            ? "Step 1: Configure route identity, vehicle assignment, schedule window & driver team."
            : `Step 2: Select stops, sequence waypoints & configure scheduled arrival timings (${formData.stops.length} stops).`
        }
        maxWidth="xl"
        footer={
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-ink/60">
              <span className="font-semibold">
                Step {modalStep} of 2:
              </span>
              <span>
                {modalStep === 1 ? "Route Parameters" : "Stop Selection & Journey"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {modalStep === 2 ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setModalStep(1)}
                >
                  ← Back to Details
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setCreateModalOpen(false);
                    setEditRoute(null);
                  }}
                >
                  Cancel
                </Button>
              )}

              {modalStep === 1 ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (!formData.routeNumber || !formData.name) {
                      showToast("Please enter a route number and route name.", "error");
                      return;
                    }
                    setModalStep(2);
                  }}
                >
                  Next: Select Stops ({formData.stops.length}) →
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={editRoute ? handleEditSubmit : handleCreateSubmit}
                >
                  {editRoute ? "Save Route" : "Finish & Create Route"}
                </Button>
              )}
            </div>
          </div>
        }
      >
        {/* Step Tabs Navigation */}
        <div className="mb-4 flex items-center gap-2 border-b border-ink/8 pb-3">
          <button
            type="button"
            onClick={() => setModalStep(1)}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              modalStep === 1
                ? "bg-teal text-white shadow-2xs"
                : "bg-ivory text-ink/70 hover:text-ink"
            }`}
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px]">
              1
            </span>
            <span>Route Details & Assignment</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (!formData.routeNumber || !formData.name) {
                showToast("Please enter route number and name first.", "error");
                return;
              }
              setModalStep(2);
            }}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              modalStep === 2
                ? "bg-teal text-white shadow-2xs"
                : "bg-ivory text-ink/70 hover:text-ink"
            }`}
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px]">
              2
            </span>
            <span>Journey Stops & Timings ({formData.stops.length})</span>
          </button>
        </div>

        {modalStep === 1 ? (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setModalStep(2); }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Route Number"
                placeholder="e.g. Route 08"
                value={formData.routeNumber}
                onChange={(e) =>
                  setFormData({ ...formData, routeNumber: e.target.value })
                }
                required
              />
              <Input
                label="Route Name"
                placeholder="e.g. West Valley Corridor"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Assigned Vehicle"
                value={formData.assignedVehicleId}
                onChange={(e) =>
                  setFormData({ ...formData, assignedVehicleId: e.target.value })
                }
                options={[
                  { label: "— Unassigned —", value: "" },
                  ...vehicles.map((v) => ({
                    label: `${v.vehicleNumber} (${v.type})`,
                    value: v.id,
                  })),
                ]}
              />
              <Select
                label="Assigned Driver"
                value={formData.assignedDriverId}
                onChange={(e) =>
                  setFormData({ ...formData, assignedDriverId: e.target.value })
                }
                options={[
                  { label: "— Unassigned —", value: "" },
                  ...drivers.map((d) => ({
                    label: `${d.name} (${d.status})`,
                    value: d.id,
                  })),
                ]}
              />
              <Select
                label="Assigned Aide"
                value={formData.assignedAideId}
                onChange={(e) =>
                  setFormData({ ...formData, assignedAideId: e.target.value })
                }
                options={[
                  { label: "— None —", value: "" },
                  ...aides.map((a) => ({
                    label: a.name,
                    value: a.id,
                  })),
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Start Time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
              />
              <Input
                label="Expected Arrival"
                value={formData.expectedArrival}
                onChange={(e) =>
                  setFormData({ ...formData, expectedArrival: e.target.value })
                }
              />
              <Select
                label="Status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as Route["status"],
                  })
                }
                options={[
                  { label: "Scheduled", value: "scheduled" },
                  { label: "In Progress", value: "in_progress" },
                  { label: "Delayed", value: "delayed" },
                  { label: "Completed", value: "completed" },
                ]}
              />
            </div>

            <Textarea
              label="Route Description / Instructions"
              placeholder="Operational notes for driver and aide regarding campus gates and construction bypasses..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </form>
        ) : (
          <RouteStopJourneyBuilder
            stops={formData.stops}
            onChange={(newStops) => {
              setFormData((prev) => ({
                ...prev,
                stops: newStops,
                startTime: newStops[0]?.scheduledTime || prev.startTime,
                expectedArrival:
                  newStops[newStops.length - 1]?.scheduledTime || prev.expectedArrival,
              }));
            }}
          />
        )}
      </Modal>

      {/* View Route Drawer */}
      <Drawer
        open={!!viewRoute}
        onClose={() => setViewRoute(null)}
        title={viewRoute ? `${viewRoute.routeNumber} · ${viewRoute.name}` : "Route Details"}
        subtitle="Lincoln International School Scheduled Service"
        footer={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setViewRoute(null)}
            >
              Close
            </Button>
            {viewRoute && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const target = viewRoute;
                  setViewRoute(null);
                  handleOpenEdit(target);
                }}
              >
                Edit Route
              </Button>
            )}
          </div>
        }
      >
        {viewRoute && (
          <div className="space-y-6">
            {/* Route Map Preview */}
            <RouteMapPreview
              routeName={viewRoute.routeNumber}
              stops={viewRoute.stops}
            />

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-ivory/70 p-3 border border-ink/8">
                <span className="text-[10px] uppercase font-bold text-ink/45 block">
                  Students
                </span>
                <span className="text-lg font-bold text-ink mt-0.5 block">
                  {viewRoute.studentsCount}
                </span>
              </div>
              <div className="rounded-2xl bg-ivory/70 p-3 border border-ink/8">
                <span className="text-[10px] uppercase font-bold text-ink/45 block">
                  Stops
                </span>
                <span className="text-lg font-bold text-ink mt-0.5 block">
                  {viewRoute.stopsCount}
                </span>
              </div>
              <div className="rounded-2xl bg-ivory/70 p-3 border border-ink/8">
                <span className="text-[10px] uppercase font-bold text-ink/45 block">
                  Status
                </span>
                <div className="mt-1">
                  <StatusBadge status={viewRoute.status} />
                </div>
              </div>
            </div>

            {/* Assigned Personnel & Cab */}
            <div className="rounded-2xl border border-ink/8 bg-white p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink/50">
                Assigned Team & Vehicle
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-ink/45 block">Vehicle</span>
                  <span className="font-semibold text-teal mt-0.5 block">
                    {viewRoute.assignedVehicleNumber || "Unassigned"}
                  </span>
                </div>
                <div>
                  <span className="text-ink/45 block">Driver</span>
                  <span className="font-semibold text-ink mt-0.5 block">
                    {viewRoute.assignedDriverName || "Unassigned"}
                  </span>
                </div>
                <div>
                  <span className="text-ink/45 block">Aide</span>
                  <span className="font-semibold text-ink mt-0.5 block">
                    {viewRoute.assignedAideName || "None"}
                  </span>
                </div>
              </div>
            </div>

            {/* Stops Sequence Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink/50">
                Stop Sequence & Times
              </h4>
              <div className="relative border-l-2 border-teal/20 pl-4 ml-2 space-y-4">
                {viewRoute.stops.map((stop, i) => (
                  <div key={stop.id} className="relative">
                    <span className="absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-teal" />
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-ink">
                        {stop.order}. {stop.name}
                      </p>
                      <span className="text-xs font-mono text-teal font-semibold">
                        {stop.scheduledTime}
                      </span>
                    </div>
                    <p className="text-[11px] text-ink/55">{stop.address}</p>
                    <p className="text-[10px] text-ink/45 mt-0.5">
                      {stop.studentsCount} students boarding
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${deleteTarget?.routeNumber}?`}
        message="This action will remove the route sequencing and unassign any active vehicles or students. This cannot be undone."
        confirmLabel="Delete Route"
      />
    </div>
  );
}
