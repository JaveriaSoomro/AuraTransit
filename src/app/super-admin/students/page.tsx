"use client";

import React, { useState, useMemo } from "react";
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Heart,
  MapPin,
  GitFork,
  Phone,
  AlertCircle,
  Building2,
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
import { Input, Select, Textarea } from "@/components/ui/form-field";
import { useToast } from "@/components/ui/toast";

export default function SuperAdminStudentsPage() {
  const {
    students,
    parents,
    routes,
    schools,
    addStudent,
    updateStudent,
    deleteStudent,
  } = useAuraStore();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [schoolFilter, setSchoolFilter] = useState("all");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    grade: "5th Grade",
    schoolId: "sch-1",
    parentId: "",
    emergencyContact: "+1 (312) 555-0100",
    assignedRouteId: "",
    pickupStopName: "Lincoln West Gate",
    status: "active" as Student["status"],
    allergiesOrNotes: "",
  });

  const filteredData = useMemo(() => {
    return students.filter((s) => {
      const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        s.studentId.toLowerCase().includes(search.toLowerCase()) ||
        s.parentName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || s.status === statusFilter;
      const matchesGrade = gradeFilter === "all" || s.grade === gradeFilter;
      const matchesSchool =
        schoolFilter === "all" || (s.schoolId || "sch-1") === schoolFilter;
      return matchesSearch && matchesStatus && matchesGrade && matchesSchool;
    });
  }, [students, search, statusFilter, gradeFilter, schoolFilter]);

  const handleOpenCreate = () => {
    const nextNum = Math.floor(1000 + Math.random() * 9000);
    setFormData({
      firstName: "",
      lastName: "",
      studentId: `STU-${nextNum}`,
      grade: "5th Grade",
      schoolId: schools[0]?.id || "sch-1",
      parentId: parents[0]?.id || "",
      emergencyContact: "+1 (312) 555-0100",
      assignedRouteId: "",
      pickupStopName: "Main Campus Circle",
      status: "active",
      allergiesOrNotes: "None reported",
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
      schoolId: s.schoolId || "sch-1",
      parentId: s.parentId,
      emergencyContact: s.emergencyContact,
      assignedRouteId: s.assignedRouteId || "",
      pickupStopName: s.pickupStopName || "",
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
    const assignedRt = routes.find((r) => r.id === formData.assignedRouteId);
    const targetSchool = schools.find((s) => s.id === formData.schoolId);

    addStudent({
      firstName: formData.firstName,
      lastName: formData.lastName,
      studentId: formData.studentId,
      grade: formData.grade,
      schoolId: formData.schoolId,
      schoolName: targetSchool?.name || "Lincoln International School",
      parentId: formData.parentId,
      parentName: assignedParent?.name || "Parent On File",
      emergencyContact: formData.emergencyContact,
      assignedRouteId: formData.assignedRouteId || undefined,
      assignedRouteName: assignedRt?.name,
      pickupStopName: formData.pickupStopName,
      status: formData.status,
      allergiesOrNotes: formData.allergiesOrNotes,
    });

    setCreateModalOpen(false);
    showToast(`Rider ${formData.firstName} ${formData.lastName} enrolled.`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudent) return;

    const assignedParent = parents.find((p) => p.id === formData.parentId);
    const assignedRt = routes.find((r) => r.id === formData.assignedRouteId);
    const targetSchool = schools.find((s) => s.id === formData.schoolId);

    updateStudent(editStudent.id, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      studentId: formData.studentId,
      grade: formData.grade,
      schoolId: formData.schoolId,
      schoolName: targetSchool?.name,
      parentId: formData.parentId,
      parentName: assignedParent?.name,
      emergencyContact: formData.emergencyContact,
      assignedRouteId: formData.assignedRouteId || undefined,
      assignedRouteName: assignedRt?.name,
      pickupStopName: formData.pickupStopName,
      status: formData.status,
      allergiesOrNotes: formData.allergiesOrNotes,
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
      key: "school",
      header: "Enrolled Campus",
      render: (s) => {
        const sch = schools.find((sc) => sc.id === s.schoolId);
        return (
          <span className="text-xs text-ink font-medium">
            {sch?.name || s.schoolName || "Lincoln International School"}
          </span>
        );
      },
    },
    {
      key: "grade",
      header: "Grade",
      render: (s) => (
        <span className="text-xs font-semibold text-ink/75 bg-ivory px-2 py-0.5 rounded border border-ink/8">
          {s.grade}
        </span>
      ),
    },
    {
      key: "parentName",
      header: "Parent / Guardian",
      render: (s) => (
        <span className="text-xs text-ink/80">{s.parentName}</span>
      ),
    },
    {
      key: "route",
      header: "Assigned Route",
      render: (s) => (
        <span className="text-xs font-semibold text-teal">
          {s.assignedRouteName || "Unassigned"}
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
            onClick={() => setViewStudent(s)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink/60 hover:bg-ivory hover:text-teal transition"
            title="View Student"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleOpenEdit(s)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink/60 hover:bg-ivory hover:text-teal transition"
            title="Edit Student"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(s)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-red-600 hover:bg-red-50 transition"
            title="Remove Student"
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
        title="Global Student Registry"
        description="Comprehensive rider directory covering all enrolled students across participating educational districts."
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
        searchPlaceholder="Search students across network..."
        totalResults={filteredData.length}
        onResetFilters={() => {
          setSearch("");
          setStatusFilter("all");
          setGradeFilter("all");
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
            label: "Boarding Status",
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
          {
            key: "grade",
            label: "Grade",
            value: gradeFilter,
            onChange: setGradeFilter,
            options: [
              { label: "All Grades", value: "all" },
              { label: "Kindergarten", value: "Kindergarten" },
              { label: "1st Grade", value: "1st Grade" },
              { label: "2nd Grade", value: "2nd Grade" },
              { label: "3rd Grade", value: "3rd Grade" },
              { label: "4th Grade", value: "4th Grade" },
              { label: "5th Grade", value: "5th Grade" },
              { label: "6th Grade", value: "6th Grade" },
              { label: "7th Grade", value: "7th Grade" },
              { label: "8th Grade", value: "8th Grade" },
            ],
          },
        ]}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        keyExtractor={(s) => s.id}
      />

      {/* Student View Drawer */}
      <Drawer
        open={!!viewStudent}
        onClose={() => setViewStudent(null)}
        title={viewStudent ? `${viewStudent.firstName} ${viewStudent.lastName}` : "Student Profile"}
        description={`ID: ${viewStudent?.studentId} · ${viewStudent?.grade}`}
        width="md"
      >
        {viewStudent && (
          <div className="space-y-6 text-sm text-ink">
            <div className="flex items-center gap-4 rounded-2xl bg-ivory/50 p-4 border border-ink/8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sun text-ink font-bold text-base">
                {viewStudent.firstName[0]}
                {viewStudent.lastName[0]}
              </div>
              <div>
                <h4 className="font-bold text-base text-ink">
                  {viewStudent.firstName} {viewStudent.lastName}
                </h4>
                <p className="text-xs text-ink/60">
                  {viewStudent.grade} · ID #{viewStudent.studentId}
                </p>
                <div className="mt-1">
                  <StatusBadge status={viewStudent.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-ink/8 p-3">
                <span className="text-xs text-ink/50 block">Campus</span>
                <span className="font-medium text-xs">
                  {schools.find((sc) => sc.id === viewStudent.schoolId)?.name ||
                    viewStudent.schoolName ||
                    "Lincoln International School"}
                </span>
              </div>
              <div className="rounded-2xl border border-ink/8 p-3">
                <span className="text-xs text-ink/50 block">Assigned Corridor</span>
                <span className="font-semibold text-xs text-teal">
                  {viewStudent.assignedRouteName || "Unassigned"}
                </span>
              </div>
              <div className="rounded-2xl border border-ink/8 p-3">
                <span className="text-xs text-ink/50 block">Guardian</span>
                <span className="font-medium text-xs">{viewStudent.parentName}</span>
              </div>
              <div className="rounded-2xl border border-ink/8 p-3">
                <span className="text-xs text-ink/50 block">Emergency Phone</span>
                <span className="font-medium text-xs">{viewStudent.emergencyContact}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-ink/8 bg-ivory/40 p-4 space-y-2">
              <h5 className="font-bold text-xs text-ink flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-red-500" /> Medical & Special Transit Notes
              </h5>
              <p className="text-xs text-ink/75 leading-relaxed">
                {viewStudent.allergiesOrNotes || "No medical alerts registered for this rider."}
              </p>
            </div>
          </div>
        )}
      </Drawer>

      {/* Create / Edit Modal */}
      <Modal
        open={createModalOpen || !!editStudent}
        onClose={() => {
          setCreateModalOpen(false);
          setEditStudent(null);
        }}
        title={editStudent ? `Edit Rider — ${editStudent.firstName}` : "Enroll Student Rider"}
        description="Connect student to bus route, pickup stop, and verified guardian."
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
              placeholder="e.g. Maya"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
            <Input
              label="Last Name"
              placeholder="e.g. Lin"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Student ID"
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
                { label: "Kindergarten", value: "Kindergarten" },
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
            <Select
              label="Campus Assignment"
              value={formData.schoolId}
              onChange={(e) =>
                setFormData({ ...formData, schoolId: e.target.value })
              }
              options={schools.map((s) => ({ label: s.name, value: s.id }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Primary Guardian"
              value={formData.parentId}
              onChange={(e) =>
                setFormData({ ...formData, parentId: e.target.value })
              }
              options={parents.map((p) => ({ label: p.name, value: p.id }))}
            />
            <Input
              label="Emergency Hotline"
              placeholder="+1 (312) 555-0100"
              value={formData.emergencyContact}
              onChange={(e) =>
                setFormData({ ...formData, emergencyContact: e.target.value })
              }
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
            <Input
              label="Assigned Stop"
              placeholder="e.g. West Oak Gate"
              value={formData.pickupStopName}
              onChange={(e) =>
                setFormData({ ...formData, pickupStopName: e.target.value })
              }
            />
          </div>

          <Textarea
            label="Medical Alerts / Special Accommodations"
            placeholder="Nut allergies, asthma, wheelchair boarding requirements..."
            value={formData.allergiesOrNotes}
            onChange={(e) =>
              setFormData({ ...formData, allergiesOrNotes: e.target.value })
            }
          />
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Remove Student ${deleteTarget?.firstName} ${deleteTarget?.lastName}?`}
        message="This student will be removed from the active boarding roster and route stops."
        confirmLabel="Remove Student"
      />
    </div>
  );
}
