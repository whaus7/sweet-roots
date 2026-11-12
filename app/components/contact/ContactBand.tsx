import { site, streetAddress } from "@/app/lib/site";
import { ContactFormPanel } from "./ContactFormPanel";

type ContactBandProps = {
  source?: "home" | "contact";
  titleAs?: "h1" | "h2";
};

export function ContactBand({
  source = "home",
  titleAs = "h2",
}: ContactBandProps) {
  const Title = titleAs;

  return (
    <section className="overflow-x-clip bg-[#fcfcfc]" aria-label="Get in touch">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)] lg:items-start lg:gap-16">
          <ContactFormPanel source={source} />

          <aside className="space-y-4 lg:pt-2">
            <Title className="text-2xl font-bold text-[#00340c] sm:text-3xl">
              Contact {site.name}
            </Title>
            <p className="text-gray-700">
              Questions about our organic farming, worms, continuous-flow beds, or microgreens? Use the form to email or text an actual human with the chat widget!
            </p>
            <ul className="space-y-3 text-base font-semibold text-[#00340c]">
              <li>
                {site.name}
                {streetAddress() ? (
                  <>
                    <br />
                    {streetAddress()}
                  </>
                ) : null}
                <br />
                {site.city}, {site.region}
              </li>
              <li>
                <a href={`tel:${site.phoneTel}`} className="hover:text-[#d4a017]">
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-[#d4a017]">
                  {site.email}
                </a>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
