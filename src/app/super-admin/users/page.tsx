"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Shield,
  ShieldAlert,
} from "lucide-react";
import { useAuraStore } from "@/lib/store";
import { User, UserRole } from "@/types/dashboard";
import { PageHeader } from "@/components/layout/page-header";
import { FilterBar } from "@/components/layout/filter-bar";
import { DataTable, Column } from "@/components/layout/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input, Select } from "@/components/ui/form-field";
import { formatRole } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export default function SuperAdminUsersPage() {
  const { users, schools, addUser, updateUser, deleteUser } = useAuraStore();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "school_admin" as UserRole,
    schoolId: "sch-1",
    status: "active" as User["status"],
  });

  const filteredData = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesSchool =
        schoolFilter === "all" || u.schoolId === schoolFilter;
      const matchesStatus =
        statusFilter === "all" || u.status === statusFilter;

      return matchesSearch && matchesRole && matchesSchool && matchesStatus;
    });
  }, [users, search, roleFilter, schoolFilter, statusFilter]);

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      email: "",
      phone: "+1 (555) 012-3456",
      role: "school_admin",
      schoolId: schools[0]?.id || "sch-1",
      status: "active",
    });
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      phone: u.phone || "",
      role: u.role,
      schoolId: u.schoolId || schools[0]?.id || "sch-1",
      status: u.status,
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showToast("Please provide name and email.", "error");
      return;
    }

    const assignedSchool = schools.find((s) => s.id === formData.schoolId);

    addUser({
      ...formData,
      schoolName: assignedSchool?.name || "Global Network",
    });

    setCreateModalOpen(false);
    showToast(`User ${formData.name} created.`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;

    const assignedSchool = schools.find((s) => s.id === formData.schoolId);

    updateUser(editUser.id, {
      ...formData,
      schoolName: assignedSchool?.name || editUser.schoolName,
    });

    setEditUser(null);
    showToast(`Updated ${formData.name}.`);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteUser(deleteTarget.id);
    showToast(`User ${deleteTarget.name} has been revoked.`);
    setDeleteTarget(null);
  };

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "Name",
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal text-white font-bold text-xs shrink-0">
            {u.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)}
          </div>
          <div>
            <p className="font-semibold text-ink">{u.name}</p>
            <p className="text-xs text-ink/50">{u.phone || "No phone"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (u) => <span className="text-xs text-ink/80">{u.email}</span>,
    },
    {
      key: "role",
      header: "Role",
      render: (u) => (
        <span className="rounded-full bg-teal/10 px-2.5 py-0.5 text-xs font-semibold text-teal">
          {formatRole(u.role)}
        </span>
      ),
    },
    {
      key: "schoolName",
      header: "School Tenant",
      render: (u) => (
        <span className="text-xs font-medium text-ink">
          {u.schoolName || "Global Platform"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (u) => <StatusBadge status={u.status} />,
    },
    {
      key: "lastActive",
      header: "Last Active",
      render: (u) => (
        <span className="text-xs text-ink/50">{u.lastActive}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (u) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => handleOpenEdit(u)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink/60 hover:bg-ivory hover:text-teal transition"
            title="Edit User"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(u)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-red-600 hover:bg-red-50 transition"
            title="Delete User"
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
        title="Platform Users Directory"
        description="Global directory of all platform administrators, school operators, managers, drivers, and parents across all participating districts."
        actions={
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={handleOpenCreate}
          >
            Create User
          </Button>
        }
      />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search all platform users by name or email..."
        totalResults={filteredData.length}
        onResetFilters={() => {
          setSearch("");
          setRoleFilter("all");
          setSchoolFilter("all");
          setStatusFilter("all");
        }}
        filters={[
          {
            key: "role",
            label: "Role",
            value: roleFilter,
            onChange: setRoleFilter,
            options: [
              { label: "All Roles", value: "all" },
              { label: "Super Admin", value: "super_admin" },
              { label: "School Admin", value: "school_admin" },
              { label: "Transportation Manager", value: "transportation_manager" },
              { label: "Dispatcher", value: "dispatcher" },
              { label: "Staff", value: "staff" },
            ],
          },
          {
            key: "school",
            label: "School",
            value: schoolFilter,
            onChange: setSchoolFilter,
            options: [
              { label: "All Schools", value: "all" },
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
              { label: "Suspended", value: "suspended" },
            ],
          },
        ]}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        keyExtractor={(u) => u.id}
      />

      {/* Modal */}
      <Modal
        open={createModalOpen || !!editUser}
        onClose={() => {
          setCreateModalOpen(false);
          setEditUser(null);
        }}
        title={editUser ? `Edit ${editUser.name}` : "Create Platform User"}
        description="Configure tenant association and permission level."
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCreateModalOpen(false);
                setEditUser(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={editUser ? handleEditSubmit : handleCreateSubmit}
            >
              {editUser ? "Save Changes" : "Create User"}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Platform Role"
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as UserRole,
                })
              }
              options={[
                { label: "Super Admin (Global Access)", value: "super_admin" },
                { label: "School Admin", value: "school_admin" },
                { label: "Transportation Manager", value: "transportation_manager" },
                { label: "Dispatcher", value: "dispatcher" },
                { label: "Staff", value: "staff" },
              ]}
            />
            <Select
              label="School Association"
              value={formData.schoolId}
              onChange={(e) =>
                setFormData({ ...formData, schoolId: e.target.value })
              }
              options={schools.map((s) => ({
                label: s.name,
                value: s.id,
              }))}
            />
          </div>

          <Select
            label="Account Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as User["status"],
              })
            }
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
              { label: "Suspended", value: "suspended" },
            ]}
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Revoke Platform Access for ${deleteTarget?.name}?`}
        message="This user will be disconnected from the AuraTransit system."
        confirmLabel="Revoke User"
      />
    </div>
  );
}
