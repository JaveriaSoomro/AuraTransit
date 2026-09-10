"use client";

import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Phone,
  Mail,
  Award,
  Bus,
  GitFork,
  Building2,
} from "lucide-react";
import { useAuraStore } from "@/lib/store";
import { Aide } from "@/types/dashboard";
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

export default function SuperAdminAidesPage() {
  const {
    aides,
    routes,
    vehicles,
    schools,
    addAide,
    updateAide,
    deleteAide,
  } = useAuraStore();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [schoolFilter, setSchoolFilter] = useState("all");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editAide, setEditAide] = useState<Aide | null>(null);
  const [viewAide, setViewAide] = useState<Aide | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Aide | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    schoolId: "sch-1",
    assignedRouteId: "",
    assignedVehicleId: "",
    certification: "Pediatric First Aid & Student Safety Cert",
    status: "active" as Aide["status"],
  });

  const filteredData = useMemo(() => {
    return aides.filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.certification.toLowerCase().includes(search.toLowerCase()) ||
        a.phone.includes(search);
      const matchesStatus =
        statusFilter === "all" || a.status === statusFilter;
      const matchesSchool =
        schoolFilter === "all" || (a.schoolId || "sch-1") === schoolFilter;
      return matchesSearch && matchesStatus && matchesSchool;
    });
  }, [aides, search, statusFilter, schoolFilter]);

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      email: "",
      phone: "+1 (312) 555-02",
      schoolId: schools[0]?.id || "sch-1",
      assignedRouteId: "",
      assignedVehicleId: "",
      certification: "Pediatric CPR & Student Safety Certified (2028)",
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
      schoolId: a.schoolId || "sch-1",
      assignedRouteId: a.assignedRouteId || "",
      assignedVehicleId: a.assignedVehicleId || "",
      certification: a.certification,
      status: a.status,
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast("Please provide aide name and phone number.", "error");
      return;
    }

    const assignedRt = routes.find((r) => r.id === formData.assignedRouteId);
    const assignedVeh = vehicles.find((v) => v.id === formData.assignedVehicleId);
    const targetSchool = schools.find((s) => s.id === formData.schoolId);

    addAide({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      schoolId: formData.schoolId,
      schoolName: targetSchool?.name || "Lincoln International School",
      assignedRouteId: formData.assignedRouteId || undefined,
      assignedRouteName: assignedRt?.name,
      assignedVehicleId: formData.assignedVehicleId || undefined,
      assignedVehicleNumber: assignedVeh?.vehicleNumber,
      certification: formData.certification,
      status: formData.status,
    });

    setCreateModalOpen(false);
    showToast(`Aide ${formData.name} added to global roster.`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAide) return;

    const assignedRt = routes.find((r) => r.id === formData.assignedRouteId);
    const assignedVeh = vehicles.find((v) => v.id === formData.assignedVehicleId);
    const targetSchool = schools.find((s) => s.id === formData.schoolId);

    updateAide(editAide.id, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      schoolId: formData.schoolId,
      schoolName: targetSchool?.name,
      assignedRouteId: formData.assignedRouteId || undefined,
      assignedRouteName: assignedRt?.name,
      assignedVehicleId: formData.assignedVehicleId || undefined,
      assignedVehicleNumber: assignedVeh?.vehicleNumber,
      certification: formData.certification,
      status: formData.status,
    });

    setEditAide(null);
    showToast(`Updated aide profile for ${formData.name}.`);
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
      header: "Transit Aide",
      render: (a) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-aura/20 text-teal font-bold text-xs shrink-0">
            {a.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <p className="font-semibold text-ink">{a.name}</p>
            <p className="text-xs text-ink/50">{a.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "school",
      header: "Assigned Campus",
      render: (a) => {
        const sch = schools.find((s) => s.id === a.schoolId);
        return (
          <span className="text-xs text-ink font-medium">
            {sch?.name || a.schoolName || "Lincoln International School"}
          </span>
        );
      },
    },
    {
      key: "certification",
      header: "Certifications",
      render: (a) => (
        <span className="text-xs text-ink/75 truncate max-w-[220px] block">
          {a.certification}
        </span>
      ),
    },
    {
      key: "assignedRoute",
      header: "Route / Corridor",
      render: (a) => (
        <span className="text-xs font-semibold text-teal">
          {a.assignedRouteName || "Unassigned"}
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
            onClick={() => setViewAide(a)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink/60 hover:bg-ivory hover:text-teal transition"
            title="View Aide"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
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
        title="Global Transportation Aides"
        description="Monitor certified student monitors, special education aides, and health escorts across all affiliated campuses."
        actions={
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={handleOpenCreate}
          >
            Add Transit Aide
          </Button>
        }
      />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search aides across platform..."
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

      {/* Aide Details Drawer */}
      <Drawer
        open={!!viewAide}
        onClose={() => setViewAide(null)}
        title={viewAide?.name || "Aide Profile"}
        description="Student monitor and pediatric safety profile"
        width="md"
      >
        {viewAide && (
          <div className="space-y-6 text-sm text-ink">
            <div className="flex items-center gap-4 rounded-2xl bg-ivory/50 p-4 border border-ink/8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-aura/20 text-teal font-bold text-base">
                {viewAide.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <h4 className="font-bold text-base text-ink">{viewAide.name}</h4>
                <p className="text-xs text-ink/60">{viewAide.email}</p>
                <div className="mt-1">
                  <StatusBadge status={viewAide.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-ink/8 p-3">
                <span className="text-xs text-ink/50 block">Phone</span>
                <span className="font-medium text-xs">{viewAide.phone}</span>
              </div>
              <div className="rounded-2xl border border-ink/8 p-3">
                <span className="text-xs text-ink/50 block">Campus</span>
                <span className="font-medium text-xs">
                  {schools.find((s) => s.id === viewAide.schoolId)?.name ||
                    viewAide.schoolName ||
                    "Lincoln International School"}
                </span>
              </div>
              <div className="rounded-2xl border border-ink/8 p-3">
                <span className="text-xs text-ink/50 block">Corridor</span>
                <span className="font-medium text-xs text-teal">
                  {viewAide.assignedRouteName || "Unassigned"}
                </span>
              </div>
              <div className="rounded-2xl border border-ink/8 p-3">
                <span className="text-xs text-ink/50 block">Vehicle</span>
                <span className="font-medium text-xs">
                  {viewAide.assignedVehicleNumber || "Unassigned"}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-ink/8 bg-ivory/40 p-4 space-y-2">
              <h5 className="font-bold text-xs text-ink flex items-center gap-1.5">
                <Award className="h-4 w-4 text-teal" /> Verified Safety Certifications
              </h5>
              <p className="text-xs text-ink/75 leading-relaxed">
                {viewAide.certification}
              </p>
            </div>
          </div>
        )}
      </Drawer>

      {/* Create / Edit Modal */}
      <Modal
        open={createModalOpen || !!editAide}
        onClose={() => {
          setCreateModalOpen(false);
          setEditAide(null);
        }}
        title={editAide ? `Edit Aide — ${editAide.name}` : "Onboard Transit Aide"}
        description="Register qualified student monitors and special support aides."
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
            placeholder="e.g. Maria Gonzalez"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="m.gonzalez@school.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Contact Phone"
              placeholder="+1 (312) 555-0219"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
              label="Operational Status"
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Assigned Route"
              value={formData.assignedRouteId}
              onChange={(e) =>
                setFormData({ ...formData, assignedRouteId: e.target.value })
              }
              options={[
                { label: "None (Unassigned)", value: "" },
                ...routes.map((r) => ({
                  label: `${r.routeNumber} - ${r.name}`,
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
                { label: "None (Unassigned)", value: "" },
                ...vehicles.map((v) => ({
                  label: `${v.vehicleNumber} (${v.type})`,
                  value: v.id,
                })),
              ]}
            />
          </div>

          <Input
            label="Certifications"
            placeholder="CPR, AED, First Aid, Crisis Intervention..."
            value={formData.certification}
            onChange={(e) =>
              setFormData({ ...formData, certification: e.target.value })
            }
          />
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Remove Aide ${deleteTarget?.name}?`}
        message="This will remove the aide from their current route and active student duties."
        confirmLabel="Remove Aide"
      />
    </div>
  );
}
