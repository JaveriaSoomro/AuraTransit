import Image from "next/image";
import { photos } from "@/lib/media";

function MiniMap() {
  return (
    <svg viewBox="0 0 320 180" className="h-full w-full">
      <rect width="320" height="180" fill="#0f4a50" />
      <path d="M0 110 H320" stroke="#1d6b72" strokeWidth="10" />
      <path d="M80 0 V180" stroke="#1d6b72" strokeWidth="8" />
      <path
        className="route-path"
        d="M18 150 C80 150, 90 40, 170 48 S250 120, 302 42"
        stroke="#F4C95D"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="20" cy="150" r="4.5" fill="#78B89A" />
      <circle cx="150" cy="48" r="7" fill="#F4C95D" />
      <circle cx="300" cy="42" r="4.5" fill="#78B89A" />
    </svg>
  );
}

function RouteNodes() {
  return (
    <svg viewBox="0 0 280 140" className="h-full w-full">
      <path
        className="route-path"
        d="M20 90 C70 90, 70 40, 130 40 S190 110, 260 55"
        stroke="#145C63"
        strokeWidth="3"
        fill="none"
      />
      {[
        [20, 90],
        [130, 40],
        [260, 55],
      ].map(([x, y], i) => (
        <circle key={x} cx={x} cy={y} r={i === 1 ? 8 : 6} fill={i === 1 ? "#F4C95D" : "#78B89A"} />
      ))}
    </svg>
  );
}

export function Features() {
  return (
    <section id="features" className="px-3 py-16 sm:px-5 sm:py-24">
      <div className="mx-auto max-w-[1280px]">
        <p className="text-[11px] font-semibold tracking-[0.24em] text-teal">
          THE PLATFORM
        </p>
        <h2 className="mt-4 max-w-[16ch] text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-ink sm:text-6xl">
          Everything your school needs to move with confidence.
        </h2>

        <div className="mt-12 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <article className="lift overflow-hidden rounded-[36px] bg-teal text-ivory md:col-span-2">
            <div className="grid gap-0 md:grid-cols-2">
              <div className="p-8 sm:p-10">
                <p className="text-[11px] tracking-[0.2em] text-sun">FEATURE 01</p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight">
                  Live Route Tracking
                </h3>
                <p className="mt-3 max-w-sm text-[15px] leading-7 text-ivory/75">
                  Know where every route is, in real time.
                </p>
              </div>
              <div className="h-56 md:h-auto">
                <MiniMap />
              </div>
            </div>
          </article>

          <article className="lift rounded-[36px] bg-white p-7">
            <p className="text-[11px] tracking-[0.2em] text-teal/55">FEATURE 02</p>
            <h3 className="mt-3 text-2xl font-semibold">Student Boarding</h3>
            <p className="mt-2 text-sm leading-6 text-ink/60">
              Keep every student journey visible from pickup to arrival.
            </p>
            <div className="mt-6 rounded-[24px] bg-ivory p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Noah K.</p>
                  <p className="text-xs text-ink/50">Stop 12 · Maple Ave</p>
                </div>
                <span className="rounded-full bg-aura/20 px-3 py-1 text-xs font-semibold text-teal">
                  Boarded
                </span>
              </div>
            </div>
          </article>

          <article className="lift rounded-[36px] bg-white p-7">
            <p className="text-[11px] tracking-[0.2em] text-teal/55">FEATURE 03</p>
            <h3 className="mt-3 text-2xl font-semibold">Parent Communication</h3>
            <p className="mt-2 text-sm leading-6 text-ink/60">
              Give families the information they need, exactly when they need it.
            </p>
            <div className="mt-6 rounded-[24px] border border-teal/10 bg-ivory p-4">
              <p className="text-[10px] tracking-[0.16em] text-teal/50">ARRIVAL UPDATE</p>
              <p className="mt-1 text-sm font-semibold">Lina is 4 minutes from school.</p>
            </div>
          </article>

          <article className="lift relative min-h-[280px] overflow-hidden rounded-[36px]">
            <Image src={photos.driver} alt="" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#183238]/85 via-[#183238]/40 to-[#145C63]/25" />
            <div className="relative flex h-full flex-col justify-between p-7 text-ivory">
              <p className="text-[11px] tracking-[0.2em] text-sun">FEATURE 04</p>
              <div>
                <h3 className="text-2xl font-semibold">Driver Management</h3>
                <p className="mt-2 text-sm leading-6 text-ivory/80">
                  Keep drivers, routes and schedules organized in one place.
                </p>
              </div>
            </div>
          </article>

          <article className="lift rounded-[36px] bg-mist p-7">
            <p className="text-[11px] tracking-[0.2em] text-teal/55">FEATURE 05</p>
            <h3 className="mt-3 text-2xl font-semibold">Smart Route Management</h3>
            <p className="mt-2 text-sm leading-6 text-ink/60">
              Plan and manage routes with greater clarity and less complexity.
            </p>
            <div className="mt-4 h-28">
              <RouteNodes />
            </div>
          </article>

          <article className="lift rounded-[36px] bg-white p-7 md:col-span-2 xl:col-span-1">
            <p className="text-[11px] tracking-[0.2em] text-teal/55">FEATURE 06</p>
            <h3 className="mt-3 text-2xl font-semibold">School Operations</h3>
            <p className="mt-2 text-sm leading-6 text-ink/60">
              Give transportation teams one clear operational view.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {["12 active routes", "348 students", "0 delays", "All clear"].map(
                (item) => (
                  <div key={item} className="rounded-2xl bg-ivory px-3 py-3 text-xs font-medium">
                    {item}
                  </div>
                ),
              )}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
