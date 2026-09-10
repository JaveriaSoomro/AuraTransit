"use client";

import React, { useState, useMemo } from "react";
import {
  HeartHandshake,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Phone,
  Mail,
  MapPin,
  Bell,
  GraduationCap,
  Building2,
} from "lucide-react";
import { useAuraStore } from "@/lib/store";
import { Parent } from "@/types/dashboard";
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

export default function SuperAdminParentsPage() {
  const {
    parents,
    students,
    schools,
    addParent,
    updateParent,
    deleteParent,
  } = useAuraStore();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [schoolFilter, setSchoolFilter] = useState("all");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editParent, setEditParent] = useState<Parent | null>(null);
  const [viewParent, setViewParent] = useState<Parent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Parent | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    schoolId: "sch-1",
    pickupAddress: "",
    notificationStatus: "sms_and_app" as Parent["notificationStatus"],
    status: "active" as Parent["status"],
  });

  const filteredData = useMemo(() => {
    return parents.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase()) ||
        p.phone.includes(search) ||
        p.studentNames.some((s) => s.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus =
        statusFilter === "all" || p.status === statusFilter;
      const matchesSchool =
        schoolFilter === "all" || (p.schoolId || "sch-1") === schoolFilter;
      return matchesSearch && matchesStatus && matchesSchool;
    });
  }, [parents, search, statusFilter, schoolFilter]);

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      email: "",
      phone: "+1 (312) 555-03",
      schoolId: schools[0]?.id || "sch-1",
      pickupAddress: "450 Michigan Ave, Chicago, IL",
      notificationStatus: "sms_and_app",
      status: "active",
    });
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (p: Parent) => {
    setEditParent(p);
    setFormData({
      name: p.name,
      email: p.email,
      phone: p.phone,
      schoolId: p.schoolId || "sch-1",
      pickupAddress: p.pickupAddress || "",
      notificationStatus: p.notificationStatus,
      status: p.status,
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showToast("Please provide guardian name and email.", "error");
      return;
    }

    const targetSchool = schools.find((s) => s.id === formData.schoolId);

    addParent({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      schoolId: formData.schoolId,
      schoolName: targetSchool?.name || "Lincoln International School",
      studentIds: [],
      studentNames: [],
      assignedRouteNames: [],
      pickupAddress: formData.pickupAddress,
      notificationStatus: formData.notificationStatus,
      status: formData.status,
    });

    setCreateModalOpen(false);
    showToast(`Guardian ${formData.name} invited to platform.`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editParent) return;

    const targetSchool = schools.find((s) => s.id === formData.schoolId);

    updateParent(editParent.id, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      schoolId: formData.schoolId,
      schoolName: targetSchool?.name,
      pickupAddress: formData.pickupAddress,
      notificationStatus: formData.notificationStatus,
      status: formData.status,
    });

    setEditParent(null);
    showToast(`Updated guardian account for ${formData.name}.`);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteParent(deleteTarget.id);
    showToast(`Guardian ${deleteTarget.name} deactivated.`);
    setDeleteTarget(null);
  };

  const columns: Column<Parent>[] = [
    {
      key: "name",
      header: "Parent / Guardian",
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal text-white font-bold text-xs shrink-0">
            {p.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <p className="font-semibold text-ink">{p.name}</p>
            <p className="text-xs text-ink/50">{p.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "school",
      header: "Campus",
      render: (p) => {
        const sch = schools.find((s) => s.id === p.schoolId);
        return (
          <span className="text-xs text-ink font-medium">
            {sch?.name || p.schoolName || "Lincoln International School"}
          </span>
        );
      },
    },
    {
      key: "students",
      header: "Enrolled Riders",
      render: (p) => (
        <span className="text-xs font-semibold text-teal">
          {p.studentNames.length > 0 ? p.studentNames.join(", ") : "None assigned"}
        </span>
      ),
    },
    {
      key: "notificationStatus",
      header: "Channels",
      render: (p) => (
        <span className="text-xs text-ink/75 font-mono capitalize">
          {p.notificationStatus.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (p) => <StatusBadge status={p.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => setViewParent(p)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink/60 hover:bg-ivory hover:text-teal transition"
            title="View Guardian"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleOpenEdit(p)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink/60 hover:bg-ivory hover:text-teal transition"
            title="Edit Guardian"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(p)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-red-600 hover:bg-red-50 transition"
            title="Remove Guardian"
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
        title="Global Guardians Directory"
        description="Unified registry of all verified parent and guardian accounts connected to AuraTransit live rider telemetry."
        actions={
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={handleOpenCreate}
          >
            Add Guardian
          </Button>
        }
      />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search parents across network..."
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
              { label: "Inactive", value: "inactive" },
            ],
          },
        ]}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        keyExtractor={(p) => p.id}
      />

      {/* Guardian Detail Drawer */}
      <Drawer
        open={!!viewParent}
        onClose={() => setViewParent(null)}
        title={viewParent?.name || "Guardian Account"}
        description="Parent & guardian communication profile"
        width="md"
      >
        {viewParent && (
          <div className="space-y-6 text-sm text-ink">
            <div className="flex items-center gap-4 rounded-2xl bg-ivory/50 p-4 border border-ink/8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal text-white font-bold text-base">
                {viewParent.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <h4 className="font-bold text-base text-ink">{viewParent.name}</h4>
                <p className="text-xs text-ink/60">{viewParent.email}</p>
                <div className="mt-1">
                  <StatusBadge status={viewParent.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-ink/8 p-3">
                <span className="text-xs text-ink/50 block">Phone</span>
                <span className="font-medium text-xs">{viewParent.phone}</span>
              </div>
              <div className="rounded-2xl border border-ink/8 p-3">
                <span className="text-xs text-ink/50 block">Campus</span>
                <span className="font-medium text-xs">
                  {schools.find((s) => s.id === viewParent.schoolId)?.name ||
                    viewParent.schoolName ||
                    "Lincoln International School"}
                </span>
              </div>
              <div className="rounded-2xl border border-ink/8 p-3 col-span-2">
                <span className="text-xs text-ink/50 block">Primary Pickup Address</span>
                <span className="font-medium text-xs">{viewParent.pickupAddress || "On file"}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-ink/8 bg-ivory/40 p-4 space-y-3">
              <h5 className="font-bold text-xs text-ink flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-teal" /> Enrolled Students
              </h5>
              <div className="space-y-2">
                {viewParent.studentNames.map((name, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl bg-white p-3 border border-ink/8 text-xs"
                  >
                    <span className="font-semibold text-ink">{name}</span>
                    <span className="text-teal font-medium">Daily Rider</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Create / Edit Modal */}
      <Modal
        open={createModalOpen || !!editParent}
        onClose={() => {
          setCreateModalOpen(false);
          setEditParent(null);
        }}
        title={editParent ? `Edit Guardian — ${editParent.name}` : "Invite Guardian"}
        description="Add a parent or guardian to receive live ETA and student boarding notices."
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCreateModalOpen(false);
                setEditParent(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={editParent ? handleEditSubmit : handleCreateSubmit}
            >
              {editParent ? "Save Changes" : "Send Access Invite"}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="Guardian Full Name"
            placeholder="e.g. Eleanor Vance"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="e.vance@parentmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Mobile Phone"
              placeholder="+1 (312) 555-0312"
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
              label="Notification Channel"
              value={formData.notificationStatus}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  notificationStatus: e.target
                    .value as Parent["notificationStatus"],
                })
              }
              options={[
                { label: "SMS + Push Notifications", value: "sms_and_app" },
                { label: "Push Only", value: "app_only" },
                { label: "SMS Only", value: "sms_only" },
                { label: "Muted / Inactive", value: "inactive" },
              ]}
            />
          </div>

          <Input
            label="Pickup Address"
            placeholder="123 Maple Street, Chicago, IL"
            value={formData.pickupAddress}
            onChange={(e) =>
              setFormData({ ...formData, pickupAddress: e.target.value })
            }
          />
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Deactivate Guardian ${deleteTarget?.name}?`}
        message="This guardian will no longer receive live arrival alerts or boarding updates."
        confirmLabel="Deactivate Guardian"
      />
    </div>
  );
}
