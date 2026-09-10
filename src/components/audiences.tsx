import Image from "next/image";
import { photos } from "@/lib/media";

const audiences = [
  {
    id: "schools",
    kicker: "FOR SCHOOLS",
    title: "More control. Less complexity.",
    image: photos.campus,
    ui: "12 routes ready",
  },
  {
    id: "teams",
    kicker: "FOR TRANSPORTATION TEAMS",
    title: "Every route in one clear view.",
    image: photos.city,
    ui: "Live operations",
  },
  {
    id: "drivers",
    kicker: "FOR DRIVERS",
    title: "Simple tools for every journey.",
    image: photos.driver,
    ui: "Next stop in 3 min",
  },
  {
    id: "parents",
    kicker: "FOR PARENTS",
    title: "Confidence from pickup to arrival.",
    image: photos.parent,
    ui: "Boarded · 8:04 AM",
  },
];

export function Audiences() {
  return (
    <section id="schools" className="px-3 py-8 sm:px-5">
      <div className="mx-auto max-w-[1280px]">
        <p className="text-[11px] font-semibold tracking-[0.24em] text-teal">
          FOR EVERYONE ON THE JOURNEY
        </p>
        <h2 className="mt-4 max-w-[16ch] text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          Designed around the people who make each trip possible.
        </h2>
        <div id="parents" className="mt-10 grid gap-3 md:grid-cols-2">
          {audiences.map((item) => (
            <article
              key={item.id}
              className="lift group relative min-h-[360px] overflow-hidden rounded-[36px] sm:min-h-[420px] sm:rounded-[44px]"
            >
              <Image
                src={item.image}
                alt=""
                fill
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#183238]/85 via-[#183238]/35 to-[#145C63]/25" />
              <div className="absolute top-6 right-6 rounded-full bg-sun px-3 py-2 text-xs font-semibold text-ink">
                {item.ui}
              </div>
              <div className="absolute bottom-8 left-7 right-7 text-ivory">
                <p className="text-[11px] tracking-[0.2em] text-sun">{item.kicker}</p>
                <h3 className="mt-3 text-3xl font-semibold leading-tight">
                  {item.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
