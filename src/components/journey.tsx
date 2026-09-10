"use client";

import Image from "next/image";
import { photos } from "@/lib/media";

const nodes = [
  {
    label: "SCHOOL",
    title: "Campus operations",
    copy: "One operational picture for every departure and arrival.",
    image: photos.campus,
  },
  {
    label: "DRIVER",
    title: "Guided journeys",
    copy: "Clear stops, student lists and live status in the cab.",
    image: photos.driver,
  },
  {
    label: "ROUTE",
    title: "Live movement",
    copy: "See where each route is, and what happens next.",
    image: photos.road,
  },
  {
    label: "PARENT",
    title: "Family confidence",
    copy: "Pickup, boarding and arrival, shared at the right moment.",
    image: photos.parent,
  },
];

export function Journey() {
  return (
    <section className="px-3 pb-8 sm:px-5">
      <div className="mx-auto max-w-[1280px]">
        <p className="mb-6 px-3 text-sm text-ink/55">One journey. Every connection.</p>
        <div className="journey-scroll flex gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
          {nodes.map((node) => (
            <article
              key={node.label}
              className="group relative min-h-[320px] min-w-[240px] overflow-hidden rounded-[36px] bg-teal"
            >
              <Image
                src={node.image}
                alt={node.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/50 transition-colors duration-500 group-hover:bg-black/20" />
              <div className="relative z-10 flex h-full min-h-[320px] flex-col justify-between p-7 text-white">
                <p className="text-[11px] font-bold tracking-[0.22em] text-sun drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {node.label}
                </p>
                <div>
                  <h3 className="text-2xl font-bold leading-tight tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {node.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 font-medium text-white/95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    {node.copy}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
