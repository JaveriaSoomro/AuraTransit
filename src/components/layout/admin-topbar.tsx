"use client";

import React, { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  Check,
  LogOut,
  Sliders,
  HelpCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useAuraStore } from "@/lib/store";

interface TopbarProps {
  portal: "admin" | "super-admin";
  onOpenMobileMenu: () => void;
  onOpenGlobalSearch: () => void;
}

export function AdminTopBar({
  portal,
  onOpenMobileMenu,
  onOpenGlobalSearch,
}: TopbarProps) {
  const { currentRole, currentSchool } = useAuraStore();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifications = [
    {
      id: "n-1",
      title: "Route 12 delayed by 6 mins",
      desc: "Fullerton Pkwy road utility lane closure reported.",
      time: "8 mins ago",
      type: "delay",
    },
    {
      id: "n-2",
      title: "BUS-104 boarded 18 students",
      desc: "West Valley corridor stop #3 completed on time.",
      time: "14 mins ago",
      type: "info",
    },
    {
      id: "n-3",
      title: "Driver check-in confirmed",
      desc: "Elena Rostova started Route 01 pre-trip inspection.",
      time: "25 mins ago",
      type: "success",
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-18 w-full items-center justify-between border-b border-ink/8 bg-white/95 px-4 backdrop-blur-md sm:px-8">
      {/* Left side: Hamburger + Search Trigger */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-ivory text-ink hover:bg-ink/5 transition lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search Bar Button */}
        <button
          type="button"
          onClick={onOpenGlobalSearch}
          className="flex items-center gap-2.5 rounded-full border border-ink/10 bg-ivory/70 px-4 py-2 text-xs font-medium text-ink/60 hover:border-teal/30 hover:bg-white hover:text-ink transition shadow-2xs sm:w-80"
        >
          <Search className="h-3.5 w-3.5 text-ink/40" />
          <span className="flex-1 text-left truncate">
            Search vehicles, routes, students, drivers...
          </span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-ink/15 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-ink/40">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right side: Network Status, Notifications, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Network Status Badge (Desktop) */}
        <div className="hidden md:flex items-center gap-2 rounded-full bg-[#78b89a]/15 border border-[#78b89a]/30 px-3 py-1.5 text-xs font-semibold text-[#0c4738]">
          <span className="h-2 w-2 rounded-full bg-[#288f6b] animate-pulse" />
          <span>Live Operations Connected</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen((v) => !v);
              setProfileOpen(false);
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-ink/8 bg-white text-ink/75 hover:bg-ivory hover:text-ink transition shadow-2xs"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-sun border-2 border-white" />
          </button>

          {notificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setNotificationsOpen(false)}
              />
              <div className="absolute right-0 mt-2 z-40 w-84 rounded-[28px] border border-ink/8 bg-white p-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-ink/8 pb-3 px-1">
                  <p className="text-xs font-bold tracking-wider text-ink uppercase">
                    Alerts & Notifications
                  </p>
                  <span className="rounded-full bg-teal/10 px-2 py-0.5 text-[10px] font-semibold text-teal">
                    3 New
                  </span>
                </div>
                <div className="mt-2 space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl p-2.5 hover:bg-ivory/60 transition flex items-start gap-2.5"
                    >
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/10 text-teal">
                        <Clock className="h-3 w-3" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-ink">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-ink/60 mt-0.5 leading-snug">
                          {item.desc}
                        </p>
                        <p className="text-[10px] text-ink/40 mt-1">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileOpen((v) => !v);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2.5 rounded-full border border-ink/8 bg-white py-1.5 pl-2 pr-3.5 hover:bg-ivory transition shadow-2xs"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal text-white text-xs font-bold">
              {portal === "admin" ? "JH" : "SA"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-ink leading-tight">
                {portal === "admin" ? "Dr. Julian Hayes" : "Platform Director"}
              </p>
              <p className="text-[10px] text-ink/50 leading-tight">
                {portal === "admin" ? "School Admin" : "Super Admin"}
              </p>
            </div>
          </button>

          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 mt-2 z-40 w-64 rounded-[28px] border border-ink/8 bg-white p-3 shadow-xl">
                <div className="px-3 py-2 border-b border-ink/8">
                  <p className="text-xs font-semibold text-ink">
                    {portal === "admin" ? "Dr. Julian Hayes" : "Super Admin Director"}
                  </p>
                  <p className="text-[11px] text-ink/50 truncate">
                    {portal === "admin" ? "j.hayes@lincoln.edu" : "admin@auratransit.com"}
                  </p>
                </div>
                <div className="py-1">
                  <a
                    href={portal === "admin" ? "/admin/settings" : "/super-admin/settings"}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-ink/75 hover:bg-ivory hover:text-ink transition"
                  >
                    <Sliders className="h-3.5 w-3.5 text-teal" />
                    <span>Account Settings</span>
                  </a>
                  <a
                    href="/"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-ink/75 hover:bg-ivory hover:text-ink transition"
                  >
                    <HelpCircle className="h-3.5 w-3.5 text-teal" />
                    <span>Support & Documentation</span>
                  </a>
                </div>
                <div className="border-t border-ink/8 pt-1">
                  <a
                    href="/login"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Log Out</span>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
