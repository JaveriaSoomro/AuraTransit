"use client";

import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Award,
} from "lucide-react";
import { useAuraStore } from "@/lib/store";
import { Aide } from "@/types/dashboard";
import { PageHeader } from "@/components/layout/page-header";
import { FilterBar } from "@/components/layout/filter-bar";
import { DataTable, Column } from "@/components/layout/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input, Select } from "@/components/ui/form-field";
import { useToast } from "@/components/ui/toast";

export default function AidesPage() {
  const { aides, routes, vehicles, addAide, updateAide, deleteAide } =
    useAuraStore();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editAide, setEditAide] = useState<Aide | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Aide | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    assignedRouteId: "",
    assignedVehicleId: "",
    certification: "Pediatric First Aid & Student Safety Cert",
    status: "active" as Aide["status"],
  });

  const filteredData = useMemo(() => {
    return aides.filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.phone.includes(search) ||
        (a.assignedRouteName &&
          a.assignedRouteName.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus =
        statusFilter === "all" || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [aides, search, statusFilter]);

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      email: "",
      phone: "+1 (312) 555-02",
      assignedRouteId: "",
      assignedVehicleId: "",
      certification: "Pediatric First Aid & Student Safety Cert (Exp 2028)",
      status: "active",
    });
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (a: Aide) => {
    setEditAide(a);
    setFormData({
      name: a.name,
      email: a.email,
      phone: a.phone,
      assignedRouteId: a.assignedRouteId || "",
      assignedVehicleId: a.assignedVehicleId || "",
      certification: a.certification,
      status: a.status,
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast("Please provide aide name and contact phone.", "error");
      return;
    }

    const assignedRoute = routes.find((r) => r.id === formData.assignedRouteId);
    const assignedVehicle = vehicles.find(
      (v) => v.id === formData.assignedVehicleId,
    );

    addAide({
      ...formData,
      schoolId: "sch-1",
      assignedRouteName: assignedRoute?.name,
      assignedVehicleNumber: assignedVehicle?.vehicleNumber,
    });

    setCreateModalOpen(false);
    showToast(`Aide ${formData.name} added.`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAide) return;

    const assignedRoute = routes.find((r) => r.id === formData.assignedRouteId);
    const assignedVehicle = vehicles.find(
      (v) => v.id === formData.assignedVehicleId,
    );

    updateAide(editAide.id, {
      ...formData,
      assignedRouteName: assignedRoute?.name,
      assignedVehicleNumber: assignedVehicle?.vehicleNumber,
    });

    setEditAide(null);
    showToast(`Updated aide ${formData.name}.`);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteAide(deleteTarget.id);
    showToast(`Aide ${deleteTarget.name} removed from roster.`);
    setDeleteTarget(null);
  };

  const columns: Column<Aide>[] = [
    {
      key: "name",
      header: "Aide",
      render: (a) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-aura/20 text-teal font-bold text-xs shrink-0">
            {a.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <p className="font-semibold text-ink">{a.name}</p>
            <p className="text-xs text-ink/50">{a.certification}</p>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (a) => (
        <div className="text-xs">
          <p className="font-mono text-ink/80">{a.phone}</p>
          <p className="text-ink/45">{a.email}</p>
        </div>
      ),
    },
    {
      key: "assignedRouteName",
      header: "Assigned Route",
      render: (a) => (
        <span className="text-xs font-medium text-ink">
          {a.assignedRouteName || (
            <span className="text-ink/40 italic">Float / None</span>
          )}
        </span>
      ),
    },
    {
      key: "assignedVehicleNumber",
      header: "Assigned Vehicle",
      render: (a) => (
        <span className="text-xs text-teal font-semibold">
          {a.assignedVehicleNumber || "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (a) => <StatusBadge status={a.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (a) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => handleOpenEdit(a)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink/60 hover:bg-ivory hover:text-teal transition"
            title="Edit Aide"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(a)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-red-600 hover:bg-red-50 transition"
            title="Delete Aide"
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
        title="Transportation Aides"
        description="Manage certified student safety monitors, pediatric first-aid aides, and route copilots."
        actions={
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={handleOpenCreate}
          >
            Add Aide
          </Button>
        }
      />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search aides by name or assigned route..."
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
              { label: "Active", value: "active" },
              { label: "On Duty", value: "on_duty" },
              { label: "Off Duty", value: "off_duty" },
            ],
          },
        ]}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        keyExtractor={(a) => a.id}
      />

      {/* Create / Edit Modal */}
      <Modal
        open={createModalOpen || !!editAide}
        onClose={() => {
          setCreateModalOpen(false);
          setEditAide(null);
        }}
        title={editAide ? `Edit ${editAide.name}` : "Assign Safety Aide"}
        description="Enter aide credentials and associate with an active route run."
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCreateModalOpen(false);
                setEditAide(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={editAide ? handleEditSubmit : handleCreateSubmit}
            >
              {editAide ? "Save Changes" : "Register Aide"}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Maria Santos"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="m.santos@lincoln.edu"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <Input
              label="Phone Number"
              placeholder="+1 (312) 555-0211"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Assigned Route"
              value={formData.assignedRouteId}
              onChange={(e) =>
                setFormData({ ...formData, assignedRouteId: e.target.value })
              }
              options={[
                { label: "— Unassigned / Float —", value: "" },
                ...routes.map((r) => ({
                  label: `${r.routeNumber} · ${r.name}`,
                  value: r.id,
                })),
              ]}
            />
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
          </div>

          <Input
            label="Certification Details"
            value={formData.certification}
            onChange={(e) =>
              setFormData({ ...formData, certification: e.target.value })
            }
          />

          <Select
            label="Duty Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as Aide["status"],
              })
            }
            options={[
              { label: "Active", value: "active" },
              { label: "On Duty", value: "on_duty" },
              { label: "Off Duty", value: "off_duty" },
            ]}
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Remove ${deleteTarget?.name}?`}
        message="This will unassign the safety aide from active routes."
        confirmLabel="Remove Aide"
      />
    </div>
  );
}
