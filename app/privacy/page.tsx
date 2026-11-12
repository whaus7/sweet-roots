import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy and SMS disclosure for JördHaus raised bed installation and living-soil services in Redmond, WA.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#00340c] sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Last updated: October 25, 2026
        </p>

        <div className="mt-8 space-y-6 text-base leading-relaxed text-gray-700">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#00340c]">
              1. Information We Collect
            </h2>
            <p>
              JördHaus (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;)
              collects contact details and project notes that you voluntarily
              submit through our website at{" "}
              <Link href="/" className="font-semibold text-[#00340c] underline">
                www.jordhaus.com
              </Link>
              , including your name, email address, phone number, and messages
              sent through our contact form or live site chat widget.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#00340c]">
              2. How We Use Your Information
            </h2>
            <p>
              We use the information you provide solely to respond to your
              inquiries, schedule consultations, prepare quotes, and coordinate
              raised-bed installation or living-soil services in the Redmond,
              WA area.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#00340c]">
              3. SMS &amp; Text Messaging Privacy
            </h2>
            <p>
              If you provide your phone number and opt in to receive SMS text
              messages from JördHaus (or initiate a text or web-chat
              conversation with us), we use your phone number only for
              conversational customer support, scheduling, and service updates
              related to your inquiry.
            </p>
            <p className="font-semibold text-[#171717]">
              No mobile information will be shared with third parties or
              affiliates for marketing or promotional purposes. Text messaging
              originator opt-in data and consent will not be shared with any
              third parties, except for aggregator and telecommunications
              providers necessary to deliver the text messaging service.
            </p>
            <p>
              You may opt out of SMS messages at any time by replying{" "}
              <strong>STOP</strong> to any message we send, or reply{" "}
              <strong>HELP</strong> for assistance. Message frequency varies by
              conversation. Message and data rates may apply.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#00340c]">
              4. Cookies &amp; Analytics
            </h2>
            <p>
              We use functional cookies (such as a temporary session identifier
              when you use our on-site chat widget) and standard analytics to
              understand website traffic and keep the site working properly.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#00340c]">5. Contact Us</h2>
            <p>
              For questions about this Privacy Policy or your personal
              information, contact JördHaus at{" "}
              <a
                href="mailto:contact@jordhaus.com"
                className="font-semibold text-[#00340c] underline"
              >
                contact@jordhaus.com
              </a>{" "}
              or call{" "}
              <a
                href="tel:3124151093"
                className="font-semibold text-[#00340c] underline"
              >
                312-415-1093
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
