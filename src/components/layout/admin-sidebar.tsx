"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  Bus,
  GitFork,
  Users,
  UserCheck,
  ShieldCheck,
  HeartHandshake,
  GraduationCap,
  History,
  Settings,
  Building2,
  ArrowLeftRight,
  ExternalLink,
} from "lucide-react";
import { LogoMark } from "@/components/logo";
import { cn } from "@/lib/utils";
import { useAuraStore } from "@/lib/store";

interface SidebarProps {
  portal: "admin" | "super-admin";
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  count?: number;
}

export function AdminSidebar({
  portal,
  mobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const { currentSchool, vehicles, routes, students, currentRole, switchRole } =
    useAuraStore();

  const schoolNavItems: NavItem[] = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    {
      href: "/admin/live-map",
      label: "Live Map",
      icon: MapPin,
      badge: "Live",
      badgeColor: "bg-aura text-[#0c4738]",
    },
    {
      href: "/admin/vehicles",
      label: "Vehicles",
      icon: Bus,
      count: vehicles.length,
    },
    {
      href: "/admin/routes",
      label: "Routes",
      icon: GitFork,
      count: routes.length,
    },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/drivers", label: "Drivers", icon: UserCheck },
    { href: "/admin/aides", label: "Aides", icon: ShieldCheck },
    { href: "/admin/parents", label: "Parents", icon: HeartHandshake },
    {
      href: "/admin/students",
      label: "Students",
      icon: GraduationCap,
      count: students.length,
    },
    { href: "/admin/trips", label: "Trip History", icon: History },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const superAdminNavItems: NavItem[] = [
    { href: "/super-admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/super-admin/schools", label: "Schools", icon: Building2 },
    { href: "/super-admin/users", label: "All Users", icon: Users },
    { href: "/super-admin/drivers", label: "Drivers", icon: UserCheck },
    { href: "/super-admin/aides", label: "Aides", icon: ShieldCheck },
    { href: "/super-admin/parents", label: "Parents", icon: HeartHandshake },
    { href: "/super-admin/students", label: "Students", icon: GraduationCap },
    { href: "/super-admin/vehicles", label: "Fleet", icon: Bus },
    { href: "/super-admin/routes", label: "Routes", icon: GitFork },
    { href: "/super-admin/trips", label: "Trips & Audits", icon: History },
    { href: "/super-admin/settings", label: "Platform Settings", icon: Settings },
  ];

  const items = portal === "admin" ? schoolNavItems : superAdminNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 flex w-64 flex-col border-r border-ink/8 bg-white transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand Header */}
        <div className="flex h-18 shrink-0 items-center justify-between border-b border-ink/8 px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark className="h-8 w-8" />
            <div className="flex flex-col">
              <span className="text-[13px] font-bold tracking-[0.14em] text-teal leading-none">
                AURATRANSIT
              </span>
              <span className="mt-1 text-[10px] font-semibold tracking-wider text-ink/45 uppercase">
                {portal === "admin" ? "School Operations" : "Super Admin"}
              </span>
            </div>
          </Link>
        </div>

        {/* Tenant / School Selector pill */}
        <div className="px-4 py-3 border-b border-ink/6 bg-ivory/30">
          {portal === "admin" ? (
            <div className="rounded-2xl border border-ink/8 bg-white p-2.5 shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-teal/10 text-teal shrink-0 font-bold text-xs">
                  LI
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-ink truncate">
                    {currentSchool?.name || "Lincoln Int'l School"}
                  </p>
                  <p className="text-[10px] text-ink/50">Campus #01 · Chicago</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-teal/20 bg-teal/5 p-2.5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-teal text-white shrink-0 font-bold text-xs">
                  SA
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-teal truncate">
                    AuraTransit Network
                  </p>
                  <p className="text-[10px] text-teal/70">Global Telemetry</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {items.map((item) => {
            const isActive =
              item.href === "/admin" || item.href === "/super-admin"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "group flex items-center justify-between rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-teal text-white font-semibold shadow-xs"
                    : "text-ink/70 hover:bg-ivory hover:text-ink",
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition",
                      isActive
                        ? "text-sun"
                        : "text-ink/50 group-hover:text-ink",
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                      item.badgeColor || "bg-sun text-ink",
                    )}
                  >
                    {item.badge}
                  </span>
                )}

                {typeof item.count === "number" && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-ink/6 text-ink/60",
                    )}
                  >
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-ink/8 p-3 bg-ivory/20">
          <Link
            href="/admin/settings"
            className="flex w-full items-center justify-between rounded-2xl border border-ink/10 bg-white px-3 py-2 text-xs font-semibold text-ink/75 hover:bg-ivory hover:text-ink transition"
          >
            <span className="flex items-center gap-2">
              <Settings className="h-3.5 w-3.5 text-teal" />
              <span>School Settings</span>
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}
