import Image from "next/image";
import { photos } from "@/lib/media";

export function BrandStatement() {
  return (
    <section className="relative overflow-hidden px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-[920px] text-center">
        <p className="text-[11px] font-semibold tracking-[0.24em] text-teal">
          ONE CONNECTED JOURNEY
        </p>
        <h2 className="mt-5 text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-ink sm:text-6xl">
          Everything that happens on the route, in one clear view.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-ink/65 sm:text-lg">
          AuraTransit brings transportation teams, schools, drivers and families
          together so everyone knows what’s happening, when it’s happening,
          and what comes next.
        </p>
      </div>

      <Image
        src={photos.students}
        alt=""
        width={92}
        height={92}
        className="absolute top-16 left-[8%] hidden h-[92px] w-[92px] rounded-full object-cover lg:block"
      />
      <Image
        src={photos.parent}
        alt=""
        width={72}
        height={72}
        className="absolute right-[12%] top-24 hidden h-[72px] w-[72px] rounded-full object-cover lg:block"
      />
      <div className="pulse-dot absolute bottom-16 left-[18%] hidden h-4 w-4 rounded-full bg-sun lg:block" />
      <div className="absolute right-[22%] bottom-20 hidden h-3 w-3 rounded-full bg-aura lg:block" />
      <Image
        src={photos.campus}
        alt=""
        width={58}
        height={58}
        className="absolute bottom-12 right-[8%] hidden h-[58px] w-[58px] rounded-full object-cover lg:block"
      />
    </section>
  );
}
