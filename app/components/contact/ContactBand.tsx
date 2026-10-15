import { ContactForm } from "./ContactForm";

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
    <section className="bg-[#fcfcfc]" aria-label="Get in touch">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)] lg:gap-16">
          <div className="rounded-lg bg-white p-6 shadow-md sm:p-8">
            <ContactForm source={source} />
          </div>

          <aside className="space-y-4 lg:pt-2">
            <Title className="text-2xl font-bold text-[#00340c] sm:text-3xl">
              Contact JördHaus
            </Title>
            <p className="text-gray-700">
              Raised beds and living-soil work in Bellevue. We build on site —
              we do not ship panels.
            </p>
            <ul className="space-y-3 text-base font-semibold text-[#00340c]">
              <li>Bellevue, WA</li>
              <li>
                <a href="tel:3124151093" className="hover:text-[#d4a017]">
                  312-415-1093
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@jordhaus.com"
                  className="hover:text-[#d4a017]"
                >
                  contact@jordhaus.com
                </a>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
