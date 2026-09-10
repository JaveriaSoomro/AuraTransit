"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/logo";
import { Input } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, ShieldCheck, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const strengthScore = [hasLength, hasUpper, hasNumber].filter(Boolean).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasLength || !hasUpper || !hasNumber) {
      showToast("Please meet all security requirements.", "error");
      return;
    }
    if (password !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    setIsSuccess(true);
    showToast("Password successfully reset.");
    setTimeout(() => {
      router.push("/login");
    }, 2000);
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
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="rounded-[36px] border border-ink/8 bg-white p-7 sm:p-9 shadow-xl space-y-5">
          {isSuccess ? (
            <div className="text-center space-y-4 py-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-aura/20 text-teal">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-ink">
                Password updated
              </h2>
              <p className="text-xs text-ink/65 leading-relaxed">
                Your password has been changed securely. Redirecting you to sign in...
              </p>
              <Link href="/login" className="inline-block mt-2">
                <Button variant="primary" size="md" icon={<ArrowRight className="h-4 w-4" />}>
                  Sign in with new password
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                  Set new password
                </h2>
                <p className="mt-1 text-xs text-ink/55">
                  Protect your school operations account with a strong password
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex gap-1.5 h-1.5">
                      <div
                        className={`flex-1 rounded-full transition-colors ${
                          strengthScore >= 1 ? "bg-amber-400" : "bg-ink/10"
                        }`}
                      />
                      <div
                        className={`flex-1 rounded-full transition-colors ${
                          strengthScore >= 2 ? "bg-sun" : "bg-ink/10"
                        }`}
                      />
                      <div
                        className={`flex-1 rounded-full transition-colors ${
                          strengthScore >= 3 ? "bg-aura" : "bg-ink/10"
                        }`}
                      />
                    </div>
                    <div className="space-y-1 pt-1 text-[11px] text-ink/60">
                      <div className="flex items-center gap-1.5">
                        {hasLength ? (
                          <Check className="h-3 w-3 text-aura font-bold" />
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-ink/30 ml-0.5 mr-1" />
                        )}
                        <span>8+ characters</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {hasUpper ? (
                          <Check className="h-3 w-3 text-aura font-bold" />
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-ink/30 ml-0.5 mr-1" />
                        )}
                        <span>At least one uppercase letter</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {hasNumber ? (
                          <Check className="h-3 w-3 text-aura font-bold" />
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-ink/30 ml-0.5 mr-1" />
                        )}
                        <span>At least one number</span>
                      </div>
                    </div>
                  </div>
                )}

                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                {confirmPassword.length > 0 && !passwordsMatch && (
                  <p className="text-[11px] text-red-500 font-medium">
                    Passwords do not match yet.
                  </p>
                )}

                <Button type="submit" variant="primary" className="w-full py-3 mt-2">
                  Update Password & Sign In
                </Button>
              </form>

              <div className="border-t border-ink/8 pt-4 text-center">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-teal hover:underline"
                >
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
