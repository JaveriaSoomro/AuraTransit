"use client";

import React, { useState, useMemo } from "react";
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Eye,
  HeartHandshake,
  MapPin,
  GitFork,
  CheckCircle2,
  AlertCircle,
  Phone,
} from "lucide-react";
import { useAuraStore } from "@/lib/store";
import { Student } from "@/types/dashboard";
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

export default function StudentsPage() {
  const { students, parents, routes, addStudent, updateStudent, deleteStudent } =
    useAuraStore();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    grade: "5th Grade",
    parentId: "",
    emergencyContact: "",
    assignedRouteId: "",
    pickupStopName: "",
    status: "active" as Student["status"],
    allergiesOrNotes: "",
  });

  const filteredData = useMemo(() => {
    return students.filter((s) => {
      const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        s.studentId.toLowerCase().includes(search.toLowerCase()) ||
        s.parentName.toLowerCase().includes(search.toLowerCase()) ||
        (s.assignedRouteName &&
          s.assignedRouteName.toLowerCase().includes(search.toLowerCase())) ||
        s.pickupStopName.toLowerCase().includes(search.toLowerCase());

      const matchesGrade = gradeFilter === "all" || s.grade === gradeFilter;
      const matchesStatus =
        statusFilter === "all" || s.status === statusFilter;

      return matchesSearch && matchesGrade && matchesStatus;
    });
  }, [students, search, gradeFilter, statusFilter]);

  const handleOpenCreate = () => {
    setFormData({
      firstName: "",
      lastName: "",
      studentId: `STU-2026-${Math.floor(100 + Math.random() * 899)}`,
      grade: "5th Grade",
      parentId: parents[0]?.id || "",
      emergencyContact: "+1 (312) 555-0311",
      assignedRouteId: routes[0]?.id || "",
      pickupStopName: "Lincoln South Crossing",
      status: "active",
      allergiesOrNotes: "",
    });
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (s: Student) => {
    setEditStudent(s);
    setFormData({
      firstName: s.firstName,
      lastName: s.lastName,
      studentId: s.studentId,
      grade: s.grade,
      parentId: s.parentId,
      emergencyContact: s.emergencyContact,
      assignedRouteId: s.assignedRouteId || "",
      pickupStopName: s.pickupStopName,
      status: s.status,
      allergiesOrNotes: s.allergiesOrNotes || "",
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName) {
      showToast("Please provide first and last name.", "error");
      return;
    }

    const assignedParent = parents.find((p) => p.id === formData.parentId);
    const assignedRoute = routes.find((r) => r.id === formData.assignedRouteId);

    addStudent({
      ...formData,
      schoolId: "sch-1",
      parentName: assignedParent?.name || "Parent",
      assignedRouteName: assignedRoute?.name,
    });

    setCreateModalOpen(false);
    showToast(`Student ${formData.firstName} ${formData.lastName} enrolled.`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudent) return;

    const assignedParent = parents.find((p) => p.id === formData.parentId);
    const assignedRoute = routes.find((r) => r.id === formData.assignedRouteId);

    updateStudent(editStudent.id, {
      ...formData,
      parentName: assignedParent?.name || editStudent.parentName,
      assignedRouteName: assignedRoute?.name,
    });

    setEditStudent(null);
    showToast(`Updated student profile for ${formData.firstName}.`);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteStudent(deleteTarget.id);
    showToast(`Student ${deleteTarget.firstName} ${deleteTarget.lastName} removed.`);
    setDeleteTarget(null);
  };

  const columns: Column<Student>[] = [
    {
      key: "student",
      header: "Student",
      render: (s) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sun text-ink font-bold text-xs shrink-0">
            {s.firstName[0]}
            {s.lastName[0]}
          </div>
          <div>
            <p className="font-semibold text-ink">
              {s.firstName} {s.lastName}
            </p>
            <p className="font-mono text-xs text-ink/45">{s.studentId}</p>
          </div>
        </div>
      ),
    },
    {
      key: "grade",
      header: "Grade",
      render: (s) => (
        <span className="rounded-full bg-ivory border border-ink/8 px-2.5 py-0.5 text-xs font-semibold text-ink/75">
          {s.grade}
        </span>
      ),
    },
    {
      key: "parentName",
      header: "Parent / Guardian",
      render: (s) => (
        <span className="text-xs font-medium text-ink">{s.parentName}</span>
      ),
    },
    {
      key: "assignedRouteName",
      header: "Assigned Route",
      render: (s) => (
        <span className="text-xs text-teal font-semibold">
          {s.assignedRouteName || "Unassigned"}
        </span>
      ),
    },
    {
      key: "pickupStopName",
      header: "Pickup Stop",
      render: (s) => (
        <span className="text-xs text-ink/75 truncate max-w-[170px] block">
          {s.pickupStopName}
        </span>
      ),
    },
    {
      key: "status",
      header: "Boarding Status",
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
              setViewStudent(s);
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
            title="Edit Student"
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
            title="Delete Student"
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
        title="Students"
        description="Student transportation registry for Lincoln International School. Track live boarding status, pickup stops, medical notes, and guardian contacts."
        actions={
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={handleOpenCreate}
          >
            Enroll Student
          </Button>
        }
      />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search student name, ID, parent, route or stop..."
        totalResults={filteredData.length}
        onResetFilters={() => {
          setSearch("");
          setGradeFilter("all");
          setStatusFilter("all");
        }}
        filters={[
          {
            key: "grade",
            label: "Grade",
            value: gradeFilter,
            onChange: setGradeFilter,
            options: [
              { label: "All Grades", value: "all" },
              { label: "2nd Grade", value: "2nd Grade" },
              { label: "3rd Grade", value: "3rd Grade" },
              { label: "4th Grade", value: "4th Grade" },
              { label: "5th Grade", value: "5th Grade" },
              { label: "6th Grade", value: "6th Grade" },
              { label: "7th Grade", value: "7th Grade" },
              { label: "8th Grade", value: "8th Grade" },
            ],
          },
          {
            key: "status",
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: "All Statuses", value: "all" },
              { label: "On Board", value: "on_board" },
              { label: "Dropped Off", value: "dropped_off" },
              { label: "Active", value: "active" },
              { label: "Absent", value: "absent" },
            ],
          },
        ]}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        keyExtractor={(s) => s.id}
        onRowClick={(s) => setViewStudent(s)}
      />

      {/* Create / Edit Modal */}
      <Modal
        open={createModalOpen || !!editStudent}
        onClose={() => {
          setCreateModalOpen(false);
          setEditStudent(null);
        }}
        title={editStudent ? `Edit ${editStudent.firstName} ${editStudent.lastName}` : "Enroll Student Rider"}
        description="Assign daily bus route, designate pickup stop and verify emergency contact."
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCreateModalOpen(false);
                setEditStudent(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={editStudent ? handleEditSubmit : handleCreateSubmit}
            >
              {editStudent ? "Save Changes" : "Enroll Student"}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="e.g. Emma"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
            <Input
              label="Last Name"
              placeholder="e.g. Johnson"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Student ID"
              placeholder="STU-2026-041"
              value={formData.studentId}
              onChange={(e) =>
                setFormData({ ...formData, studentId: e.target.value })
              }
              required
            />
            <Select
              label="Grade Level"
              value={formData.grade}
              onChange={(e) =>
                setFormData({ ...formData, grade: e.target.value })
              }
              options={[
                { label: "1st Grade", value: "1st Grade" },
                { label: "2nd Grade", value: "2nd Grade" },
                { label: "3rd Grade", value: "3rd Grade" },
                { label: "4th Grade", value: "4th Grade" },
                { label: "5th Grade", value: "5th Grade" },
                { label: "6th Grade", value: "6th Grade" },
                { label: "7th Grade", value: "7th Grade" },
                { label: "8th Grade", value: "8th Grade" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Parent / Guardian"
              value={formData.parentId}
              onChange={(e) =>
                setFormData({ ...formData, parentId: e.target.value })
              }
              options={parents.map((p) => ({
                label: `${p.name} (${p.phone})`,
                value: p.id,
              }))}
            />
            <Input
              label="Emergency Contact Phone"
              placeholder="+1 (312) 555-0311"
              value={formData.emergencyContact}
              onChange={(e) =>
                setFormData({ ...formData, emergencyContact: e.target.value })
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
                { label: "— Unassigned —", value: "" },
                ...routes.map((r) => ({
                  label: `${r.routeNumber} · ${r.name}`,
                  value: r.id,
                })),
              ]}
            />
            <Input
              label="Pickup Stop / Intersection"
              placeholder="e.g. Maple Ave & 4th"
              value={formData.pickupStopName}
              onChange={(e) =>
                setFormData({ ...formData, pickupStopName: e.target.value })
              }
            />
          </div>

          <Input
            label="Medical Notes / Allergies"
            placeholder="e.g. Carries asthma inhaler, peanut allergy"
            value={formData.allergiesOrNotes}
            onChange={(e) =>
              setFormData({ ...formData, allergiesOrNotes: e.target.value })
            }
          />

          <Select
            label="Current Transit Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as Student["status"],
              })
            }
            options={[
              { label: "Active (Enrolled)", value: "active" },
              { label: "On Board (In Transit)", value: "on_board" },
              { label: "Dropped Off (Arrived)", value: "dropped_off" },
              { label: "Absent (Not riding today)", value: "absent" },
            ]}
          />
        </form>
      </Modal>

      {/* Drawer */}
      <Drawer
        open={!!viewStudent}
        onClose={() => setViewStudent(null)}
        title={viewStudent ? `${viewStudent.firstName} ${viewStudent.lastName}` : "Student Profile"}
        subtitle={`Student ID: ${viewStudent?.studentId} · ${viewStudent?.grade}`}
        footer={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setViewStudent(null)}
            >
              Close
            </Button>
            {viewStudent && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const target = viewStudent;
                  setViewStudent(null);
                  handleOpenEdit(target);
                }}
              >
                Edit Student
              </Button>
            )}
          </div>
        }
      >
        {viewStudent && (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-2xl bg-ivory/60 p-4 border border-ink/8">
              <div>
                <p className="text-xs text-ink/50 uppercase tracking-wider font-semibold">
                  Transit Status
                </p>
                <div className="mt-1">
                  <StatusBadge status={viewStudent.status} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-ink/50 uppercase tracking-wider font-semibold">
                  Grade
                </p>
                <p className="text-base font-bold text-ink">{viewStudent.grade}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink/50">
                Route & Pickup Details
              </h4>
              <div className="rounded-2xl border border-ink/8 bg-white p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-ink/50">Assigned Route:</span>
                  <span className="font-semibold text-teal">
                    {viewStudent.assignedRouteName || "Unassigned"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/50">Morning Pickup Stop:</span>
                  <span className="font-semibold text-ink">
                    {viewStudent.pickupStopName}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink/50">
                Guardian & Emergency Contact
              </h4>
              <div className="rounded-2xl border border-ink/8 bg-white p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-ink/50">Primary Guardian:</span>
                  <span className="font-semibold text-ink">
                    {viewStudent.parentName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/50">Emergency Contact:</span>
                  <span className="font-mono text-ink">
                    {viewStudent.emergencyContact}
                  </span>
                </div>
              </div>
            </div>

            {viewStudent.allergiesOrNotes && (
              <div className="rounded-2xl bg-sun/15 border border-sun/30 p-4 text-xs">
                <p className="font-bold text-ink">Medical / Safety Note</p>
                <p className="text-ink/80 mt-1">{viewStudent.allergiesOrNotes}</p>
              </div>
            )}
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Remove ${deleteTarget?.firstName} ${deleteTarget?.lastName}?`}
        message="This student will be unassigned from daily route runs."
        confirmLabel="Remove Student"
      />
    </div>
  );
}
