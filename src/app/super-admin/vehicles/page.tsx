"use client";

import React, { useState, useMemo } from "react";
import {
  Bus,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Fuel,
  BatteryCharging,
  Gauge,
  Calendar,
  AlertCircle,
  Building2,
  Layers,
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

export default function SuperAdminVehiclesPage() {
  const {
    vehicles,
    drivers,
    routes,
    schools,
    addVehicle,
    updateVehicle,
    deleteVehicle,
  } = useAuraStore();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [schoolFilter, setSchoolFilter] = useState("all");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [viewVehicle, setViewVehicle] = useState<Vehicle | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);

  const [formData, setFormData] = useState({
    vehicleNumber: "",
    registrationNumber: "",
    type: "Full Bus (72 pax)" as Vehicle["type"],
    capacity: 72,
    model: "Blue Bird All American",
    year: 2024,
    schoolId: "sch-1",
    assignedDriverId: "",
    assignedRouteId: "",
    status: "active" as Vehicle["status"],
  });

  const filteredData = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch =
        v.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
        v.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
        v.model.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || v.status === statusFilter;
      const matchesType = typeFilter === "all" || v.type === typeFilter;
      const matchesSchool =
        schoolFilter === "all" || (v.schoolId || "sch-1") === schoolFilter;
      return matchesSearch && matchesStatus && matchesType && matchesSchool;
    });
  }, [vehicles, search, statusFilter, typeFilter, schoolFilter]);

  const handleOpenCreate = () => {
    const nextNum = Math.floor(100 + Math.random() * 900);
    setFormData({
      vehicleNumber: `BUS-${nextNum}`,
      registrationNumber: `IL-SCH-${nextNum * 12}`,
      type: "Full Bus (72 pax)",
      capacity: 72,
      model: "Blue Bird Vision Clean Diesel",
      year: 2024,
      schoolId: schools[0]?.id || "sch-1",
      assignedDriverId: "",
      assignedRouteId: "",
      status: "active",
    });
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (v: Vehicle) => {
    setEditVehicle(v);
    setFormData({
      vehicleNumber: v.vehicleNumber,
      registrationNumber: v.registrationNumber,
      type: v.type,
      capacity: v.capacity,
      model: v.model,
      year: v.year,
      schoolId: v.schoolId || "sch-1",
      assignedDriverId: v.assignedDriverId || "",
      assignedRouteId: v.assignedRouteId || "",
      status: v.status,
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicleNumber || !formData.registrationNumber) {
      showToast("Please provide vehicle identifier & registration.", "error");
      return;
    }

    const assignedDrv = drivers.find((d) => d.id === formData.assignedDriverId);
    const assignedRt = routes.find((r) => r.id === formData.assignedRouteId);
    const targetSchool = schools.find((s) => s.id === formData.schoolId);

    addVehicle({
      vehicleNumber: formData.vehicleNumber,
      registrationNumber: formData.registrationNumber,
      type: formData.type,
      capacity: Number(formData.capacity) || 72,
      model: formData.model,
      year: Number(formData.year) || 2024,
      schoolId: formData.schoolId,
      schoolName: targetSchool?.name || "Lincoln International School",
      assignedDriverId: formData.assignedDriverId || undefined,
      assignedDriverName: assignedDrv?.name,
      assignedRouteId: formData.assignedRouteId || undefined,
      assignedRouteName: assignedRt?.name,
      status: formData.status,
      mileage: 1200,
      fuelLevel: 94,
      lastInspectionDate: new Date().toISOString().split("T")[0],
      currentLat: 41.8781,
      currentLng: -87.6298,
      speed: 0,
    });

    setCreateModalOpen(false);
    showToast(`Vehicle ${formData.vehicleNumber} registered in global fleet.`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editVehicle) return;

    const assignedDrv = drivers.find((d) => d.id === formData.assignedDriverId);
    const assignedRt = routes.find((r) => r.id === formData.assignedRouteId);
    const targetSchool = schools.find((s) => s.id === formData.schoolId);

    updateVehicle(editVehicle.id, {
      vehicleNumber: formData.vehicleNumber,
      registrationNumber: formData.registrationNumber,
      type: formData.type,
      capacity: Number(formData.capacity),
      model: formData.model,
      year: Number(formData.year),
      schoolId: formData.schoolId,
      schoolName: targetSchool?.name,
      assignedDriverId: formData.assignedDriverId || undefined,
      assignedDriverName: assignedDrv?.name,
      assignedRouteId: formData.assignedRouteId || undefined,
      assignedRouteName: assignedRt?.name,
      status: formData.status,
    });

    setEditVehicle(null);
    showToast(`Updated details for ${formData.vehicleNumber}.`);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteVehicle(deleteTarget.id);
    showToast(`Vehicle ${deleteTarget.vehicleNumber} decommissioned.`);
    setDeleteTarget(null);
  };

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
      key: "school",
      header: "Campus Fleet",
      render: (v) => {
        const sch = schools.find((s) => s.id === v.schoolId);
        return (
          <span className="text-xs text-ink font-medium">
            {sch?.name || v.schoolName || "Lincoln International School"}
          </span>
        );
      },
    },
    {
      key: "type",
      header: "Class",
      render: (v) => (
        <span className="text-xs text-ink/80 bg-ivory px-2 py-0.5 rounded border border-ink/8">
          {v.type}
        </span>
      ),
    },
    {
      key: "capacity",
      header: "Capacity",
      render: (v) => (
        <span className="text-xs font-semibold text-ink">{v.capacity} seats</span>
      ),
    },
    {
      key: "driver",
      header: "Assigned Driver",
      render: (v) => (
        <span className="text-xs text-ink">{v.assignedDriverName || "Unassigned"}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (v) => <StatusBadge status={v.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (v) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => setViewVehicle(v)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink/60 hover:bg-ivory hover:text-teal transition"
            title="Telemetry Details"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleOpenEdit(v)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink/60 hover:bg-ivory hover:text-teal transition"
            title="Edit Vehicle"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(v)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-red-600 hover:bg-red-50 transition"
            title="Decommission Vehicle"
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
        title="Global Fleet Registry"
        description="Unified vehicle inventory, telemetry status, and allocation management across all participating school systems."
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

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search all vehicles across network..."
        totalResults={filteredData.length}
        onResetFilters={() => {
          setSearch("");
          setStatusFilter("all");
          setTypeFilter("all");
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
              { label: "Active", value: "active" },
              { label: "On Route", value: "on_route" },
              { label: "At Stop", value: "at_stop" },
              { label: "Delayed", value: "delayed" },
              { label: "Maintenance", value: "maintenance" },
            ],
          },
          {
            key: "type",
            label: "Vehicle Class",
            value: typeFilter,
            onChange: setTypeFilter,
            options: [
              { label: "All Classes", value: "all" },
              { label: "Full Bus (72 pax)", value: "Full Bus (72 pax)" },
              { label: "Minibus (30 pax)", value: "Minibus (30 pax)" },
              { label: "Van (14 pax)", value: "Van (14 pax)" },
              { label: "Electric Bus (60 pax)", value: "Electric Bus (60 pax)" },
            ],
          },
        ]}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        keyExtractor={(v) => v.id}
      />

      {/* Vehicle Telemetry Drawer */}
      <Drawer
        open={!!viewVehicle}
        onClose={() => setViewVehicle(null)}
        title={viewVehicle?.vehicleNumber || "Vehicle Specs"}
        description={`VIN / Registration: ${viewVehicle?.registrationNumber}`}
        width="lg"
      >
        {viewVehicle && (
          <div className="space-y-6 text-sm text-ink">
            <div className="flex items-center gap-4 rounded-2xl bg-ivory/50 p-4 border border-ink/8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal text-white">
                <Bus className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-ink">
                  {viewVehicle.vehicleNumber} · {viewVehicle.model}
                </h4>
                <p className="text-xs text-ink/60">
                  Year {viewVehicle.year} · {viewVehicle.type} ({viewVehicle.capacity} passengers)
                </p>
                <div className="mt-1">
                  <StatusBadge status={viewVehicle.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-ink/8 p-3">
                <span className="text-xs text-ink/50 block">Campus</span>
                <span className="font-medium text-xs">
                  {schools.find((s) => s.id === viewVehicle.schoolId)?.name ||
                    viewVehicle.schoolName ||
                    "Lincoln International School"}
                </span>
              </div>
              <div className="rounded-2xl border border-ink/8 p-3">
                <span className="text-xs text-ink/50 block">Assigned Driver</span>
                <span className="font-medium text-xs">
                  {viewVehicle.assignedDriverName || "Unassigned"}
                </span>
              </div>
              <div className="rounded-2xl border border-ink/8 p-3">
                <span className="text-xs text-ink/50 block">Active Corridor</span>
                <span className="font-medium text-xs">
                  {viewVehicle.assignedRouteName || "Unscheduled"}
                </span>
              </div>
              <div className="rounded-2xl border border-ink/8 p-3">
                <span className="text-xs text-ink/50 block">Total Odometer</span>
                <span className="font-medium text-xs font-mono">
                  {viewVehicle.mileage?.toLocaleString() || "1,200"} mi
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-ink/8 bg-ivory/40 p-4 space-y-3">
              <h5 className="font-bold text-xs text-ink flex items-center gap-1.5">
                <Gauge className="h-4 w-4 text-teal" /> Live Telemetry
              </h5>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-ink/60 block">Fuel / Battery</span>
                  <span className="font-bold text-teal">{viewVehicle.fuelLevel ?? 92}% Level</span>
                </div>
                <div>
                  <span className="text-ink/60 block">Current Velocity</span>
                  <span className="font-bold text-ink">{viewVehicle.speed ?? 0} mph</span>
                </div>
                <div>
                  <span className="text-ink/60 block">Last Safety Inspection</span>
                  <span className="font-medium text-ink/80">{viewVehicle.lastInspectionDate || "Recent (2026)"}</span>
                </div>
                <div>
                  <span className="text-ink/60 block">GPS Fix</span>
                  <span className="font-mono text-[11px] text-ink/75">
                    {viewVehicle.currentLat ? `${viewVehicle.currentLat.toFixed(4)}, ${viewVehicle.currentLng?.toFixed(4)}` : "41.8781, -87.6298"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Create / Edit Modal */}
      <Modal
        open={createModalOpen || !!editVehicle}
        onClose={() => {
          setCreateModalOpen(false);
          setEditVehicle(null);
        }}
        title={editVehicle ? `Edit ${editVehicle.vehicleNumber}` : "Commission Fleet Vehicle"}
        description="Add a new bus, transit van, or EV to the unified school transportation network."
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
              {editVehicle ? "Save Changes" : "Commission Vehicle"}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Vehicle Identifier"
              placeholder="e.g. BUS-115"
              value={formData.vehicleNumber}
              onChange={(e) =>
                setFormData({ ...formData, vehicleNumber: e.target.value })
              }
              required
            />
            <Input
              label="Registration / VIN"
              placeholder="e.g. IL-SCH-8492"
              value={formData.registrationNumber}
              onChange={(e) =>
                setFormData({ ...formData, registrationNumber: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Campus Assignment"
              value={formData.schoolId}
              onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
              options={schools.map((s) => ({ label: s.name, value: s.id }))}
            />
            <Select
              label="Vehicle Class"
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as Vehicle["type"],
                })
              }
              options={[
                { label: "Full Bus (72 pax)", value: "Full Bus (72 pax)" },
                { label: "Minibus (30 pax)", value: "Minibus (30 pax)" },
                { label: "Van (14 pax)", value: "Van (14 pax)" },
                { label: "Electric Bus (60 pax)", value: "Electric Bus (60 pax)" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Make & Model"
              placeholder="Blue Bird Vision"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            />
            <Input
              label="Capacity"
              type="number"
              value={formData.capacity.toString()}
              onChange={(e) =>
                setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })
              }
            />
            <Input
              label="Model Year"
              type="number"
              value={formData.year.toString()}
              onChange={(e) =>
                setFormData({ ...formData, year: parseInt(e.target.value) || 2024 })
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
                { label: "None (Unassigned)", value: "" },
                ...drivers.map((d) => ({ label: d.name, value: d.id })),
              ]}
            />
            <Select
              label="Assigned Route"
              value={formData.assignedRouteId}
              onChange={(e) =>
                setFormData({ ...formData, assignedRouteId: e.target.value })
              }
              options={[
                { label: "None (Unscheduled)", value: "" },
                ...routes.map((r) => ({
                  label: `${r.routeNumber} - ${r.name}`,
                  value: r.id,
                })),
              ]}
            />
          </div>

          <Select
            label="Initial Status"
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
              { label: "Maintenance", value: "maintenance" },
            ]}
          />
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Decommission Vehicle ${deleteTarget?.vehicleNumber}?`}
        message="This vehicle will be decommissioned and taken off all active school transit runs."
        confirmLabel="Decommission Vehicle"
      />
    </div>
  );
}
