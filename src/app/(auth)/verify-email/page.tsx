"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { MailCheck, CheckCircle2, ArrowRight, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length < 6) {
      showToast("Please enter the complete 6-digit code.", "error");
      return;
    }
    setIsVerified(true);
    showToast("Email successfully verified. Welcome to AuraTransit!");
    setTimeout(() => {
      router.push("/login");
    }, 1800);
  };

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      showToast("A new 6-digit verification code has been dispatched.");
    }, 1000);
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
        <div className="rounded-[36px] border border-ink/8 bg-white p-7 sm:p-9 shadow-xl text-center space-y-6">
          {isVerified ? (
            <div className="space-y-4 py-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-aura/20 text-teal">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-ink">
                Account verified
              </h2>
              <p className="text-xs text-ink/65 leading-relaxed">
                Your school administration workspace is now active. Redirecting you to sign in...
              </p>
              <Link href="/login" className="inline-block mt-2">
                <Button variant="primary" size="md" icon={<ArrowRight className="h-4 w-4" />}>
                  Go to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal/10 text-teal">
                <MailCheck className="h-8 w-8" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-ink">
                  Check your inbox
                </h2>
                <p className="text-xs text-ink/65 leading-relaxed">
                  We sent a 6-digit authorization code to your institutional email. Enter it below to activate your account.
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-5">
                <div className="flex justify-center gap-2">
                  {code.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputsRef.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="h-12 w-11 rounded-2xl border border-ink/15 bg-ivory/50 text-center font-mono text-lg font-bold text-ink focus:border-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all"
                    />
                  ))}
                </div>

                <Button type="submit" variant="primary" size="md" className="w-full py-3">
                  Verify & Continue
                </Button>
              </form>

              <div className="border-t border-ink/8 pt-4 flex items-center justify-between text-xs text-ink/55">
                <span>Didn&apos;t get a code?</span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="font-semibold text-teal hover:underline inline-flex items-center gap-1"
                >
                  <RefreshCw className={`h-3 w-3 ${isResending ? "animate-spin" : ""}`} />
                  <span>Resend code</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
