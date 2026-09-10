"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/logo";
import { Input } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, MapPin, Bell, Bus, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      showToast("Please accept the terms of service.", "error");
      return;
    }
    showToast("School workspace created! Sending verification email...");
    router.push("/verify-email");
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <LogoMark className="h-10 w-10" />
            <span className="text-xl font-bold tracking-[0.16em] text-teal">
              AURATRANSIT
            </span>
          </Link>
        </div>

        {/* 2-Column Card */}
        <div className="rounded-[40px] border border-ink/8 bg-white shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Form */}
          <div className="p-7 sm:p-10 lg:col-span-7 flex flex-col justify-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                Connect your school
              </h2>
              <p className="mt-1.5 text-xs text-ink/55">
                Start your 30-day complimentary district trial. No credit card required.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <Input
                label="Educational Institution"
                placeholder="e.g. Oakridge Prep Academy"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Administrator Name"
                  placeholder="e.g. Dr. Emily Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Institutional Email"
                  type="email"
                  placeholder="e.vance@oakridge.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Account Password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-ink/20 text-teal focus:ring-teal/20"
                />
                <label htmlFor="terms" className="text-xs text-ink/65 select-none leading-normal">
                  I agree to the AuraTransit{" "}
                  <span className="text-teal underline cursor-pointer">Terms of Service</span> and{" "}
                  <span className="text-teal underline cursor-pointer">Student Data Privacy Policy</span>.
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-3.5 mt-2"
                icon={<ArrowRight className="h-4 w-4" />}
              >
                Launch School Workspace
              </Button>
            </form>

            <div className="border-t border-ink/8 pt-5 mt-6 text-center">
              <p className="text-xs text-ink/55">
                Already registered with AuraTransit?{" "}
                <Link href="/login" className="font-semibold text-teal hover:underline">
                  Sign in to operations
                </Link>
              </p>
            </div>
          </div>

          {/* Right: Feature Highlights (Brand Ivory) */}
          <div className="bg-[#102f34] text-white p-7 sm:p-10 lg:col-span-5 flex flex-col justify-between relative overflow-hidden">
            {/* Ambient pattern */}
            <div className="absolute inset-0 bg-radial from-teal/30 via-transparent to-transparent opacity-40 pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-sun">
                <span>Enterprise Transit Suite</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold leading-tight">
                Designed for calm, accountable school transit.
              </h3>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3 text-xs">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal/50 text-sun shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Real-Time GPS Ingest</p>
                    <p className="text-white/70 mt-0.5 leading-relaxed">
                      Sub-second bus telemetry with interactive corridor views.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal/50 text-sun shrink-0">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Parent Boarding Alerts</p>
                    <p className="text-white/70 mt-0.5 leading-relaxed">
                      Automated push & SMS notifications the moment students board.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal/50 text-sun shrink-0">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Driver & Compliance Audit</p>
                    <p className="text-white/70 mt-0.5 leading-relaxed">
                      Maintain CDL certificates, background checks, and state logs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 border-t border-white/10 pt-6 mt-8">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full bg-sun text-ink font-bold text-xs flex items-center justify-center border-2 border-[#102f34]">
                    LH
                  </div>
                  <div className="h-8 w-8 rounded-full bg-aura text-ink font-bold text-xs flex items-center justify-center border-2 border-[#102f34]">
                    EV
                  </div>
                  <div className="h-8 w-8 rounded-full bg-white text-teal font-bold text-xs flex items-center justify-center border-2 border-[#102f34]">
                    40+
                  </div>
                </div>
                <p className="text-xs text-white/80">
                  Trusted by 40+ leading public & independent districts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
