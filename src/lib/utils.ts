export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatRole(role: string): string {
  const map: Record<string, string> = {
    super_admin: "Super Admin",
    school_admin: "School Admin",
    transportation_manager: "Transportation Manager",
    dispatcher: "Dispatcher",
    staff: "Staff",
    driver: "Driver",
    aide: "Transportation Aide",
    parent: "Parent / Guardian",
    student: "Student",
  };
  return map[role] || role.replace("_", " ");
}

export function formatStatus(status: string): string {
  const map: Record<string, string> = {
    on_route: "On Route",
    at_stop: "At Stop",
    delayed: "Delayed",
    completed: "Completed",
    in_progress: "In Progress",
    scheduled: "Scheduled",
    active: "Active",
    inactive: "Inactive",
    maintenance: "Maintenance",
    offline: "Offline",
    suspended: "Suspended",
    trial: "Trial",
    on_board: "On Board",
    dropped_off: "Dropped Off",
    absent: "Absent",
    paid: "Paid",
    pending: "Pending",
    overdue: "Overdue",
    on_duty: "On Duty",
    off_duty: "Off Duty",
  };
  return map[status] || status.replace("_", " ");
}
