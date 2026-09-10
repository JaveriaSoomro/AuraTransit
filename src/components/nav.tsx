"use client";

import { useEffect, useState } from "react";
import { Logo } from "./logo";

const links = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
];

export function Nav({ onDemo }: { onDemo: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-3 sm:top-5 sm:px-4">
      <nav
        className={`mx-auto flex w-full max-w-[1180px] items-center justify-between rounded-full bg-white/95 px-3 py-2.5 backdrop-blur-md sm:px-5 ${scrolled ? "nav-shadow" : "shadow-[0_8px_30px_rgba(24,50,56,0.06)]"}`}
      >
        <Logo />
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-1.5 text-[13px] text-ink/70 transition hover:bg-ivory hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <a
            href="/login"
            className="rounded-full px-4 py-2 text-[13px] font-medium text-ink/70 hover:text-ink"
          >
            Log In
          </a>
          <button
            type="button"
            onClick={onDemo}
            className="rounded-full bg-sun px-4 py-2 text-[13px] font-semibold text-ink transition hover:brightness-95"
          >
            Request a Demo
          </button>
        </div>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-ivory text-ink lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Open menu"
        >
          <span className="flex flex-col gap-1">
            <span className="block h-0.5 w-4 bg-ink" />
            <span className="block h-0.5 w-4 bg-ink" />
            <span className="block h-0.5 w-4 bg-ink" />
          </span>
        </button>
      </nav>
      {open && (
        <div className="mx-auto mt-2 max-w-[1180px] rounded-[28px] bg-white p-4 shadow-lg lg:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-4 py-3 text-sm text-ink/80"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDemo();
            }}
            className="mt-2 w-full rounded-full bg-sun py-3 text-sm font-semibold"
          >
            Request a Demo
          </button>
        </div>
      )}
    </header>
  );
}

