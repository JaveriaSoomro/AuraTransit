"use client";

import React, { useState, useMemo } from "react";
import {
  UserCheck,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Phone,
  Mail,
  Award,
  Bus,
  GitFork,
  Shield,
  Star,
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

export default function DriversPage() {
  const {
    drivers,
    vehicles,
    routes,
    addDriver,
    updateDriver,
    deleteDriver,
  } = useAuraStore();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
      return matchesSearch && matchesStatus;
    });
  }, [drivers, search, statusFilter]);

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      email: "",
      phone: "+1 (312) 555-01",
      licenseNumber: `CDL-IL-${Math.floor(100000 + Math.random() * 900000)}`,
      licenseExpiry: "2028-06-30",
      assignedVehicleId: "",
      assignedRouteId: "",
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
      status: d.status,
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.licenseNumber) {
      showToast("Please provide name, phone and CDL license number.", "error");
      return;
    }

    const assignedVehicle = vehicles.find(
      (v) => v.id === formData.assignedVehicleId,
    );
    const assignedRoute = routes.find((r) => r.id === formData.assignedRouteId);

    addDriver({
      ...formData,
      schoolId: "sch-1",
      assignedVehicleNumber: assignedVehicle?.vehicleNumber,
      assignedRouteName: assignedRoute?.name,
    });

    setCreateModalOpen(false);
    showToast(`Driver ${formData.name} added to roster.`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDriver) return;

    const assignedVehicle = vehicles.find(
      (v) => v.id === formData.assignedVehicleId,
    );
    const assignedRoute = routes.find((r) => r.id === formData.assignedRouteId);

    updateDriver(editDriver.id, {
      ...formData,
      assignedVehicleNumber: assignedVehicle?.vehicleNumber,
      assignedRouteName: assignedRoute?.name,
    });

    setEditDriver(null);
    showToast(`Driver ${formData.name} updated.`);
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
            {d.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <p className="font-semibold text-ink">{d.name}</p>
            <p className="text-xs text-ink/50">{d.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (d) => (
        <span className="font-mono text-xs text-ink/80">{d.phone}</span>
      ),
    },
    {
      key: "assignedVehicleNumber",
      header: "Assigned Vehicle",
      render: (d) => (
        <span className="text-xs font-semibold text-teal bg-teal/10 px-2.5 py-1 rounded-full">
          {d.assignedVehicleNumber || "Unassigned"}
        </span>
      ),
    },
    {
      key: "assignedRouteName",
      header: "Assigned Route",
      render: (d) => (
        <span className="text-xs text-ink/75 truncate max-w-[160px] block">
          {d.assignedRouteName || "Reserve Standby"}
        </span>
      ),
    },
    {
      key: "tripsCount",
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
            onClick={(e) => {
              e.stopPropagation();
              setViewDriver(d);
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
              handleOpenEdit(d);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink/60 hover:bg-ivory hover:text-teal transition"
            title="Edit Driver"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(d);
            }}
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
        title="Drivers"
        description="Monitor certified school bus drivers, verify commercial driver's licenses (CDL), track performance ratings, and manage route assignments."
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
        searchPlaceholder="Search drivers by name, phone, license, or vehicle..."
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
              { label: "All Driver Statuses", value: "all" },
              { label: "Active", value: "active" },
              { label: "On Trip", value: "on_trip" },
              { label: "Off Duty", value: "off_duty" },
            ],
          },
        ]}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        keyExtractor={(d) => d.id}
        onRowClick={(d) => setViewDriver(d)}
      />

      {/* Create / Edit Modal */}
      <Modal
        open={createModalOpen || !!editDriver}
        onClose={() => {
          setCreateModalOpen(false);
          setEditDriver(null);
        }}
        title={editDriver ? `Edit ${editDriver.name}` : "Register Certified Driver"}
        description="Verify license credentials and associate an assigned cab or regular run."
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
              {editDriver ? "Save Changes" : "Register Driver"}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="Driver Full Name"
            placeholder="e.g. Ahmed Khan"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="ahmed.khan@auratransit.net"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <Input
              label="Phone Number"
              placeholder="+1 (312) 555-0131"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="CDL License Number"
              placeholder="CDL-IL-849203"
              value={formData.licenseNumber}
              onChange={(e) =>
                setFormData({ ...formData, licenseNumber: e.target.value })
              }
              required
            />
            <Input
              label="License Expiry Date"
              type="date"
              value={formData.licenseExpiry}
              onChange={(e) =>
                setFormData({ ...formData, licenseExpiry: e.target.value })
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
                { label: "— Reserve / Unassigned —", value: "" },
                ...vehicles.map((v) => ({
                  label: `${v.vehicleNumber} (${v.model})`,
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
                { label: "— Float / Unassigned —", value: "" },
                ...routes.map((r) => ({
                  label: `${r.routeNumber} · ${r.name}`,
                  value: r.id,
                })),
              ]}
            />
          </div>

          <Select
            label="Current Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as Driver["status"],
              })
            }
            options={[
              { label: "Active (Available)", value: "active" },
              { label: "On Trip (Live)", value: "on_trip" },
              { label: "Off Duty", value: "off_duty" },
            ]}
          />
        </form>
      </Modal>

      {/* Driver Detail Drawer */}
      <Drawer
        open={!!viewDriver}
        onClose={() => setViewDriver(null)}
        title={viewDriver?.name || "Driver Profile"}
        subtitle={`License: ${viewDriver?.licenseNumber}`}
        footer={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setViewDriver(null)}
            >
              Close
            </Button>
            {viewDriver && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const target = viewDriver;
                  setViewDriver(null);
                  handleOpenEdit(target);
                }}
              >
                Edit Profile
              </Button>
            )}
          </div>
        }
      >
        {viewDriver && (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-2xl bg-ivory/60 p-4 border border-ink/8">
              <div>
                <p className="text-xs text-ink/50 uppercase tracking-wider font-semibold">
                  Driver Status
                </p>
                <div className="mt-1">
                  <StatusBadge status={viewDriver.status} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-ink/50 uppercase tracking-wider font-semibold">
                  Performance
                </p>
                <div className="flex items-center justify-end gap-1 font-bold text-base text-ink mt-0.5">
                  <Star className="h-4 w-4 fill-sun text-sun" />
                  <span>{viewDriver.rating} / 5.0</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink/50">
                Credentials & Contact
              </h4>
              <div className="rounded-2xl border border-ink/8 bg-white p-4 space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-teal" />
                  <span className="font-semibold text-ink">{viewDriver.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-teal" />
                  <span className="font-semibold text-ink">{viewDriver.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-teal" />
                  <span>
                    CDL Expiry:{" "}
                    <strong className="text-ink">{viewDriver.licenseExpiry}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink/50">
                Assignments & History
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-ivory/50 p-3 border border-ink/6">
                  <span className="text-ink/50 block">Assigned Cab</span>
                  <span className="font-bold text-teal mt-0.5 block">
                    {viewDriver.assignedVehicleNumber || "Unassigned"}
                  </span>
                </div>
                <div className="rounded-xl bg-ivory/50 p-3 border border-ink/6">
                  <span className="text-ink/50 block">Completed Trips</span>
                  <span className="font-bold text-ink mt-0.5 block">
                    {viewDriver.tripsCount} runs
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-ivory/50 p-3 border border-ink/6 text-xs">
                <span className="text-ink/50 block">Primary Route</span>
                <span className="font-bold text-ink mt-0.5 block">
                  {viewDriver.assignedRouteName || "Reserve Float"}
                </span>
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
        title={`Remove ${deleteTarget?.name}?`}
        message="This driver will be unassigned from their vehicle and route. This action cannot be undone."
        confirmLabel="Remove Driver"
      />
    </div>
  );
}
