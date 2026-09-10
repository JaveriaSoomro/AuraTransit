"use client";

import React, { useState, useMemo } from "react";
import {
  Bus,
  Plus,
  Edit2,
  Trash2,
  Eye,
  SlidersHorizontal,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import { useAuraStore } from "@/lib/store";
import { Vehicle } from "@/types/dashboard";
import { PageHeader } from "@/components/layout/page-header";
import { FilterBar } from "@/components/layout/filter-bar";
import { DataTable, Column } from "@/components/layout/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Drawer } from "@/components/ui/drawer";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input, Select } from "@/components/ui/form-field";
import { useToast } from "@/components/ui/toast";

export default function VehiclesPage() {
  const {
    vehicles,
    drivers,
    routes,
    addVehicle,
    updateVehicle,
    deleteVehicle,
  } = useAuraStore();
  const { showToast } = useToast();

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Modal States
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [viewVehicle, setViewVehicle] = useState<Vehicle | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);

  // Form State for Create / Edit
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    registrationNumber: "",
    type: "Full Bus (72 pax)" as Vehicle["type"],
    capacity: 72,
    model: "",
    year: 2024,
    assignedDriverId: "",
    assignedRouteId: "",
    status: "active" as Vehicle["status"],
  });

  // Filtered dataset
  const filteredData = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch =
        v.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
        v.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
        (v.assignedDriverName &&
          v.assignedDriverName.toLowerCase().includes(search.toLowerCase())) ||
        v.model.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || v.status === statusFilter;
      const matchesType = typeFilter === "all" || v.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [vehicles, search, statusFilter, typeFilter]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormData({
      vehicleNumber: `BUS-${Math.floor(100 + Math.random() * 900)}`,
      registrationNumber: `IL-TR-${Math.floor(1000 + Math.random() * 9000)}`,
      type: "Full Bus (72 pax)",
      capacity: 72,
      model: "Blue Bird Vision Clean Diesel",
      year: 2024,
      assignedDriverId: "",
      assignedRouteId: "",
      status: "active",
    });
    setCreateModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (v: Vehicle) => {
    setEditVehicle(v);
    setFormData({
      vehicleNumber: v.vehicleNumber,
      registrationNumber: v.registrationNumber,
      type: v.type,
      capacity: v.capacity,
      model: v.model,
      year: v.year,
      assignedDriverId: v.assignedDriverId || "",
      assignedRouteId: v.assignedRouteId || "",
      status: v.status,
    });
  };

  // Submit Create
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicleNumber || !formData.registrationNumber) {
      showToast("Please fill in vehicle & registration number.", "error");
      return;
    }

    const assignedDriver = drivers.find((d) => d.id === formData.assignedDriverId);
    const assignedRoute = routes.find((r) => r.id === formData.assignedRouteId);

    addVehicle({
      ...formData,
      schoolId: "sch-1",
      assignedDriverName: assignedDriver?.name,
      assignedRouteName: assignedRoute?.name,
      currentLocation: {
        lat: 41.875,
        lng: -87.62,
        name: "Lincoln Central Yard",
      },
      speedMph: 0,
      studentsOnboard: 0,
    });

    setCreateModalOpen(false);
    showToast(`Vehicle ${formData.vehicleNumber} successfully added to fleet.`);
  };

  // Submit Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editVehicle) return;

    const assignedDriver = drivers.find((d) => d.id === formData.assignedDriverId);
    const assignedRoute = routes.find((r) => r.id === formData.assignedRouteId);

    updateVehicle(editVehicle.id, {
      ...formData,
      assignedDriverName: assignedDriver?.name,
      assignedRouteName: assignedRoute?.name,
    });

    setEditVehicle(null);
    showToast(`Vehicle ${formData.vehicleNumber} updated.`);
  };

  // Submit Delete
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteVehicle(deleteTarget.id);
    showToast(`Vehicle ${deleteTarget.vehicleNumber} removed from fleet.`);
    setDeleteTarget(null);
  };

  // Table Columns
  const columns: Column<Vehicle>[] = [
    {
      key: "vehicleNumber",
      header: "Vehicle",
      render: (v) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-teal/10 text-teal shrink-0">
            <Bus className="h-4 w-4" />
          </div>
          <div>
            <p className="font-bold text-ink">{v.vehicleNumber}</p>
            <p className="text-xs text-ink/50">{v.model}</p>
          </div>
        </div>
      ),
    },
    {
      key: "registrationNumber",
      header: "Registration",
      render: (v) => (
        <span className="font-mono text-xs text-ink/75 bg-ivory px-2 py-1 rounded-md border border-ink/8">
          {v.registrationNumber}
        </span>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (v) => <span className="text-xs text-ink/80">{v.type}</span>,
    },
    {
      key: "assignedDriverName",
      header: "Assigned Driver",
      render: (v) => (
        <span className="text-xs font-medium text-ink">
          {v.assignedDriverName || (
            <span className="text-ink/40 italic">Unassigned</span>
          )}
        </span>
      ),
    },
    {
      key: "assignedRouteName",
      header: "Assigned Route",
      render: (v) => (
        <span className="text-xs text-ink/80">
          {v.assignedRouteName || (
            <span className="text-ink/40 italic">Reserve Depot</span>
          )}
        </span>
      ),
    },
    {
      key: "capacity",
      header: "Capacity",
      render: (v) => (
        <span className="text-xs font-semibold text-ink">
          {v.capacity} seats
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (v) => <StatusBadge status={v.status} />,
    },
    {
      key: "lastUpdated",
      header: "Last Updated",
      render: (v) => (
        <span className="text-xs text-ink/50">{v.lastUpdated}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (v) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewVehicle(v);
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
              handleOpenEdit(v);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink/60 hover:bg-ivory hover:text-teal transition"
            title="Edit Vehicle"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(v);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full text-red-600 hover:bg-red-50 transition"
            title="Delete Vehicle"
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
        title="Vehicles"
        description="Manage the school's transportation fleet. View registrations, inspections, assigned drivers and real-time transit capacity."
        actions={
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={handleOpenCreate}
          >
            Add Vehicle
          </Button>
        }
      />

      {/* Search & Filter Bar */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search vehicle number, registration, model, or driver..."
        totalResults={filteredData.length}
        onResetFilters={() => {
          setSearch("");
          setStatusFilter("all");
          setTypeFilter("all");
        }}
        filters={[
          {
            key: "status",
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: "All Statuses", value: "all" },
              { label: "Active", value: "active" },
              { label: "On Route", value: "on_route" },
              { label: "At Stop", value: "at_stop" },
              { label: "Delayed", value: "delayed" },
              { label: "Maintenance", value: "maintenance" },
              { label: "Inactive", value: "inactive" },
            ],
          },
          {
            key: "type",
            label: "Type",
            value: typeFilter,
            onChange: setTypeFilter,
            options: [
              { label: "All Vehicle Types", value: "all" },
              { label: "Full Bus (72 pax)", value: "Full Bus (72 pax)" },
              { label: "Mid Bus (36 pax)", value: "Mid Bus (36 pax)" },
              { label: "Minivan (14 pax)", value: "Minivan (14 pax)" },
              { label: "EV Shuttle (24 pax)", value: "EV Shuttle (24 pax)" },
            ],
          },
        ]}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        keyExtractor={(v) => v.id}
        onRowClick={(v) => setViewVehicle(v)}
      />

      {/* Create / Edit Modal */}
      <Modal
        open={createModalOpen || !!editVehicle}
        onClose={() => {
          setCreateModalOpen(false);
          setEditVehicle(null);
        }}
        title={editVehicle ? `Edit Vehicle ${editVehicle.vehicleNumber}` : "Add New Fleet Vehicle"}
        description="Fill in the registration details and assign an active driver or route."
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCreateModalOpen(false);
                setEditVehicle(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={editVehicle ? handleEditSubmit : handleCreateSubmit}
            >
              {editVehicle ? "Save Changes" : "Create Vehicle"}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Vehicle Number"
              placeholder="e.g. BUS-104"
              value={formData.vehicleNumber}
              onChange={(e) =>
                setFormData({ ...formData, vehicleNumber: e.target.value })
              }
              required
            />
            <Input
              label="Registration Number"
              placeholder="e.g. IL-TR-8492"
              value={formData.registrationNumber}
              onChange={(e) =>
                setFormData({ ...formData, registrationNumber: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Vehicle Type"
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as Vehicle["type"],
                })
              }
              options={[
                { label: "Full Bus (72 pax)", value: "Full Bus (72 pax)" },
                { label: "Mid Bus (36 pax)", value: "Mid Bus (36 pax)" },
                { label: "Minivan (14 pax)", value: "Minivan (14 pax)" },
                { label: "EV Shuttle (24 pax)", value: "EV Shuttle (24 pax)" },
              ]}
            />
            <Input
              label="Capacity (Seats)"
              type="number"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: Number(e.target.value) })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Make & Model"
              placeholder="e.g. Blue Bird Vision Clean Diesel"
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
            />
            <Input
              label="Manufacturing Year"
              type="number"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: Number(e.target.value) })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Assigned Driver"
              value={formData.assignedDriverId}
              onChange={(e) =>
                setFormData({ ...formData, assignedDriverId: e.target.value })
              }
              options={[
                { label: "— None (Unassigned) —", value: "" },
                ...drivers.map((d) => ({
                  label: `${d.name} (${d.status.replace("_", " ")})`,
                  value: d.id,
                })),
              ]}
            />
            <Select
              label="Assigned Route"
              value={formData.assignedRouteId}
              onChange={(e) =>
                setFormData({ ...formData, assignedRouteId: e.target.value })
              }
              options={[
                { label: "— Standby / None —", value: "" },
                ...routes.map((r) => ({
                  label: `${r.routeNumber} · ${r.name}`,
                  value: r.id,
                })),
              ]}
            />
          </div>

          <Select
            label="Operational Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as Vehicle["status"],
              })
            }
            options={[
              { label: "Active", value: "active" },
              { label: "On Route", value: "on_route" },
              { label: "At Stop", value: "at_stop" },
              { label: "Delayed", value: "delayed" },
              { label: "Under Maintenance", value: "maintenance" },
              { label: "Inactive / Standby", value: "inactive" },
            ]}
          />
        </form>
      </Modal>

      {/* View Details Drawer */}
      <Drawer
        open={!!viewVehicle}
        onClose={() => setViewVehicle(null)}
        title={viewVehicle?.vehicleNumber || "Vehicle Overview"}
        subtitle={`Registration: ${viewVehicle?.registrationNumber}`}
        footer={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setViewVehicle(null)}
            >
              Close
            </Button>
            {viewVehicle && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const target = viewVehicle;
                  setViewVehicle(null);
                  handleOpenEdit(target);
                }}
              >
                Edit Vehicle
              </Button>
            )}
          </div>
        }
      >
        {viewVehicle && (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-2xl bg-ivory/60 p-4 border border-ink/8">
              <div>
                <p className="text-xs text-ink/50 uppercase tracking-wider font-semibold">
                  Current Status
                </p>
                <div className="mt-1">
                  <StatusBadge status={viewVehicle.status} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-ink/50 uppercase tracking-wider font-semibold">
                  Capacity
                </p>
                <p className="text-lg font-bold text-ink">
                  {viewVehicle.capacity} seats
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink/50">
                Specifications
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-ivory/40 p-3 border border-ink/6">
                  <span className="text-ink/50 block">Model</span>
                  <span className="font-semibold text-ink mt-0.5 block">
                    {viewVehicle.model}
                  </span>
                </div>
                <div className="rounded-xl bg-ivory/40 p-3 border border-ink/6">
                  <span className="text-ink/50 block">Year</span>
                  <span className="font-semibold text-ink mt-0.5 block">
                    {viewVehicle.year}
                  </span>
                </div>
                <div className="rounded-xl bg-ivory/40 p-3 border border-ink/6">
                  <span className="text-ink/50 block">Assigned Driver</span>
                  <span className="font-semibold text-ink mt-0.5 block">
                    {viewVehicle.assignedDriverName || "None"}
                  </span>
                </div>
                <div className="rounded-xl bg-ivory/40 p-3 border border-ink/6">
                  <span className="text-ink/50 block">Assigned Route</span>
                  <span className="font-semibold text-ink mt-0.5 block">
                    {viewVehicle.assignedRouteName || "Reserve Depot"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink/50">
                Live Location & Telemetry
              </h4>
              <div className="rounded-2xl bg-[#0c3136] p-4 text-ivory border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-ivory/60">Location beacon:</span>
                  <span className="font-semibold text-white">
                    {viewVehicle.currentLocation?.name || "Lincoln School District Depot"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ivory/60">Live speed:</span>
                  <span className="font-semibold text-aura">
                    {viewVehicle.speedMph || 0} MPH
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ivory/60">Students currently onboard:</span>
                  <span className="font-semibold text-sun">
                    {viewVehicle.studentsOnboard || 0} students
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ivory/60">Estimated arrival:</span>
                  <span className="font-semibold text-white">
                    {viewVehicle.eta || "Standby"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete Vehicle ${deleteTarget?.vehicleNumber}?`}
        message="This will unassign the vehicle from active routes and drivers. This action cannot be undone."
        confirmLabel="Delete Vehicle"
      />
    </div>
  );
}
