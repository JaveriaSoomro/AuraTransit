"use client";

import React, { useState } from "react";
import {
  Shield,
  Key,
  Globe,
  Bell,
  Save,
  CheckCircle2,
  Lock,
  User,
  RotateCcw,
  Smartphone,
  Laptop,
  Server,
  Database,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form-field";
import { useAuraStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";

export default function SuperAdminSettingsPage() {
  const { resetDemoData } = useAuraStore();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "notifications" | "preferences" | "system"
  >("profile");

  // Profile fields
  const [name, setName] = useState("AuraTransit Platform Director");
  const [email, setEmail] = useState("admin@auratransit.com");
  const [phone, setPhone] = useState("+1 (800) 555-0100");
  const [department, setDepartment] = useState("Platform Systems & Fleet Operations");

  // Security
  const [tfaEnabled, setTfaEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");

  // Preferences
  const [timezone, setTimezone] = useState("UTC");
  const [units, setUnits] = useState("imperial");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");

  // Notifications
  const [notifNewSchool, setNotifNewSchool] = useState(true);
  const [notifDelayAlert, setNotifDelayAlert] = useState(true);
  const [notifSystemHealth, setNotifSystemHealth] = useState(true);
  const [notifDriverCert, setNotifDriverCert] = useState(true);

  const handleSave = () => {
    showToast("Global platform configurations saved.");
  };

  const handleResetDemo = () => {
    resetDemoData();
    showToast("Demo environment reset across all school tenants.");
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Platform Settings & Governance"
        description="Global system configuration, multi-tenant security policies, telemetry units, and administrative credentials."
        actions={
          <Button
            variant="primary"
            icon={<Save className="h-4 w-4" />}
            onClick={handleSave}
          >
            Save Settings
          </Button>
        }
      />

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-ink/8 pb-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition whitespace-nowrap ${
            activeTab === "profile"
              ? "bg-teal text-white shadow-xs"
              : "text-ink/60 hover:bg-ivory hover:text-ink"
          }`}
        >
          <User className="h-3.5 w-3.5" />
          <span>Director Profile</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition whitespace-nowrap ${
            activeTab === "security"
              ? "bg-teal text-white shadow-xs"
              : "text-ink/60 hover:bg-ivory hover:text-ink"
          }`}
        >
          <Lock className="h-3.5 w-3.5" />
          <span>Security & 2FA</span>
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition whitespace-nowrap ${
            activeTab === "notifications"
              ? "bg-teal text-white shadow-xs"
              : "text-ink/60 hover:bg-ivory hover:text-ink"
          }`}
        >
          <Bell className="h-3.5 w-3.5" />
          <span>Alert Subscriptions</span>
        </button>

        <button
          onClick={() => setActiveTab("preferences")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition whitespace-nowrap ${
            activeTab === "preferences"
              ? "bg-teal text-white shadow-xs"
              : "text-ink/60 hover:bg-ivory hover:text-ink"
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          <span>Regional & Units</span>
        </button>

        <button
          onClick={() => setActiveTab("system")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition whitespace-nowrap ${
            activeTab === "system"
              ? "bg-teal text-white shadow-xs"
              : "text-ink/60 hover:bg-ivory hover:text-ink"
          }`}
        >
          <Server className="h-3.5 w-3.5" />
          <span>System Environment</span>
        </button>
      </div>

      {/* Tab: Profile */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <div className="rounded-[32px] border border-ink/8 bg-white p-6 sm:p-8 shadow-xs space-y-5">
            <h3 className="text-base font-semibold text-ink">Super Administrator Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Operations Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Direct Operations Line"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Input
                label="Administrative Unit"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab: Security */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <div className="rounded-[32px] border border-ink/8 bg-white p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-teal" />
              <h3 className="text-base font-semibold text-ink">
                Authentication & Tenant Access Policies
              </h3>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-ink/8 bg-ivory/60 p-4">
              <div>
                <p className="text-xs font-bold text-ink">
                  Mandatory 2FA For All School Administrators
                </p>
                <p className="text-[11px] text-ink/55 mt-0.5">
                  Requires hardware FIDO2 key or authenticator app (TOTP) on login
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={tfaEnabled}
                  onChange={(e) => setTfaEnabled(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-ink/20 peer-checked:bg-teal transition-colors peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all" />
              </label>
            </div>

            <div className="space-y-3">
              <span className="font-bold text-xs text-ink block">Active System Sessions</span>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-2xl border border-ink/8 bg-white text-xs">
                  <div className="flex items-center gap-3">
                    <Laptop className="h-4 w-4 text-teal" />
                    <div>
                      <p className="font-semibold text-ink">MacBook Pro · Chrome 124</p>
                      <p className="text-[11px] text-ink/50">Chicago, US · IP 172.56.21.84</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-aura">Current Session</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl border border-ink/8 bg-white text-xs">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-4 w-4 text-ink/60" />
                    <div>
                      <p className="font-semibold text-ink">iPhone 15 Pro · Mobile Safari</p>
                      <p className="text-[11px] text-ink/50">Evanston, US · 2 hours ago</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast("Session revoked.")}
                    className="text-xs text-red-600 hover:underline font-medium"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Notifications */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <div className="rounded-[32px] border border-ink/8 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="text-base font-semibold text-ink">System Broadcasts & Event Subscriptions</h3>
            <p className="text-xs text-ink/55">
              Select which platform alerts trigger automated dispatcher notifications.
            </p>

            <div className="divide-y divide-ink/8">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-ink">New Campus Onboarding</p>
                  <p className="text-[11px] text-ink/50">When a new school or district initiates setup</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifNewSchool}
                  onChange={(e) => setNotifNewSchool(e.target.checked)}
                  className="rounded text-teal h-4 w-4"
                />
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-ink">Severe Corridor Delays (&gt;15 min)</p>
                  <p className="text-[11px] text-ink/50">Urgent notifications when any vehicle is significantly behind schedule</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifDelayAlert}
                  onChange={(e) => setNotifDelayAlert(e.target.checked)}
                  className="rounded text-teal h-4 w-4"
                />
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-ink">Driver Credential Expiry Warning</p>
                  <p className="text-[11px] text-ink/50">Alert 30 days prior to CDL or background clearance expiration</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifDriverCert}
                  onChange={(e) => setNotifDriverCert(e.target.checked)}
                  className="rounded text-teal h-4 w-4"
                />
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-ink">Platform Core Health & GPS Ingest</p>
                  <p className="text-[11px] text-ink/50">Real-time status of IoT telemetry relays</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifSystemHealth}
                  onChange={(e) => setNotifSystemHealth(e.target.checked)}
                  className="rounded text-teal h-4 w-4"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Preferences */}
      {activeTab === "preferences" && (
        <div className="space-y-6">
          <div className="rounded-[32px] border border-ink/8 bg-white p-6 sm:p-8 shadow-xs space-y-5">
            <h3 className="text-base font-semibold text-ink">Localization & Regional Standards</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Platform Reference Timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                options={[
                  { label: "Coordinated Universal Time (UTC)", value: "UTC" },
                  { label: "America/Chicago (CST)", value: "America/Chicago (CST)" },
                  { label: "America/New_York (EST)", value: "America/New_York (EST)" },
                  { label: "America/Los_Angeles (PST)", value: "America/Los_Angeles (PST)" },
                ]}
              />
              <Select
                label="Telemetry & Distance Units"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                options={[
                  { label: "Imperial (Miles / MPH / Gallons)", value: "imperial" },
                  { label: "Metric (Kilometers / KPH / Liters)", value: "metric" },
                ]}
              />
            </div>

            <Select
              label="Standard Date Notation"
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              options={[
                { label: "MM/DD/YYYY (US Standard)", value: "MM/DD/YYYY" },
                { label: "DD/MM/YYYY (International)", value: "DD/MM/YYYY" },
                { label: "YYYY-MM-DD (ISO 8601)", value: "YYYY-MM-DD" },
              ]}
            />
          </div>
        </div>
      )}

      {/* Tab: System Environment */}
      {activeTab === "system" && (
        <div className="space-y-6">
          <div className="rounded-[32px] border border-ink/8 bg-white p-6 sm:p-8 shadow-xs space-y-5">
            <h3 className="text-base font-semibold text-ink">System Maintenance & Demo Controls</h3>
            <p className="text-xs text-ink/55">
              Reset simulator state, refresh mock telemetries, and maintain demo data caches.
            </p>

            <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5 space-y-3">
              <div className="flex items-center gap-2 text-red-800">
                <RotateCcw className="h-4 w-4" />
                <h4 className="font-bold text-xs">Reset All Demo Store State</h4>
              </div>
              <p className="text-xs text-red-700 leading-relaxed">
                This restores all vehicles, drivers, routes, schools, students, and trips back to their initial seeded state. Any manual modifications will be cleared.
              </p>
              <Button
                variant="danger"
                size="sm"
                icon={<RotateCcw className="h-3.5 w-3.5" />}
                onClick={handleResetDemo}
              >
                Reset Demo Environment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
