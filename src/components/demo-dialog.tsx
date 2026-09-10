"use client";

import { FormEvent, useState } from "react";

export function DemoDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-[#183238]/45 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-[32px] bg-ivory p-7 shadow-[0_30px_80px_rgba(24,50,56,0.22)] sm:p-9"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-[11px] font-semibold tracking-[0.22em] text-teal">
          REQUEST A DEMO
        </p>
        <h2 className="mt-3 text-3xl font-semibold leading-[1.1] tracking-tight text-ink">
          See AuraTransit in your school.
        </h2>
        {sent ? (
          <p className="mt-5 text-[15px] leading-7 text-ink/70">
            Thank you. A member of the AuraTransit team will be in touch to
            walk through the platform with you.
          </p>
        ) : (
          <form className="mt-6 grid gap-3" onSubmit={onSubmit}>
            <input
              required
              name="name"
              placeholder="Your name"
              className="h-12 rounded-full border border-teal/15 bg-white px-5 text-sm outline-none focus:border-teal"
            />
            <input
              required
              name="school"
              placeholder="School or district"
              className="h-12 rounded-full border border-teal/15 bg-white px-5 text-sm outline-none focus:border-teal"
            />
            <input
              required
              type="email"
              name="email"
              placeholder="Work email"
              className="h-12 rounded-full border border-teal/15 bg-white px-5 text-sm outline-none focus:border-teal"
            />
            <button
              type="submit"
              className="mt-2 h-12 rounded-full bg-sun text-sm font-semibold text-ink transition hover:brightness-95"
            >
              Request a Demo →
            </button>
          </form>
        )}
        <button
          type="button"
          onClick={onClose}
          className="mt-4 text-sm text-ink/50 hover:text-ink"
        >
          Close
        </button>
      </div>
    </div>
  );
}
