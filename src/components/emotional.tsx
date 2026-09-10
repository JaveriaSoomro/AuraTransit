import Image from "next/image";
import { photos } from "@/lib/media";

export function Emotional() {
  return (
    <section className="px-3 py-8 sm:px-5">
      <div className="relative mx-auto min-h-[520px] max-w-[1280px] overflow-hidden rounded-[40px] sm:min-h-[620px] sm:rounded-[56px]">
        <Image
          src={photos.morning}
          alt="A calm morning arrival at school"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#183238]/85 via-[#183238]/50 to-[#145C63]/30" />
        <div className="relative flex min-h-[520px] max-w-3xl flex-col justify-end px-8 py-12 text-ivory sm:min-h-[620px] sm:px-14 sm:py-16">
          <h2 className="text-4xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl">
            Because getting there should feel simple.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-ivory/82 sm:text-lg">
            From the moment a student boards to the moment they arrive at
            school, AuraTransit helps everyone stay informed, connected and
            confident.
          </p>
        </div>
      </div>
    </section>
  );
}
