export function Cta({ onDemo }: { onDemo: () => void }) {
  return (
    <section className="px-3 py-10 sm:px-5 sm:py-16">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-8 rounded-[40px] bg-teal px-8 py-12 text-ivory sm:rounded-[52px] sm:px-14 sm:py-16 lg:flex-row lg:items-center">
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold leading-[1] tracking-[-0.04em] sm:text-5xl">
            Ready to make school transportation simpler?
          </h2>
          <p className="mt-4 text-base leading-7 text-ivory/75">
            See how AuraTransit can bring your entire transportation operation
            together.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onDemo}
            className="rounded-full bg-sun px-6 py-3.5 text-sm font-semibold text-ink transition hover:brightness-95"
          >
            Request a Demo →
          </button>
          <a
            href="#features"
            className="rounded-full border border-ivory/20 px-6 py-3.5 text-sm font-semibold"
          >
            Explore the Platform
          </a>
        </div>
      </div>
    </section>
  );
}
