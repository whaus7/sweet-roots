import { ContactForm } from "./ContactForm";

export function ContactBand() {
  return (
    <section className="bg-[#fcfcfc]" aria-label="Get in touch">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md sm:p-8">
          <ContactForm
            heading="Get in touch"
            subheading="Tell us about your yard. We install raised beds in Bellevue — we don't ship panels."
            source="home"
          />
        </div>
      </div>
    </section>
  );
}
