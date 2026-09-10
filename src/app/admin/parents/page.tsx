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
  Home,
  Bell,
  GraduationCap,
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

export default function ParentsPage() {
  const { parents, students, routes, addParent, updateParent, deleteParent } =
    useAuraStore();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editParent, setEditParent] = useState<Parent | null>(null);
  const [viewParent, setViewParent] = useState<Parent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Parent | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
      return matchesSearch && matchesStatus;
    });
  }, [parents, search, statusFilter]);

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      email: "",
      phone: "+1 (312) 555-03",
      pickupAddress: "Chicago, IL",
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
      pickupAddress: p.pickupAddress,
      notificationStatus: p.notificationStatus,
      status: p.status,
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast("Please provide parent/guardian name and phone.", "error");
      return;
    }

    addParent({
      ...formData,
      schoolId: "sch-1",
      studentIds: [],
      studentNames: ["New Student (Pending link)"],
      assignedRouteNames: ["Route 08 · West Valley"],
    });

    setCreateModalOpen(false);
    showToast(`Guardian profile for ${formData.name} created.`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editParent) return;

    updateParent(editParent.id, formData);
    setEditParent(null);
    showToast(`Updated guardian profile for ${formData.name}.`);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteParent(deleteTarget.id);
    showToast(`Guardian ${deleteTarget.name} removed.`);
    setDeleteTarget(null);
  };

  const columns: Column<Parent>[] = [
    {
      key: "name",
      header: "Parent / Guardian",
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal text-white font-bold text-xs shrink-0">
            {p.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <p className="font-semibold text-ink">{p.name}</p>
            <p className="text-xs text-ink/50 truncate max-w-[200px]">
              {p.pickupAddress}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (p) => (
        <div className="text-xs">
          <p className="font-mono text-ink/80">{p.phone}</p>
          <p className="text-ink/50">{p.email}</p>
        </div>
      ),
    },
    {
      key: "students",
      header: "Children",
      render: (p) => (
        <div className="flex flex-wrap gap-1">
          {p.studentNames.map((st) => (
            <span
              key={st}
              className="inline-flex items-center gap-1 rounded-full bg-ivory border border-ink/8 px-2 py-0.5 text-xs font-medium text-ink"
            >
              <GraduationCap className="h-3 w-3 text-teal" />
              {st}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "assignedRoutes",
      header: "Assigned Routes",
      render: (p) => (
        <span className="text-xs text-ink/75 truncate max-w-[160px] block">
          {p.assignedRouteNames.join(", ")}
        </span>
      ),
    },
    {
      key: "notificationStatus",
      header: "Alerts Channel",
      render: (p) => (
        <span className="inline-flex items-center gap-1 text-xs text-teal font-semibold">
          <Bell className="h-3 w-3" />
          {p.notificationStatus.replace(/_/g, " ").toUpperCase()}
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
            onClick={(e) => {
              e.stopPropagation();
              setViewParent(p);
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
              handleOpenEdit(p);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink/60 hover:bg-ivory hover:text-teal transition"
            title="Edit Parent"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(p);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full text-red-600 hover:bg-red-50 transition"
            title="Delete Parent"
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
        title="Parents & Guardians"
        description="Directory of verified student guardians. Manage notification preferences, pickup addresses, and live trip notifications."
        actions={
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={handleOpenCreate}
          >
            Add Parent
          </Button>
        }
      />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search parents by name, child, phone or address..."
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
              { label: "Inactive", value: "inactive" },
            ],
          },
        ]}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        keyExtractor={(p) => p.id}
        onRowClick={(p) => setViewParent(p)}
      />

      {/* Create / Edit Modal */}
      <Modal
        open={createModalOpen || !!editParent}
        onClose={() => {
          setCreateModalOpen(false);
          setEditParent(null);
        }}
        title={editParent ? `Edit ${editParent.name}` : "Register Guardian"}
        description="Configure contact information and mobile notification preferences."
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
              {editParent ? "Save Changes" : "Create Guardian Profile"}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="Parent / Guardian Name"
            placeholder="e.g. David & Rachel Patel"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="rachel.patel@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <Input
              label="Phone Number (SMS Alert Enabled)"
              placeholder="+1 (312) 555-0322"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>

          <Input
            label="Home / Pickup Address"
            placeholder="128 Cedar Hill Rd, Chicago, IL"
            value={formData.pickupAddress}
            onChange={(e) =>
              setFormData({ ...formData, pickupAddress: e.target.value })
            }
          />

          <Select
            label="Notification Preference"
            value={formData.notificationStatus}
            onChange={(e) =>
              setFormData({
                ...formData,
                notificationStatus: e.target.value as Parent["notificationStatus"],
              })
            }
            options={[
              { label: "SMS and Mobile App Push (Recommended)", value: "sms_and_app" },
              { label: "Mobile App Only", value: "app_only" },
              { label: "SMS Only", value: "sms_only" },
              { label: "Muted / No Alerts", value: "muted" },
            ]}
          />
        </form>
      </Modal>

      {/* Drawer */}
      <Drawer
        open={!!viewParent}
        onClose={() => setViewParent(null)}
        title={viewParent?.name || "Guardian Record"}
        subtitle="Lincoln International School Verified Family Profile"
        footer={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setViewParent(null)}
            >
              Close
            </Button>
            {viewParent && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const target = viewParent;
                  setViewParent(null);
                  handleOpenEdit(target);
                }}
              >
                Edit Profile
              </Button>
            )}
          </div>
        }
      >
        {viewParent && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-ink/8 bg-white p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-teal" />
                <span className="font-semibold text-ink">{viewParent.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-teal" />
                <span className="font-semibold text-ink">{viewParent.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-teal" />
                <span>{viewParent.pickupAddress}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink/50">
                Enrolled Children
              </h4>
              <div className="space-y-2">
                {viewParent.studentNames.map((st) => (
                  <div
                    key={st}
                    className="flex items-center justify-between rounded-xl bg-ivory/60 p-3 border border-ink/6 text-xs"
                  >
                    <div className="flex items-center gap-2 font-semibold text-ink">
                      <GraduationCap className="h-4 w-4 text-teal" />
                      <span>{st}</span>
                    </div>
                    <span className="text-teal font-semibold">Active Rider</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-teal/5 border border-teal/20 p-4 text-xs space-y-1 text-teal">
              <p className="font-bold">Live Boarding Alerts Configured</p>
              <p className="opacity-80">
                Guardian receives SMS notification within 3 seconds of bus stop check-in.
              </p>
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Remove ${deleteTarget?.name}?`}
        message="This will decouple the guardian record from enrolled students."
        confirmLabel="Remove Guardian"
      />
    </div>
  );
}
