"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/logo";
import { Input } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { useAuraStore } from "@/lib/store";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { switchRole } = useAuraStore();
  const [email, setEmail] = useState("j.hayes@lincoln.edu");
  const [password, setPassword] = useState("••••••••••••");
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    switchRole("school_admin");
    router.push("/admin");
  };

  const handleQuickSchoolAdmin = () => {
    switchRole("school_admin");
    router.push("/admin");
  };

  const handleQuickSuperAdmin = () => {
    switchRole("super_admin");
    router.push("/super-admin");
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <LogoMark className="h-10 w-10" />
          <span className="text-xl font-bold tracking-[0.16em] text-teal">
            AURATRANSIT
          </span>
        </Link>
        <h2 className="mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-ink">
          Welcome back
        </h2>
        <p className="mt-1 text-sm text-ink/55">
          Sign in to your school transportation operations center
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="rounded-[36px] border border-ink/8 bg-white p-7 sm:p-9 shadow-xl space-y-6">
          {/* Quick Demo Access Bar */}
          <div className="rounded-2xl bg-teal/6 border border-teal/15 p-3.5 text-xs text-ink space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-teal">
              <Sparkles className="h-3.5 w-3.5 text-sun" />
              <span>Instant Review Mode</span>
            </div>
            <p className="text-ink/65 text-[11px]">
              Explore either administrative perspective with one click:
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleQuickSchoolAdmin}
                className="flex-1 rounded-xl bg-teal text-white py-1.5 px-2 text-xs font-semibold hover:bg-teal-deep transition"
              >
                School Admin
              </button>
              <button
                type="button"
                onClick={handleQuickSuperAdmin}
                className="flex-1 rounded-xl bg-sun text-ink py-1.5 px-2 text-xs font-semibold hover:brightness-95 transition"
              >
                Super Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Work Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@school.edu"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none text-ink/75">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-teal focus:ring-teal"
                />
                <span>Remember this workstation</span>
              </label>

              <Link
                href="/forgot-password"
                className="font-semibold text-teal hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3"
              icon={<ArrowRight className="h-4 w-4" />}
            >
              Sign In to Operations
            </Button>
          </form>

          <div className="relative border-t border-ink/8 pt-5 text-center">
            <p className="text-xs text-ink/50">
              Need a school account?{" "}
              <Link
                href="/register"
                className="font-semibold text-teal hover:underline"
              >
                Register your school
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
