"use client";

import React, { useState, useMemo } from "react";
import {
  UserCheck,
  Star,
  Eye,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Award,
  Bus,
  GitFork,
  Shield,
  Building2,
} from "lucide-react";
import { useAuraStore } from "@/lib/store";
import { Driver } from "@/types/dashboard";
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

export default function SuperAdminDriversPage() {
  const {
    drivers,
    vehicles,
    routes,
    schools,
    addDriver,
    updateDriver,
    deleteDriver,
  } = useAuraStore();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [schoolFilter, setSchoolFilter] = useState("all");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editDriver, setEditDriver] = useState<Driver | null>(null);
  const [viewDriver, setViewDriver] = useState<Driver | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Driver | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
    licenseExpiry: "2028-06-30",
    assignedVehicleId: "",
    assignedRouteId: "",
    schoolId: "sch-1",
    status: "active" as Driver["status"],
  });

  const filteredData = useMemo(() => {
    return drivers.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.phone.includes(search) ||
        d.licenseNumber.toLowerCase().includes(search.toLowerCase()) ||
        (d.assignedVehicleNumber &&
          d.assignedVehicleNumber.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus =
        statusFilter === "all" || d.status === statusFilter;
      const matchesSchool =
        schoolFilter === "all" || (d.schoolId || "sch-1") === schoolFilter;
      return matchesSearch && matchesStatus && matchesSchool;
    });
  }, [drivers, search, statusFilter, schoolFilter]);

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      email: "",
      phone: "+1 (312) 555-01",
      licenseNumber: `CDL-IL-${Math.floor(100000 + Math.random() * 900000)}`,
      licenseExpiry: "2028-06-30",
      assignedVehicleId: "",
      assignedRouteId: "",
      schoolId: schools[0]?.id || "sch-1",
      status: "active",
    });
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (d: Driver) => {
    setEditDriver(d);
    setFormData({
      name: d.name,
      email: d.email,
      phone: d.phone,
      licenseNumber: d.licenseNumber,
      licenseExpiry: d.licenseExpiry,
      assignedVehicleId: d.assignedVehicleId || "",
      assignedRouteId: d.assignedRouteId || "",
      schoolId: d.schoolId || "sch-1",
      status: d.status,
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast("Please provide driver name and contact phone.", "error");
      return;
    }

    const assignedVeh = vehicles.find((v) => v.id === formData.assignedVehicleId);
    const assignedRt = routes.find((r) => r.id === formData.assignedRouteId);
    const targetSchool = schools.find((s) => s.id === formData.schoolId);

    addDriver({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      licenseNumber: formData.licenseNumber,
      licenseExpiry: formData.licenseExpiry,
      assignedVehicleId: formData.assignedVehicleId || undefined,
      assignedVehicleNumber: assignedVeh?.vehicleNumber,
      assignedRouteId: formData.assignedRouteId || undefined,
      assignedRouteName: assignedRt?.name,
      schoolId: formData.schoolId,
      schoolName: targetSchool?.name || "Lincoln International School",
      status: formData.status,
      backgroundCheck: "passed",
      medicalClearance: "valid",
    });

    setCreateModalOpen(false);
    showToast(`Driver ${formData.name} added to global registry.`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDriver) return;

    const assignedVeh = vehicles.find((v) => v.id === formData.assignedVehicleId);
    const assignedRt = routes.find((r) => r.id === formData.assignedRouteId);
    const targetSchool = schools.find((s) => s.id === formData.schoolId);

    updateDriver(editDriver.id, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      licenseNumber: formData.licenseNumber,
      licenseExpiry: formData.licenseExpiry,
      assignedVehicleId: formData.assignedVehicleId || undefined,
      assignedVehicleNumber: assignedVeh?.vehicleNumber,
      assignedRouteId: formData.assignedRouteId || undefined,
      assignedRouteName: assignedRt?.name,
      schoolId: formData.schoolId,
      schoolName: targetSchool?.name,
      status: formData.status,
    });

    setEditDriver(null);
    showToast(`Updated profile for ${formData.name}.`);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteDriver(deleteTarget.id);
    showToast(`Driver ${deleteTarget.name} removed from roster.`);
    setDeleteTarget(null);
  };

  const columns: Column<Driver>[] = [
    {
      key: "name",
      header: "Driver",
      render: (d) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sun text-ink font-bold text-xs shrink-0">
            {d.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <p className="font-semibold text-ink">{d.name}</p>
            <p className="text-xs text-ink/50">{d.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "school",
      header: "Assigned Campus",
      render: (d) => {
        const sch = schools.find((s) => s.id === d.schoolId);
        return (
          <span className="text-xs text-ink font-medium">
            {sch?.name || d.schoolName || "Lincoln International School"}
          </span>
        );
      },
    },
    {
      key: "license",
      header: "License / CDL",
      render: (d) => (
        <span className="font-mono text-xs text-ink/75 bg-ivory px-2 py-0.5 rounded border border-ink/8">
          {d.licenseNumber}
        </span>
      ),
    },
    {
      key: "trips",
      header: "Trips",
      render: (d) => (
        <span className="text-xs font-bold text-ink">{d.tripsCount}</span>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      render: (d) => (
        <div className="flex items-center gap-1 text-xs font-bold text-ink">
          <Star className="h-3 w-3 fill-sun text-sun" />
          <span>{d.rating}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (d) => <StatusBadge status={d.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (d) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => setViewDriver(d)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink/60 hover:bg-ivory hover:text-teal transition"
            title="View Profile"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleOpenEdit(d)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink/60 hover:bg-ivory hover:text-teal transition"
            title="Edit Driver"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(d)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-red-600 hover:bg-red-50 transition"
            title="Delete Driver"
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
        title="Global Driver Roster"
        description="Platform-wide monitoring, onboarding, and compliance management of certified school bus drivers across all partner districts."
        actions={
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={handleOpenCreate}
          >
            Add Driver
          </Button>
        }
      />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search all drivers across network..."
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
              { label: "Active", value: "active" },
              { label: "On Trip", value: "on_trip" },
              { label: "Off Duty", value: "off_duty" },
              { label: "Suspended", value: "suspended" },
            ],
          },
        ]}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        keyExtractor={(d) => d.id}
      />

      {/* Driver View Drawer */}
      <Drawer
        open={!!viewDriver}
        onClose={() => setViewDriver(null)}
        title={viewDriver?.name || "Driver Details"}
        description={`License: ${viewDriver?.licenseNumber} · Global Staff Registry`}
        width="lg"
      >
        {viewDriver && (
          <div className="space-y-6 text-sm text-ink">
            <div className="flex items-center gap-4 rounded-2xl bg-ivory/50 p-4 border border-ink/8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sun text-ink font-bold text-base">
                {viewDriver.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <h4 className="font-bold text-base text-ink">{viewDriver.name}</h4>
                <p className="text-xs text-ink/60">{viewDriver.email}</p>
                <div className="mt-1 flex items-center gap-2">
                  <StatusBadge status={viewDriver.status} />
                  <span className="flex items-center gap-1 text-xs font-bold">
                    <Star className="h-3 w-3 fill-sun text-sun" />
                    {viewDriver.rating} ({viewDriver.tripsCount} runs)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-ink/8 p-3">
                <span className="text-xs text-ink/50 block">Phone</span>
                <span className="font-medium text-xs">{viewDriver.phone}</span>
              </div>
              <div className="rounded-2xl border border-ink/8 p-3">
                <span className="text-xs text-ink/50 block">Assigned Campus</span>
                <span className="font-medium text-xs">
                  {schools.find((s) => s.id === viewDriver.schoolId)?.name ||
                    viewDriver.schoolName ||
                    "Lincoln International School"}
                </span>
              </div>
              <div className="rounded-2xl border border-ink/8 p-3">
                <span className="text-xs text-ink/50 block">Vehicle</span>
                <span className="font-medium text-xs">
                  {viewDriver.assignedVehicleNumber || "Unassigned"}
                </span>
              </div>
              <div className="rounded-2xl border border-ink/8 p-3">
                <span className="text-xs text-ink/50 block">Assigned Corridor</span>
                <span className="font-medium text-xs">
                  {viewDriver.assignedRouteName || "Standby / Flex"}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-ink/8 bg-ivory/40 p-4 space-y-2">
              <h5 className="font-bold text-xs text-ink flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-teal" /> Verification & Certifications
              </h5>
              <div className="flex items-center justify-between text-xs py-1 border-b border-ink/8">
                <span className="text-ink/65">FBI / State Background Screening</span>
                <span className="font-semibold text-aura uppercase">
                  {viewDriver.backgroundCheck || "Passed"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-ink/65">DOT Medical Card</span>
                <span className="font-semibold text-aura uppercase">
                  {viewDriver.medicalClearance || "Valid"}
                </span>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Create / Edit Modal */}
      <Modal
        open={createModalOpen || !!editDriver}
        onClose={() => {
          setCreateModalOpen(false);
          setEditDriver(null);
        }}
        title={editDriver ? `Edit Driver — ${editDriver.name}` : "Onboard Certified Driver"}
        description="Register or modify credentialed drivers across participating school fleets."
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCreateModalOpen(false);
                setEditDriver(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={editDriver ? handleEditSubmit : handleCreateSubmit}
            >
              {editDriver ? "Save Changes" : "Create Driver"}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. David Miller"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="d.miller@transports.org"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Phone Number"
              placeholder="+1 (312) 555-0192"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Assigned Campus"
              value={formData.schoolId}
              onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
              options={schools.map((s) => ({ label: s.name, value: s.id }))}
            />
            <Input
              label="Commercial Driver License"
              value={formData.licenseNumber}
              onChange={(e) =>
                setFormData({ ...formData, licenseNumber: e.target.value })
              }
              required
            />
          </div>

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
              label="Assigned Route"
              value={formData.assignedRouteId}
              onChange={(e) =>
                setFormData({ ...formData, assignedRouteId: e.target.value })
              }
              options={[
                { label: "None (Standby)", value: "" },
                ...routes.map((r) => ({
                  label: `${r.routeNumber} - ${r.name}`,
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
                status: e.target.value as Driver["status"],
              })
            }
            options={[
              { label: "Active", value: "active" },
              { label: "On Trip", value: "on_trip" },
              { label: "Off Duty", value: "off_duty" },
              { label: "Suspended", value: "suspended" },
            ]}
          />
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Remove Driver ${deleteTarget?.name}?`}
        message="This driver will be permanently unlinked from all routes and fleet telemetry."
        confirmLabel="Remove Driver"
      />
    </div>
  );
}
