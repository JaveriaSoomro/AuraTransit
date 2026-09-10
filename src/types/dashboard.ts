export type UserRole =
  | "super_admin"
  | "school_admin"
  | "transportation_manager"
  | "dispatcher"
  | "staff"
  | "driver"
  | "aide"
  | "parent"
  | "student";

export type VehicleStatus = "active" | "maintenance" | "inactive" | "on_route" | "at_stop" | "delayed";
export type RouteStatus = "active" | "in_progress" | "scheduled" | "completed" | "delayed" | "inactive";
export type TripStatus = "completed" | "delayed" | "cancelled" | "missed" | "in_progress";
export type SchoolStatus = "active" | "suspended" | "trial" | "pending";

export interface School {
  id: string;
  name: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  adminName: string;
  adminEmail: string;
  logo?: string;
  plan: "Starter" | "Growth" | "Enterprise";
  status: SchoolStatus;
  studentsCount: number;
  vehiclesCount: number;
  routesCount: number;
  usersCount: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  schoolId?: string;
  schoolName?: string;
  status: "active" | "inactive" | "suspended";
  avatar?: string;
  lastActive: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  vehicleNumber: string; // e.g. BUS-104
  registrationNumber: string; // e.g. IL-TR-8492
  type: "Full Bus (72 pax)" | "Mid Bus (36 pax)" | "Minivan (14 pax)" | "EV Shuttle (24 pax)";
  capacity: number;
  model: string;
  year: number;
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedRouteId?: string;
  assignedRouteName?: string;
  schoolId: string;
  schoolName?: string;
  status: VehicleStatus;
  currentLocation?: {
    lat: number;
    lng: number;
    name: string;
  };
  speedMph?: number;
  studentsOnboard?: number;
  eta?: string;
  lastUpdated: string;
  mileage?: number;
  fuelLevel?: number;
  speed?: number;
  lastInspectionDate?: string;
  currentLat?: number;
  currentLng?: number;
}

export interface RouteStop {
  id: string;
  name: string;
  address: string;
  scheduledTime: string;
  studentsCount: number;
  status: "upcoming" | "reached" | "departed" | "delayed";
  order: number;
  lat?: number;
  lng?: number;
}

export interface Route {
  id: string;
  routeNumber: string; // e.g. Route 08
  name: string; // e.g. North Ridge Express
  schoolId: string;
  schoolName?: string;
  assignedVehicleId?: string;
  assignedVehicleNumber?: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedAideId?: string;
  assignedAideName?: string;
  studentsCount: number;
  stopsCount: number;
  totalStops?: number;
  startTime: string;
  expectedArrival: string;
  days: string[]; // ["Mon", "Tue", "Wed", "Thu", "Fri"]
  status: RouteStatus;
  stops: RouteStop[];
  description?: string;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  assignedVehicleId?: string;
  assignedVehicleNumber?: string;
  assignedRouteId?: string;
  assignedRouteName?: string;
  schoolId: string;
  schoolName?: string;
  tripsCount: number;
  rating: number;
  status: "active" | "on_trip" | "off_duty" | "suspended";
  avatar?: string;
  backgroundCheck?: string;
  medicalClearance?: string;
}

export interface Aide {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignedRouteId?: string;
  assignedRouteName?: string;
  assignedVehicleId?: string;
  assignedVehicleNumber?: string;
  schoolId: string;
  schoolName?: string;
  status: "active" | "on_duty" | "off_duty";
  certification: string;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  schoolId: string;
  schoolName?: string;
  studentIds: string[];
  studentNames: string[];
  assignedRouteNames: string[];
  notificationStatus: "sms_and_app" | "app_only" | "sms_only" | "muted";
  pickupAddress: string;
  status: "active" | "inactive";
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string; // e.g. STU-2026-081
  grade: string; // e.g. 5th Grade
  schoolId: string;
  schoolName?: string;
  parentId: string;
  parentName: string;
  emergencyContact: string;
  assignedRouteId?: string;
  assignedRouteName?: string;
  pickupStopName: string;
  status: "active" | "on_board" | "dropped_off" | "absent";
  allergiesOrNotes?: string;
}

export interface TripHistoryItem {
  id: string;
  tripNumber: string; // e.g. TRP-9021
  date: string;
  routeId: string;
  routeName: string;
  vehicleId: string;
  vehicleNumber: string;
  driverId: string;
  driverName: string;
  studentsCount: number;
  startTime: string;
  arrivalTime: string;
  durationMinutes: number;
  status: TripStatus;
  notes?: string;
  delaysReported?: number;
  schoolId?: string;
  schoolName?: string;
  studentsBoarded?: number;
  totalExpectedStudents?: number;
  aideName?: string;
  endTime?: string;
  events?: {
    time: string;
    description: string;
    type: "departure" | "stop" | "incident" | "arrival";
  }[];
}

export interface Subscription {
  plan: "Starter" | "Growth" | "Enterprise";
  status: "active" | "past_due" | "trial";
  renewalDate: string;
  vehiclesLimit: number;
  vehiclesUsed: number;
  studentsLimit: number;
  studentsUsed: number;
  monthlyAmount: number;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  downloadUrl?: string;
}
