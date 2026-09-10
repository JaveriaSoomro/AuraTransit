"use client";

import React, { useState } from "react";
import {
  User,
  Building2,
  CreditCard,
  FileText,
  Shield,
  Download,
  CheckCircle2,
  Save,
  RotateCcw,
} from "lucide-react";
import { useAuraStore } from "@/lib/store";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form-field";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";

export default function SettingsPage() {
  const { currentSchool, subscription, invoices, resetDemoData } = useAuraStore();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    "account" | "school" | "subscription" | "invoices" | "billing"
  >("account");

  // Account form
  const [accountName, setAccountName] = useState("Dr. Julian Hayes");
  const [accountEmail, setAccountEmail] = useState("j.hayes@lincoln.edu");
  const [accountPhone, setAccountPhone] = useState("+1 (312) 555-0192");

  // School form
  const [schoolName, setSchoolName] = useState(
    currentSchool?.name || "Lincoln International School",
  );
  const [schoolAddress, setSchoolAddress] = useState(
    currentSchool?.address || "742 Evergreen Terrace, Chicago, IL 60614",
  );
  const [schoolContact, setSchoolContact] = useState(
    currentSchool?.contactPhone || "+1 (312) 555-0192",
  );
  const [timezone, setTimezone] = useState("America/Chicago (CST)");

  const handleSave = () => {
    showToast("Settings successfully saved.");
  };

  const handleDownloadInvoice = (num: string) => {
    showToast(`Downloading receipt ${num} (PDF)...`);
  };

  const handleReset = () => {
    resetDemoData();
    showToast("Demo environment reset to initial state.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure your administrator profile, school operating parameters, AuraTransit subscription plan, and billing receipts."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<RotateCcw className="h-4 w-4 text-teal" />}
              onClick={handleReset}
            >
              Reset Demo Data
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Save className="h-4 w-4" />}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-ink/8 pb-2">
        {[
          { id: "account", label: "Account Profile", icon: User },
          { id: "school", label: "School Details", icon: Building2 },
          { id: "subscription", label: "Subscription & Usage", icon: Shield },
          { id: "invoices", label: "Invoices & Receipts", icon: FileText },
          { id: "billing", label: "Payment Methods", icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition ${
                isActive
                  ? "bg-teal text-white shadow-xs"
                  : "bg-white border border-ink/8 text-ink/70 hover:bg-ivory hover:text-ink"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Account Profile */}
      {activeTab === "account" && (
        <div className="rounded-[32px] border border-ink/8 bg-white p-6 sm:p-8 shadow-xs max-w-3xl space-y-6">
          <div className="flex items-center gap-4 border-b border-ink/8 pb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal text-white font-bold text-lg">
              JH
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink">
                Administrator Profile
              </h3>
              <p className="text-xs text-ink/50">
                Primary authorized console operator for Lincoln International School
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Full Name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Official Email"
                type="email"
                value={accountEmail}
                onChange={(e) => setAccountEmail(e.target.value)}
              />
              <Input
                label="Direct Mobile"
                value={accountPhone}
                onChange={(e) => setAccountPhone(e.target.value)}
              />
            </div>
            <div className="pt-4 border-t border-ink/8">
              <h4 className="text-sm font-semibold text-ink">
                Security & Authentication
              </h4>
              <p className="text-xs text-ink/50 mt-0.5">
                Two-factor authentication is enforced via Lincoln School District SSO.
              </p>
              <div className="mt-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-aura/20 px-3 py-1 text-xs font-semibold text-[#0c4738]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-aura" />
                  SSO 2FA Active (Google Workspace)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: School Profile */}
      {activeTab === "school" && (
        <div className="rounded-[32px] border border-ink/8 bg-white p-6 sm:p-8 shadow-xs max-w-3xl space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-ink">
              School Institution Profile
            </h3>
            <p className="text-xs text-ink/50">
              Campus information displayed on parent transit passes and dispatch records
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="School Name"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
            />
            <Input
              label="Main Campus Address"
              value={schoolAddress}
              onChange={(e) => setSchoolAddress(e.target.value)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Transportation Desk Phone"
                value={schoolContact}
                onChange={(e) => setSchoolContact(e.target.value)}
              />
              <Select
                label="Local Timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                options={[
                  { label: "America/Chicago (CST)", value: "America/Chicago (CST)" },
                  { label: "America/New_York (EST)", value: "America/New_York (EST)" },
                  { label: "America/Denver (MST)", value: "America/Denver (MST)" },
                  { label: "America/Los_Angeles (PST)", value: "America/Los_Angeles (PST)" },
                ]}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Subscription & Usage */}
      {activeTab === "subscription" && (
        <div className="rounded-[32px] border border-ink/8 bg-white p-6 sm:p-8 shadow-xs max-w-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-ink/8 pb-6">
            <div>
              <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-bold text-teal uppercase tracking-wider">
                {subscription.plan} Plan
              </span>
              <h3 className="text-xl font-bold text-ink mt-2">
                AuraTransit Enterprise Tier
              </h3>
              <p className="text-xs text-ink/55">
                Next scheduled renewal on <strong>{subscription.renewalDate}</strong>
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-ink">
                ${subscription.monthlyAmount}
                <span className="text-xs font-normal text-ink/50"> / month</span>
              </p>
              <span className="text-xs font-semibold text-aura">Active & In Good Standing</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-ink/50">
              Capacity Utilization
            </h4>

            {/* Vehicle meter */}
            <div className="rounded-2xl bg-ivory/60 p-4 border border-ink/6 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-ink">Fleet Transponders</span>
                <span className="text-teal">
                  {subscription.vehiclesUsed} of {subscription.vehiclesLimit} active
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-ink/10 overflow-hidden">
                <div
                  className="h-full bg-teal rounded-full"
                  style={{
                    width: `${(subscription.vehiclesUsed / subscription.vehiclesLimit) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Student meter */}
            <div className="rounded-2xl bg-ivory/60 p-4 border border-ink/6 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-ink">Enrolled Student Riders</span>
                <span className="text-teal">
                  {subscription.studentsUsed} of {subscription.studentsLimit} slots
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-ink/10 overflow-hidden">
                <div
                  className="h-full bg-sun rounded-full"
                  style={{
                    width: `${(subscription.studentsUsed / subscription.studentsLimit) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Invoices & Receipts */}
      {activeTab === "invoices" && (
        <div className="rounded-[32px] border border-ink/8 bg-white p-6 sm:p-8 shadow-xs max-w-3xl space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-ink">
              Billing History & Receipts
            </h3>
            <p className="text-xs text-ink/50">
              Monthly enterprise statements for school district accounts payable
            </p>
          </div>

          <div className="divide-y divide-ink/8">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between py-3.5 text-xs"
              >
                <div>
                  <p className="font-bold text-ink">{inv.number}</p>
                  <p className="text-ink/50">{inv.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono font-bold text-ink">
                    ${inv.amount}.00
                  </span>
                  <StatusBadge status={inv.status} />
                  <button
                    type="button"
                    onClick={() => handleDownloadInvoice(inv.number)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-teal hover:bg-teal/10 transition"
                    title="Download Receipt PDF"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Payment Methods */}
      {activeTab === "billing" && (
        <div className="rounded-[32px] border border-ink/8 bg-white p-6 sm:p-8 shadow-xs max-w-3xl space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-ink">
              Authorized Payment Method
            </h3>
            <p className="text-xs text-ink/50">
              District purchasing card on file for recurring operations tier
            </p>
          </div>

          {/* Masked Card Component */}
          <div className="flex items-center justify-between rounded-2xl border border-ink/10 bg-ivory/60 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-teal text-white font-bold text-xs tracking-wider">
                VISA
              </div>
              <div>
                <p className="font-mono text-sm font-bold text-ink">
                  •••• •••• •••• 4242
                </p>
                <p className="text-[11px] text-ink/50">Expires 10/28 · Default District P-Card</p>
              </div>
            </div>
            <span className="rounded-full bg-teal/10 px-2.5 py-1 text-xs font-semibold text-teal">
              Verified
            </span>
          </div>

          <div className="rounded-2xl border border-ink/8 bg-white p-4 space-y-1 text-xs">
            <span className="text-ink/50 block">Billing Notifications Sent To:</span>
            <span className="font-semibold text-ink">accounts.payable@lincoln.edu</span>
          </div>
        </div>
      )}
    </div>
  );
}
