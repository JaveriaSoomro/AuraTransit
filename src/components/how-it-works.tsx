const steps = [
  {
    title: "PLAN",
    copy: "Set up routes, students, drivers and schedules.",
    node: "bg-aura",
  },
  {
    title: "CONNECT",
    copy: "Keep schools, transportation teams and families connected.",
    node: "bg-sun",
  },
  {
    title: "MOVE",
    copy: "Monitor every journey from pickup to arrival.",
    node: "bg-aura",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-3 pt-20 pb-8 sm:px-5 sm:pt-28 sm:pb-10">
      <div className="mx-auto max-w-[1280px]">
        <p className="text-[11px] font-semibold tracking-[0.24em] text-teal">
          HOW IT WORKS
        </p>
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          Plan. Connect. Move.
        </h2>

        <div className="mt-12 rounded-[36px] bg-white px-6 py-10 sm:px-10">
          <div className="relative hidden h-4 lg:block">
            <div className="absolute top-1/2 right-[16.67%] left-[16.67%] -translate-y-1/2 border-t-2 border-dashed border-teal/70" />
            <div className="grid h-full grid-cols-3">
              {steps.map((step) => (
                <div key={step.title} className="flex items-center justify-center">
                  <span
                    className={`relative z-10 h-3.5 w-3.5 rounded-full ring-[5px] ring-white ${step.node}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-3 lg:gap-8">
            {steps.map((step) => (
              <article key={step.title} className="lg:text-center">
                <div className="mb-4 flex items-center gap-3 lg:hidden">
                  <span className={`h-3.5 w-3.5 rounded-full ${step.node}`} />
                  <h3 className="text-3xl font-semibold tracking-tight">{step.title}</h3>
                </div>
                <h3 className="hidden text-3xl font-semibold tracking-tight lg:block">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[28ch] text-[15px] leading-7 text-ink/65 lg:mx-auto">
                  {step.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
