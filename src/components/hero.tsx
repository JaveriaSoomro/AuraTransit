"use client";

import Image from "next/image";
import { photos } from "@/lib/media";

export function Hero({ onDemo }: { onDemo: () => void }) {
  return (
    <section className="px-3 pt-24 sm:px-5 sm:pt-28">
      <div className="mx-auto grid max-w-[1280px] gap-3 lg:grid-cols-[1.15fr_0.85fr] lg:gap-3">
        <div className="reveal relative overflow-hidden rounded-[36px] bg-teal px-7 py-10 text-ivory sm:rounded-[48px] sm:px-12 sm:py-14 lg:min-h-[640px]">
          <p className="text-[11px] font-semibold tracking-[0.24em] text-aura">
            SCHOOL TRANSPORTATION, CONNECTED
          </p>
          <h1 className="mt-6 max-w-[14ch] text-[2.5rem] font-semibold leading-[0
          
          ] tracking-[-0.04em] sm:text-6xl lg:text-[3.9rem]">
            Every student journey, visible from pickup to arrival.
          </h1>
          <p className="mt-6 max-w-md text-[16px] leading-7 text-ivory/78 sm:text-lg">
            Bring schools, parents, drivers and students into one calm,
            connected transportation system.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onDemo}
              className="rounded-full bg-sun px-6 py-3.5 text-sm font-semibold text-ink transition hover:brightness-95"
            >
              Request a Demo
            </button>
            <a
              href="#how-it-works"
              className="rounded-full border border-ivory/25 px-6 py-3.5 text-sm font-semibold text-ivory transition hover:bg-ivory/10"
            >
              See How It Works
            </a>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[photos.parent, photos.students, photos.driver].map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full border-2 border-teal object-cover"
                />
              ))}
            </div>
            <p className="text-xs leading-5 text-ivory/70">
              Schools, families and drivers
              <br />
              in one shared view
            </p>
          </div>
        </div>

        <div className="reveal reveal-d2 relative min-h-[460px] overflow-hidden rounded-[36px] sm:rounded-[48px] lg:min-h-[640px]">
          <Image
            src="/photos/bus.jpg"
            alt="Students traveling together on a calm morning route"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 42vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#183238]/35 via-transparent to-[#145C63]/10" />

          <div className="float-card absolute top-6 left-5 rounded-[22px] bg-white/95 p-4 shadow-[0_16px_40px_rgba(24,50,56,0.16)] sm:top-8 sm:left-6">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-teal/60">
              LIVE ROUTE
            </p>
            <p className="mt-1 text-base font-semibold text-ink">Route 04</p>
            <p className="mt-1 flex items-center gap-2 text-xs text-ink/60">
              <span className="h-2 w-2 rounded-full bg-aura" />
              On schedule
            </p>
          </div>

          <div className="float-card-d absolute top-[38%] right-4 rounded-[22px] bg-white p-4 shadow-[0_16px_40px_rgba(24,50,56,0.16)] sm:right-6">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-teal/60">
              STUDENT
            </p>
            <p className="mt-1 text-sm font-semibold text-ink">Emma has boarded</p>
            <p className="mt-1 text-xs text-aura">Pickup complete</p>
          </div>

          <div className="absolute bottom-6 left-5 right-5 flex flex-wrap gap-3 sm:bottom-8 sm:left-6">
            <div className="rounded-[22px] bg-white/95 px-4 py-3 shadow-md">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-teal/60">
                ARRIVAL
              </p>
              <p className="text-sm font-semibold text-ink">School arrival</p>
              <p className="text-xs text-ink/55">8:17 AM</p>
            </div>
            <div className="rounded-[22px] bg-teal px-4 py-3 text-ivory shadow-md">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-sun">
                DRIVER
              </p>
              <p className="text-sm font-semibold">Ahmed</p>
              <p className="text-xs text-ivory/70">Trip active</p>
            </div>
          </div>

          <div className="pulse-dot absolute top-[22%] right-[28%] hidden h-9 w-9 items-center justify-center rounded-full bg-sun text-ink sm:flex">
            →
          </div>
        </div>
      </div>
    </section>
  );
}
