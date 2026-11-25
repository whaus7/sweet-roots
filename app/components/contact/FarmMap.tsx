import { site } from "@/app/lib/site";

const EMBED_SRC = `https://maps.google.com/maps?q=${encodeURIComponent(
  `${site.name}, ${site.street}, ${site.city}, ${site.region} ${site.postalCode}`,
)}&z=15&output=embed`;

export function FarmMap() {
  return (
    <section className="bg-[#fcfcfc] px-4 pb-16 sm:px-6 lg:px-8" aria-label="Farm map">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-lg border border-[#00340c]/10 bg-white shadow-sm">
        <iframe
          title={`${site.name} on Google Maps`}
          src={EMBED_SRC}
          className="h-[22rem] w-full border-0 sm:h-[28rem]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
