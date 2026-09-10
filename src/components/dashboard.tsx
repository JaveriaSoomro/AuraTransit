export function Dashboard() {
  return (
    <section id="product" className="px-3 pt-8 pb-20 sm:px-5 sm:pt-10 sm:pb-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.24em] text-teal">
              PRODUCT EXPERIENCE
            </p>
            <h2 className="mt-4 max-w-[16ch] text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              A calm operations view for every active journey.
            </h2>
          </div>
          <a
            href="/admin"
            className="inline-flex items-center gap-2 rounded-full bg-teal px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-teal/90 w-fit shrink-0"
          >
            <span>Launch Live Dashboard</span>
            <span>→</span>
          </a>
        </div>

        <div className="mt-12 overflow-hidden rounded-[32px] border border-white/40 bg-[#102f34] shadow-[0_40px_80px_rgba(24,50,56,0.22)] sm:rounded-[40px]">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-sun" />
            <span className="h-2.5 w-2.5 rounded-full bg-aura" />
            <span className="ml-3 rounded-full bg-white/8 px-3 py-1 text-[11px] text-ivory/55">
              app.auratransit.com / operations
            </span>
          </div>

          <div className="grid gap-0 lg:grid-cols-[220px_1fr_280px]">
            <aside className="hidden space-y-1 border-r border-white/10 p-4 lg:block">
              {["Overview", "Live routes", "Students", "Drivers", "Alerts"].map(
                (item, i) => (
                  <div
                    key={item}
                    className={`rounded-full px-4 py-2.5 text-sm ${i === 1 ? "bg-sun text-ink" : "text-ivory/70"}`}
                  >
                    {item}
                  </div>
                ),
              )}
            </aside>

            <div className="p-4 sm:p-6">
              <div className="mb-4 flex flex-wrap gap-2">
                {[
                  ["Active routes", "12"],
                  ["Students on board", "286"],
                  ["On time", "11"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-white/6 px-4 py-3">
                    <p className="text-[10px] tracking-[0.16em] text-ivory/45">
                      {label.toUpperCase()}
                    </p>
                    <p className="text-2xl font-semibold text-ivory">{value}</p>
                  </div>
                ))}
              </div>

              <div className="relative h-[280px] overflow-hidden rounded-[28px] bg-[#0c3d43] sm:h-[340px]">
                <svg viewBox="0 0 640 340" className="h-full w-full">
                  <path d="M0 180 H640" stroke="#1a5c63" strokeWidth="12" />
                  <path d="M160 0 V340" stroke="#1a5c63" strokeWidth="10" />
                  <path d="M420 0 V340" stroke="#174f55" strokeWidth="8" />
                  <path
                    className="route-path"
                    d="M40 280 C140 280, 160 90, 310 110 S470 250, 610 70"
                    stroke="#F4C95D"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="70" cy="272" r="8" fill="#78B89A" />
                  <circle cx="310" cy="110" r="10" fill="#F4C95D" />
                  <circle cx="610" cy="70" r="8" fill="#78B89A" />
                </svg>
                <div className="absolute top-4 left-4 rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-ink">
                  Route 04 · North loop
                </div>
              </div>
            </div>

            <aside className="space-y-3 border-t border-white/10 p-4 lg:border-l lg:border-t-0">
              <p className="text-[11px] tracking-[0.18em] text-ivory/45">UPCOMING STOPS</p>
              {[
                ["Maple Ave", "8:19"],
                ["Cedar Hill", "8:24"],
                ["West Gate", "8:31"],
              ].map(([stop, time]) => (
                <div key={stop} className="rounded-2xl bg-white/6 px-3 py-3">
                  <p className="text-sm text-ivory">{stop}</p>
                  <p className="text-xs text-sun">{time}</p>
                </div>
              ))}
              <div className="rounded-2xl bg-aura/20 px-3 py-3">
                <p className="text-[11px] tracking-[0.16em] text-aura">ALERT</p>
                <p className="text-sm text-ivory">No delays on morning routes.</p>
              </div>
              <div className="rounded-2xl bg-white/6 px-3 py-3 text-ivory">
                <p className="text-[11px] text-ivory/45">DRIVER STATUS</p>
                <p className="mt-1 text-sm font-semibold">Ahmed · Trip active</p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
