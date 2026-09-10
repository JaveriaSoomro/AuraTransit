"use client";

import { useState, useEffect, useCallback } from "react";
import {
  School,
  User,
  Vehicle,
  Route,
  Driver,
  Aide,
  Parent,
  Student,
  TripHistoryItem,
  Subscription,
  Invoice,
  UserRole,
} from "@/types/dashboard";
import {
  initialSchools,
  initialVehicles,
  initialRoutes,
  initialDrivers,
  initialAides,
  initialParents,
  initialStudents,
  initialUsers,
  initialTrips,
  initialSubscription,
  initialInvoices,
} from "./mock-data";

const STORAGE_KEY = "auratransit_store_v1";
const EVENT_KEY = "auratransit_update";

interface StoreState {
  schools: School[];
  vehicles: Vehicle[];
  routes: Route[];
  drivers: Driver[];
  aides: Aide[];
  parents: Parent[];
  students: Student[];
  users: User[];
  trips: TripHistoryItem[];
  subscription: Subscription;
  invoices: Invoice[];
  currentRole: UserRole;
  currentSchoolId: string;
}

function getInitialState(): StoreState {
  if (typeof window === "undefined") {
    return {
      schools: initialSchools,
      vehicles: initialVehicles,
      routes: initialRoutes,
      drivers: initialDrivers,
      aides: initialAides,
      parents: initialParents,
      students: initialStudents,
      users: initialUsers,
      trips: initialTrips,
      subscription: initialSubscription,
      invoices: initialInvoices,
      currentRole: "school_admin",
      currentSchoolId: "sch-1",
    };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to parse stored AuraTransit state", e);
  }

  return {
    schools: initialSchools,
    vehicles: initialVehicles,
    routes: initialRoutes,
    drivers: initialDrivers,
    aides: initialAides,
    parents: initialParents,
    students: initialStudents,
    users: initialUsers,
    trips: initialTrips,
    subscription: initialSubscription,
    invoices: initialInvoices,
    currentRole: "school_admin",
    currentSchoolId: "sch-1",
  };
}

let globalMemoryState: StoreState = getInitialState();

function commitState(newState: StoreState) {
  globalMemoryState = newState;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: newState }));
    } catch (e) {
      console.error("Failed to commit AuraTransit state", e);
    }
  }
}

export function useAuraStore() {
  const [state, setState] = useState<StoreState>(globalMemoryState);

  useEffect(() => {
    // Initial sync from localStorage once client mounts
    setState(getInitialState());

    const handleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<StoreState>;
      if (customEvent.detail) {
        setState(customEvent.detail);
      } else {
        setState(getInitialState());
      }
    };

    window.addEventListener(EVENT_KEY, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(EVENT_KEY, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // --- Role Switcher ---
  const switchRole = useCallback((role: UserRole) => {
    const next = { ...globalMemoryState, currentRole: role };
    commitState(next);
  }, []);

  // --- Vehicles CRUD ---
  const addVehicle = useCallback((vehicle: Omit<Vehicle, "id" | "lastUpdated">) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: `veh-${Date.now()}`,
      lastUpdated: "Just now",
      studentsOnboard: vehicle.studentsOnboard ?? 0,
    };
    const next = {
      ...globalMemoryState,
      vehicles: [newVehicle, ...globalMemoryState.vehicles],
    };
    commitState(next);
    return newVehicle;
  }, []);

  const updateVehicle = useCallback((id: string, updates: Partial<Vehicle>) => {
    const next = {
      ...globalMemoryState,
      vehicles: globalMemoryState.vehicles.map((v) =>
        v.id === id ? { ...v, ...updates, lastUpdated: "Just now" } : v,
      ),
    };
    commitState(next);
  }, []);

  const deleteVehicle = useCallback((id: string) => {
    const next = {
      ...globalMemoryState,
      vehicles: globalMemoryState.vehicles.filter((v) => v.id !== id),
    };
    commitState(next);
  }, []);

  // --- Routes CRUD ---
  const addRoute = useCallback((route: Omit<Route, "id">) => {
    const newRoute: Route = {
      ...route,
      id: `rt-${Date.now()}`,
    };
    const next = {
      ...globalMemoryState,
      routes: [newRoute, ...globalMemoryState.routes],
    };
    commitState(next);
    return newRoute;
  }, []);

  const updateRoute = useCallback((id: string, updates: Partial<Route>) => {
    const next = {
      ...globalMemoryState,
      routes: globalMemoryState.routes.map((r) =>
        r.id === id ? { ...r, ...updates } : r,
      ),
    };
    commitState(next);
  }, []);

  const deleteRoute = useCallback((id: string) => {
    const next = {
      ...globalMemoryState,
      routes: globalMemoryState.routes.filter((r) => r.id !== id),
    };
    commitState(next);
  }, []);

  // --- Drivers CRUD ---
  const addDriver = useCallback((driver: Omit<Driver, "id" | "tripsCount" | "rating">) => {
    const newDriver: Driver = {
      ...driver,
      id: `drv-${Date.now()}`,
      tripsCount: 0,
      rating: 5.0,
    };
    const next = {
      ...globalMemoryState,
      drivers: [newDriver, ...globalMemoryState.drivers],
    };
    commitState(next);
    return newDriver;
  }, []);

  const updateDriver = useCallback((id: string, updates: Partial<Driver>) => {
    const next = {
      ...globalMemoryState,
      drivers: globalMemoryState.drivers.map((d) =>
        d.id === id ? { ...d, ...updates } : d,
      ),
    };
    commitState(next);
  }, []);

  const deleteDriver = useCallback((id: string) => {
    const next = {
      ...globalMemoryState,
      drivers: globalMemoryState.drivers.filter((d) => d.id !== id),
    };
    commitState(next);
  }, []);

  // --- Aides CRUD ---
  const addAide = useCallback((aide: Omit<Aide, "id">) => {
    const newAide: Aide = {
      ...aide,
      id: `aid-${Date.now()}`,
    };
    const next = {
      ...globalMemoryState,
      aides: [newAide, ...globalMemoryState.aides],
    };
    commitState(next);
    return newAide;
  }, []);

  const updateAide = useCallback((id: string, updates: Partial<Aide>) => {
    const next = {
      ...globalMemoryState,
      aides: globalMemoryState.aides.map((a) =>
        a.id === id ? { ...a, ...updates } : a,
      ),
    };
    commitState(next);
  }, []);

  const deleteAide = useCallback((id: string) => {
    const next = {
      ...globalMemoryState,
      aides: globalMemoryState.aides.filter((a) => a.id !== id),
    };
    commitState(next);
  }, []);

  // --- Parents CRUD ---
  const addParent = useCallback((parent: Omit<Parent, "id">) => {
    const newParent: Parent = {
      ...parent,
      id: `par-${Date.now()}`,
    };
    const next = {
      ...globalMemoryState,
      parents: [newParent, ...globalMemoryState.parents],
    };
    commitState(next);
    return newParent;
  }, []);

  const updateParent = useCallback((id: string, updates: Partial<Parent>) => {
    const next = {
      ...globalMemoryState,
      parents: globalMemoryState.parents.map((p) =>
        p.id === id ? { ...p, ...updates } : p,
      ),
    };
    commitState(next);
  }, []);

  const deleteParent = useCallback((id: string) => {
    const next = {
      ...globalMemoryState,
      parents: globalMemoryState.parents.filter((p) => p.id !== id),
    };
    commitState(next);
  }, []);

  // --- Students CRUD ---
  const addStudent = useCallback((student: Omit<Student, "id">) => {
    const newStudent: Student = {
      ...student,
      id: `stu-${Date.now()}`,
    };
    const next = {
      ...globalMemoryState,
      students: [newStudent, ...globalMemoryState.students],
    };
    commitState(next);
    return newStudent;
  }, []);

  const updateStudent = useCallback((id: string, updates: Partial<Student>) => {
    const next = {
      ...globalMemoryState,
      students: globalMemoryState.students.map((s) =>
        s.id === id ? { ...s, ...updates } : s,
      ),
    };
    commitState(next);
  }, []);

  const deleteStudent = useCallback((id: string) => {
    const next = {
      ...globalMemoryState,
      students: globalMemoryState.students.filter((s) => s.id !== id),
    };
    commitState(next);
  }, []);

  // --- Users CRUD ---
  const addUser = useCallback((user: Omit<User, "id" | "lastActive" | "createdAt">) => {
    const newUser: User = {
      ...user,
      id: `usr-${Date.now()}`,
      lastActive: "Just now",
      createdAt: new Date().toISOString().split("T")[0],
    };
    const next = {
      ...globalMemoryState,
      users: [newUser, ...globalMemoryState.users],
    };
    commitState(next);
    return newUser;
  }, []);

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    const next = {
      ...globalMemoryState,
      users: globalMemoryState.users.map((u) =>
        u.id === id ? { ...u, ...updates } : u,
      ),
    };
    commitState(next);
  }, []);

  const deleteUser = useCallback((id: string) => {
    const next = {
      ...globalMemoryState,
      users: globalMemoryState.users.filter((u) => u.id !== id),
    };
    commitState(next);
  }, []);

  // --- Schools CRUD (Super Admin) ---
  const addSchool = useCallback((school: Omit<School, "id" | "createdAt">) => {
    const newSchool: School = {
      ...school,
      id: `sch-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    const next = {
      ...globalMemoryState,
      schools: [newSchool, ...globalMemoryState.schools],
    };
    commitState(next);
    return newSchool;
  }, []);

  const updateSchool = useCallback((id: string, updates: Partial<School>) => {
    const next = {
      ...globalMemoryState,
      schools: globalMemoryState.schools.map((s) =>
        s.id === id ? { ...s, ...updates } : s,
      ),
    };
    commitState(next);
  }, []);

  const deleteSchool = useCallback((id: string) => {
    const next = {
      ...globalMemoryState,
      schools: globalMemoryState.schools.filter((s) => s.id !== id),
    };
    commitState(next);
  }, []);

  // Reset to initial demo data
  const resetDemoData = useCallback(() => {
    const fresh: StoreState = {
      schools: initialSchools,
      vehicles: initialVehicles,
      routes: initialRoutes,
      drivers: initialDrivers,
      aides: initialAides,
      parents: initialParents,
      students: initialStudents,
      users: initialUsers,
      trips: initialTrips,
      subscription: initialSubscription,
      invoices: initialInvoices,
      currentRole: "school_admin",
      currentSchoolId: "sch-1",
    };
    commitState(fresh);
  }, []);

  return {
    ...state,
    currentSchool: state.schools.find((s) => s.id === state.currentSchoolId) || state.schools[0],
    switchRole,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    addRoute,
    updateRoute,
    deleteRoute,
    addDriver,
    updateDriver,
    deleteDriver,
    addAide,
    updateAide,
    deleteAide,
    addParent,
    updateParent,
    deleteParent,
    addStudent,
    updateStudent,
    deleteStudent,
    addUser,
    updateUser,
    deleteUser,
    addSchool,
    updateSchool,
    deleteSchool,
    resetDemoData,
  };
}
