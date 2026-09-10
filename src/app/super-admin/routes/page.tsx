"use client";

import React, { useState, useMemo } from "react";
import {
  GitFork,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Clock,
  MapPin,
  Bus,
  UserCheck,
  Shield,
  Building2,
} from "lucide-react";
import { useAuraStore } from "@/lib/store";
import { Route } from "@/types/dashboard";
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

export default function SuperAdminRoutesPage() {
  const {
    routes,
    vehicles,
    drivers,
    aides,
    schools,
    addRoute,
    updateRoute,
    deleteRoute,
  } = useAuraStore();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [schoolFilter, setSchoolFilter] = useState("all");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editRoute, setEditRoute] = useState<Route | null>(null);
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [viewRoute, setViewRoute] = useState<Route | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Route | null>(null);

  const [formData, setFormData] = useState<{
    routeNumber: string;
    name: string;
    schoolId: string;
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
    schoolId: "sch-1",
    assignedVehicleId: "",
    assignedDriverId: "",
    assignedAideId: "",
    startTime: "07:15 AM",
    expectedArrival: "07:55 AM",
    status: "scheduled",
    description: "",
    stops: [
      {
        id: "s1",
        name: "Lincoln District Gate",
        address: "100 West Blvd",
        scheduledTime: "07:15 AM",
        studentsCount: 6,
        status: "upcoming",
        order: 1,
      },
      {
        id: "s2",
        name: "Highland Greens Stop",
        address: "420 Maple Way",
        scheduledTime: "07:30 AM",
        studentsCount: 8,
        status: "upcoming" as const,
        order: 2,
      },
      {
        id: "s3",
        name: "Campus Dropoff Circle",
        address: "742 Evergreen Terrace",
        scheduledTime: "07:55 AM",
        studentsCount: 0,
        status: "upcoming" as const,
        order: 3,
      },
    ],
  });

  const filteredData = useMemo(() => {
    return routes.filter((r) => {
      const matchesSearch =
        r.routeNumber.toLowerCase().includes(search.toLowerCase()) ||
        r.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || r.status === statusFilter;
      const matchesSchool =
        schoolFilter === "all" || (r.schoolId || "sch-1") === schoolFilter;
      return matchesSearch && matchesStatus && matchesSchool;
    });
  }, [routes, search, statusFilter, schoolFilter]);

  const handleOpenCreate = () => {
    setModalStep(1);
    const nextNum = Math.floor(10 + Math.random() * 90);
    setFormData({
      routeNumber: `RT-${nextNum}`,
      name: "North Lake Expressway Morning Express",
      schoolId: schools[0]?.id || "sch-1",
      assignedVehicleId: "",
      assignedDriverId: "",
      assignedAideId: "",
      startTime: "07:15 AM",
      expectedArrival: "07:55 AM",
      status: "scheduled",
      description: "Dedicated express route for suburban student transportation.",
      stops: [
        {
          id: "s1",
          name: "Lincoln District Gate",
          address: "100 West Blvd",
          scheduledTime: "07:15 AM",
          studentsCount: 6,
          status: "upcoming",
          order: 1,
        },
        {
          id: "s2",
          name: "Highland Greens Stop",
          address: "420 Maple Way",
          scheduledTime: "07:30 AM",
          studentsCount: 8,
          status: "upcoming",
          order: 2,
        },
        {
          id: "s3",
          name: "Campus Dropoff Circle",
          address: "742 Evergreen Terrace",
          scheduledTime: "07:55 AM",
          studentsCount: 0,
          status: "upcoming",
          order: 3,
        },
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
      schoolId: r.schoolId || "sch-1",
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
      showToast("Please provide route code and name.", "error");
      return;
    }
    if (formData.stops.length === 0) {
      showToast("Please add at least one stop to the route journey.", "error");
      return;
    }

    const assignedVeh = vehicles.find((v) => v.id === formData.assignedVehicleId);
    const assignedDrv = drivers.find((d) => d.id === formData.assignedDriverId);
    const assignedAide = aides.find((a) => a.id === formData.assignedAideId);
    const targetSchool = schools.find((s) => s.id === formData.schoolId);

    const calculatedStudents = formData.stops.reduce(
      (sum, s) => sum + (s.studentsCount || 0),
      0,
    );

    addRoute({
      routeNumber: formData.routeNumber,
      name: formData.name,
      schoolId: formData.schoolId,
      schoolName: targetSchool?.name || "Lincoln International School",
      assignedVehicleId: formData.assignedVehicleId || undefined,
      assignedVehicleNumber: assignedVeh?.vehicleNumber,
      assignedDriverId: formData.assignedDriverId || undefined,
      assignedDriverName: assignedDrv?.name,
      assignedAideId: formData.assignedAideId || undefined,
      assignedAideName: assignedAide?.name,
      studentsCount: calculatedStudents || 18,
      stopsCount: formData.stops.length,
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      startTime: formData.startTime,
      expectedArrival: formData.expectedArrival,
      status: formData.status,
      description: formData.description,
      stops: formData.stops,
    });

    setCreateModalOpen(false);
    showToast(`Route ${formData.routeNumber} created with ${formData.stops.length} stops across network.`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRoute) return;

    const assignedVeh = vehicles.find((v) => v.id === formData.assignedVehicleId);
    const assignedDrv = drivers.find((d) => d.id === formData.assignedDriverId);
    const assignedAide = aides.find((a) => a.id === formData.assignedAideId);
    const targetSchool = schools.find((s) => s.id === formData.schoolId);

    const calculatedStudents = formData.stops.reduce(
      (sum, s) => sum + (s.studentsCount || 0),
      0,
    );

    updateRoute(editRoute.id, {
      routeNumber: formData.routeNumber,
      name: formData.name,
      schoolId: formData.schoolId,
      schoolName: targetSchool?.name,
      assignedVehicleId: formData.assignedVehicleId || undefined,
      assignedVehicleNumber: assignedVeh?.vehicleNumber,
      assignedDriverId: formData.assignedDriverId || undefined,
      assignedDriverName: assignedDrv?.name,
      assignedAideId: formData.assignedAideId || undefined,
      assignedAideName: assignedAide?.name,
      studentsCount: calculatedStudents || editRoute.studentsCount,
      stopsCount: formData.stops.length,
      startTime: formData.startTime,
      expectedArrival: formData.expectedArrival,
      status: formData.status,
      description: formData.description,
      stops: formData.stops,
    });

    setEditRoute(null);
    showToast(`Updated corridor ${formData.routeNumber}.`);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteRoute(deleteTarget.id);
    showToast(`Route ${deleteTarget.routeNumber} deleted.`);
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
            <p className="text-xs text-ink/55">{r.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: "school",
      header: "Campus District",
      render: (r) => {
        const sch = schools.find((s) => s.id === r.schoolId);
        return (
          <span className="text-xs text-ink font-medium">
            {sch?.name || r.schoolName || "Lincoln International School"}
          </span>
        );
      },
    },
    {
      key: "assignedVehicleNumber",
      header: "Vehicle",
      render: (r) => (
        <span className="text-xs font-semibold text-teal">
          {r.assignedVehicleNumber || "Unassigned"}
        </span>
      ),
    },
    {
      key: "studentsCount",
      header: "Students",
      render: (r) => (
        <span className="text-xs font-bold text-ink">{r.studentsCount}</span>
      ),
    },
    {
      key: "schedule",
      header: "Window",
      render: (r) => (
        <span className="text-xs text-ink/75 font-mono">
          {r.startTime} – {r.expectedArrival}
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
            onClick={() => setViewRoute(r)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink/60 hover:bg-ivory hover:text-teal transition"
            title="View Waypoints"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleOpenEdit(r)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink/60 hover:bg-ivory hover:text-teal transition"
            title="Edit Route"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(r)}
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
      <PageHeader
        title="Global Routes Management"
        description="Monitor active school transportation corridors, assign vehicles and drivers, and track stop performance across districts."
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

      <FilterBar
        hideSearch={true}
        totalResults={filteredData.length}
        onResetFilters={() => {
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
              { label: "In Progress", value: "in_progress" },
              { label: "Scheduled", value: "scheduled" },
              { label: "Delayed", value: "delayed" },
              { label: "Completed", value: "completed" },
            ],
          },
        ]}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        keyExtractor={(r) => r.id}
      />

      {/* Route Detail Drawer */}
      <Drawer
        open={!!viewRoute}
        onClose={() => setViewRoute(null)}
        title={viewRoute?.name || "Route Details"}
        description={`Corridor: ${viewRoute?.routeNumber} · ${viewRoute?.stopsCount || viewRoute?.stops?.length || 0} stops scheduled`}
        width="lg"
      >
        {viewRoute && (
          <div className="space-y-6 text-sm text-ink">
            <RouteMapPreview route={viewRoute} className="h-48" />

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-ink/8 p-3">
                <span className="text-xs text-ink/50 block">Assigned Vehicle</span>
                <span className="font-semibold text-xs text-teal">
                  {viewRoute.assignedVehicleNumber || "Unassigned"}
                </span>
              </div>
              <div className="rounded-2xl border border-ink/8 p-3">
                <span className="text-xs text-ink/50 block">Driver</span>
                <span className="font-semibold text-xs">
                  {viewRoute.assignedDriverName || "Unassigned"}
                </span>
              </div>
              <div className="rounded-2xl border border-ink/8 p-3">
                <span className="text-xs text-ink/50 block">Transit Window</span>
                <span className="font-mono text-xs">
                  {viewRoute.startTime} – {viewRoute.expectedArrival}
                </span>
              </div>
              <div className="rounded-2xl border border-ink/8 p-3">
                <span className="text-xs text-ink/50 block">Ridership</span>
                <span className="font-semibold text-xs">
                  {viewRoute.studentsCount} Students Assigned
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-xs text-ink flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-teal" /> Stops & Timeline
              </h5>
              <div className="space-y-2">
                {viewRoute.stops.map((st, i) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between rounded-xl border border-ink/8 bg-ivory/30 p-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal text-white font-bold text-[10px]">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-ink">{st.name}</p>
                        <p className="text-[11px] text-ink/50">{st.address}</p>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-ink">{st.scheduledTime}</span>
                      <p className="text-[10px] text-ink/50">{st.studentsCount} riders</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Create / Edit Modal with 2-Step Journey Builder */}
      <Modal
        open={createModalOpen || !!editRoute}
        onClose={() => {
          setCreateModalOpen(false);
          setEditRoute(null);
        }}
        title={editRoute ? `Edit Route — ${editRoute.routeNumber}` : "Create Route Journey"}
        description={
          modalStep === 1
            ? "Step 1: Configure district routing, campus assignment, schedule window & fleet vehicle."
            : `Step 2: Select and sequence route stops (${formData.stops.length} stops configured).`
        }
        maxWidth="xl"
        footer={
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-ink/60">
              <span className="font-semibold">
                Step {modalStep} of 2:
              </span>
              <span>
                {modalStep === 1 ? "Corridor Setup" : "Stops & Waypoints"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {modalStep === 2 ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setModalStep(1)}
                >
                  ← Back to Setup
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
                      showToast("Please enter route code and name.", "error");
                      return;
                    }
                    setModalStep(2);
                  }}
                >
                  Next: Stops & Timeline ({formData.stops.length}) →
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={editRoute ? handleEditSubmit : handleCreateSubmit}
                >
                  {editRoute ? "Save Changes" : "Finish & Create Route"}
                </Button>
              )}
            </div>
          </div>
        }
      >
        {/* Step Navigation Bar */}
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
            <span>Corridor Details</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (!formData.routeNumber || !formData.name) {
                showToast("Please enter route code and name first.", "error");
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
            <span>Select Stops & Journey ({formData.stops.length})</span>
          </button>
        </div>

        {modalStep === 1 ? (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setModalStep(2); }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Route Identifier"
                placeholder="e.g. RT-08"
                value={formData.routeNumber}
                onChange={(e) =>
                  setFormData({ ...formData, routeNumber: e.target.value })
                }
                required
              />
              <Input
                label="Route Name"
                placeholder="Eastside Morning Loop"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <Select
              label="Campus District"
              value={formData.schoolId}
              onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
              options={schools.map((s) => ({ label: s.name, value: s.id }))}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Assigned Vehicle"
                value={formData.assignedVehicleId}
                onChange={(e) =>
                  setFormData({ ...formData, assignedVehicleId: e.target.value })
                }
                options={[
                  { label: "None (Unassigned)", value: "" },
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
                  { label: "None (Unassigned)", value: "" },
                  ...drivers.map((d) => ({ label: d.name, value: d.id })),
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Departure Time"
                placeholder="07:15 AM"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
              />
              <Input
                label="Expected Arrival"
                placeholder="07:55 AM"
                value={formData.expectedArrival}
                onChange={(e) =>
                  setFormData({ ...formData, expectedArrival: e.target.value })
                }
              />
            </div>

            <Select
              label="Initial Status"
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

            <Textarea
              label="Route Description"
              placeholder="Suburban pickup loop covering north neighborhood stops..."
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete Route ${deleteTarget?.routeNumber}?`}
        message="This will unassign all riders and remove this corridor from active dispatch."
        confirmLabel="Delete Route"
      />
    </div>
  );
}
