"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 99, suffix: "%", label: "Route visibility", note: "Illustrative product goal" },
  { value: 24, suffix: "/7", label: "Trip monitoring", note: "Designed coverage" },
  { value: 1, suffix: "", label: "Connected system", note: "One shared picture" },
  { value: 100, suffix: "%", label: "Clearer communication", note: "Replace with live metrics" },
];

function useCount(target: number, start: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const duration = 900;
    const began = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - began) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [start, target]);
  return value;
}

function StatCard({
  value,
  suffix,
  label,
  note,
}: (typeof stats)[number]) {
  const ref = useRef<HTMLElement>(null);
  const [start, setStart] = useState(false);
  const count = useCount(value, start);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStart(true);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      className="rounded-[32px] bg-white px-7 py-8 sm:rounded-[40px] sm:px-8"
    >
      <p className="text-5xl font-semibold tracking-[-0.05em] text-teal sm:text-6xl">
        {count}
        {suffix}
      </p>
      <p className="mt-3 text-lg font-semibold text-ink">{label}</p>
      <p className="mt-1 text-xs tracking-wide text-ink/45">{note}</p>
    </article>
  );
}

export function Trust() {
  return (
    <section className="px-3 py-8 sm:px-5">
      <div className="mx-auto max-w-[1280px] rounded-[40px] bg-mist px-5 py-12 sm:rounded-[48px] sm:px-10 sm:py-16">
        <p className="text-[11px] font-semibold tracking-[0.24em] text-teal">
          DESIGNED FOR CLARITY
        </p>
        <h2 className="mt-3 max-w-[18ch] text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
          A quieter way to understand every journey.
        </h2>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={labelKey(stat.label)} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

function labelKey(label: string) {
  return label;
}
