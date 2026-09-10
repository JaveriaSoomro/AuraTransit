"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { Input } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSent(true);
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
          Reset password
        </h2>
        <p className="mt-1 text-sm text-ink/55">
          Enter your authorized school email to receive reset instructions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="rounded-[36px] border border-ink/8 bg-white p-7 sm:p-9 shadow-xl space-y-5">
          {sent ? (
            <div className="text-center space-y-4 py-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-aura/20 text-teal">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-ink">Check your inbox</h3>
              <p className="text-xs text-ink/65 leading-relaxed">
                We sent a secure password reset link to <strong>{email}</strong>.
              </p>
              <Link href="/login" className="inline-block mt-4">
                <Button variant="secondary" size="sm">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email"
                type="email"
                placeholder="name@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button type="submit" variant="primary" className="w-full py-3">
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="border-t border-ink/8 pt-4 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
