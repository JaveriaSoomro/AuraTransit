"use client";

import React, { useState, useMemo } from "react";
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Shield,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { useAuraStore } from "@/lib/store";
import { School } from "@/types/dashboard";
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

export default function SuperAdminSchoolsPage() {
  const { schools, addSchool, updateSchool, deleteSchool } = useAuraStore();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editSchool, setEditSchool] = useState<School | null>(null);
  const [viewSchool, setViewSchool] = useState<School | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<School | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contactEmail: "",
    contactPhone: "",
    adminName: "",
    adminEmail: "",
    plan: "Growth" as School["plan"],
    status: "active" as School["status"],
    studentsCount: 150,
    vehiclesCount: 4,
    routesCount: 3,
    usersCount: 3,
  });

  const filteredData = useMemo(() => {
    return schools.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.address.toLowerCase().includes(search.toLowerCase()) ||
        s.adminName.toLowerCase().includes(search.toLowerCase());
      const matchesPlan = planFilter === "all" || s.plan === planFilter;
      const matchesStatus =
        statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [schools, search, planFilter, statusFilter]);

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      address: "",
      contactEmail: "ops@newschool.org",
      contactPhone: "+1 (555) 019-2810",
      adminName: "Dean Sarah Connor",
      adminEmail: "admin@newschool.org",
      plan: "Growth",
      status: "active",
      studentsCount: 150,
      vehiclesCount: 4,
      routesCount: 3,
      usersCount: 3,
    });
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (s: School) => {
    setEditSchool(s);
    setFormData({
      name: s.name,
      address: s.address,
      contactEmail: s.contactEmail,
      contactPhone: s.contactPhone,
      adminName: s.adminName,
      adminEmail: s.adminEmail,
      plan: s.plan,
      status: s.status,
      studentsCount: s.studentsCount,
      vehiclesCount: s.vehiclesCount,
      routesCount: s.routesCount,
      usersCount: s.usersCount,
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      showToast("Please provide school name and address.", "error");
      return;
    }

    addSchool(formData);
    setCreateModalOpen(false);
    showToast(`School ${formData.name} onboarded.`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSchool) return;

    updateSchool(editSchool.id, formData);
    setEditSchool(null);
    showToast(`Updated ${formData.name}.`);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteSchool(deleteTarget.id);
    showToast(`School ${deleteTarget.name} removed from platform.`);
    setDeleteTarget(null);
  };

  const columns: Column<School>[] = [
    {
      key: "name",
      header: "School",
      render: (s) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-teal text-white font-bold text-xs shrink-0">
            {s.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .substring(0, 2)}
          </div>
          <div>
            <p className="font-semibold text-ink">{s.name}</p>
            <p className="text-xs text-ink/50 truncate max-w-[200px]">
              {s.address}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "adminName",
      header: "Primary Admin",
      render: (s) => (
        <div>
          <p className="text-xs font-medium text-ink">{s.adminName}</p>
          <p className="text-[11px] text-ink/50">{s.adminEmail}</p>
        </div>
      ),
    },
    {
      key: "studentsCount",
      header: "Students",
      render: (s) => (
        <span className="text-xs font-bold text-ink">{s.studentsCount}</span>
      ),
    },
    {
      key: "vehiclesCount",
      header: "Fleet",
      render: (s) => (
        <span className="text-xs font-semibold text-teal">{s.vehiclesCount} buses</span>
      ),
    },
    {
      key: "routesCount",
      header: "Routes",
      render: (s) => (
        <span className="text-xs text-ink/75">{s.routesCount} routes</span>
      ),
    },
    {
      key: "plan",
      header: "Subscription Plan",
      render: (s) => (
        <span className="rounded-full bg-teal/10 px-2.5 py-0.5 text-xs font-semibold text-teal">
          {s.plan}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (s) => <StatusBadge status={s.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (s) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewSchool(s);
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
              handleOpenEdit(s);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink/60 hover:bg-ivory hover:text-teal transition"
            title="Edit School"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(s);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full text-red-600 hover:bg-red-50 transition"
            title="Delete School"
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
        title="Educational Institutions (Tenants)"
        description="Global directory of partner schools and academies deployed on the AuraTransit transportation platform."
        actions={
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={handleOpenCreate}
          >
            Onboard New School
          </Button>
        }
      />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search schools by name, address, or administrator..."
        totalResults={filteredData.length}
        onResetFilters={() => {
          setSearch("");
          setPlanFilter("all");
          setStatusFilter("all");
        }}
        filters={[
          {
            key: "plan",
            label: "Plan",
            value: planFilter,
            onChange: setPlanFilter,
            options: [
              { label: "All Plans", value: "all" },
              { label: "Enterprise", value: "Enterprise" },
              { label: "Growth", value: "Growth" },
              { label: "Starter", value: "Starter" },
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
              { label: "Trial", value: "trial" },
              { label: "Suspended", value: "suspended" },
            ],
          },
        ]}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        keyExtractor={(s) => s.id}
        onRowClick={(s) => setViewSchool(s)}
      />

      {/* Create / Edit Modal */}
      <Modal
        open={createModalOpen || !!editSchool}
        onClose={() => {
          setCreateModalOpen(false);
          setEditSchool(null);
        }}
        title={editSchool ? `Edit ${editSchool.name}` : "Onboard Educational Institution"}
        description="Configure tenant credentials and subscription limits."
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCreateModalOpen(false);
                setEditSchool(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={editSchool ? handleEditSubmit : handleCreateSubmit}
            >
              {editSchool ? "Save Changes" : "Onboard Institution"}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="School Name"
            placeholder="e.g. Oakwood Day Preparatory"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Campus Address"
            placeholder="45 Valley View Road, Austin, TX"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Primary Administrator Name"
              placeholder="Dean Arthur Vance"
              value={formData.adminName}
              onChange={(e) =>
                setFormData({ ...formData, adminName: e.target.value })
              }
              required
            />
            <Input
              label="Administrator Email"
              type="email"
              placeholder="a.vance@oakwoodprep.org"
              value={formData.adminEmail}
              onChange={(e) =>
                setFormData({ ...formData, adminEmail: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Subscription Tier"
              value={formData.plan}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  plan: e.target.value as School["plan"],
                })
              }
              options={[
                { label: "Enterprise Tier (Full Features)", value: "Enterprise" },
                { label: "Growth Tier", value: "Growth" },
                { label: "Starter Tier", value: "Starter" },
              ]}
            />
            <Select
              label="Account Status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as School["status"],
                })
              }
              options={[
                { label: "Active", value: "active" },
                { label: "Trial (14 Days)", value: "trial" },
                { label: "Suspended", value: "suspended" },
              ]}
            />
          </div>
        </form>
      </Modal>

      {/* Drawer */}
      <Drawer
        open={!!viewSchool}
        onClose={() => setViewSchool(null)}
        title={viewSchool?.name || "Institution Details"}
        subtitle={viewSchool?.address}
        footer={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setViewSchool(null)}
          >
            Close
          </Button>
        }
      >
        {viewSchool && (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-2xl bg-ivory/60 p-4 border border-ink/8">
              <div>
                <p className="text-xs text-ink/50 uppercase tracking-wider font-semibold">
                  Status
                </p>
                <div className="mt-1">
                  <StatusBadge status={viewSchool.status} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-ink/50 uppercase tracking-wider font-semibold">
                  Tier
                </p>
                <p className="text-base font-bold text-teal">{viewSchool.plan}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="rounded-xl bg-ivory/50 p-3 border border-ink/6">
                <span className="text-ink/50 block">Students</span>
                <span className="font-bold text-ink mt-0.5 block">
                  {viewSchool.studentsCount}
                </span>
              </div>
              <div className="rounded-xl bg-ivory/50 p-3 border border-ink/6">
                <span className="text-ink/50 block">Vehicles</span>
                <span className="font-bold text-teal mt-0.5 block">
                  {viewSchool.vehiclesCount}
                </span>
              </div>
              <div className="rounded-xl bg-ivory/50 p-3 border border-ink/6">
                <span className="text-ink/50 block">Routes</span>
                <span className="font-bold text-ink mt-0.5 block">
                  {viewSchool.routesCount}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-ink/8 bg-white p-4 space-y-2 text-xs">
              <span className="font-bold text-ink block">Primary Contact</span>
              <p className="text-ink/70">
                {viewSchool.adminName} ({viewSchool.adminEmail})
              </p>
              <p className="text-ink/70">{viewSchool.contactPhone}</p>
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Suspend & Remove ${deleteTarget?.name}?`}
        message="All associated fleet records, user access, and routes will be frozen. This action cannot be easily undone."
        confirmLabel="Remove School"
      />
    </div>
  );
}
