import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and Conditions and SMS messaging terms for JördHaus raised bed installation and living-soil services in Redmond, WA.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#00340c] sm:text-4xl">
          Terms &amp; Conditions
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Last updated: October 25, 2026
        </p>

        <div className="mt-8 space-y-6 text-base leading-relaxed text-gray-700">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#00340c]">
              1. Overview &amp; Services
            </h2>
            <p>
              These Terms &amp; Conditions govern your use of{" "}
              <Link href="/" className="font-semibold text-[#00340c] underline">
                www.jordhaus.com
              </Link>{" "}
              and inquiries for raised-bed installation, living-soil services,
              and related products provided by JördHaus in Redmond, WA.
              On-site installation scopes, pricing, and schedules are confirmed
              in writing prior to work beginning.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#00340c]">
              2. SMS &amp; Text Messaging Program Terms
            </h2>
            <p>
              <strong>Program Name:</strong> JördHaus Customer Support &amp;
              Website Chat SMS.
            </p>
            <p>
              <strong>Program Description:</strong> By checking the SMS opt-in
              box on our{" "}
              <Link
                href="/contact"
                className="font-semibold text-[#00340c] underline"
              >
                contact form
              </Link>
              , texting our business number directly, or sending a message
              through our website chat widget, you consent to receive
              conversational text messages from JördHaus regarding your quote,
              project questions, scheduling, and customer support. In addition,
              messages submitted through the website chat widget are forwarded
              via SMS to our team so we can reply to your inquiry in real time.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Opt-Out:</strong> You can cancel the SMS service at any
                time. Just text <strong>STOP</strong> to the number you received
                messages from. After you send the SMS message{" "}
                <strong>STOP</strong> to us, we will send you an SMS message to
                confirm that you have been unsubscribed. After this, you will
                no longer receive SMS messages from us.
              </li>
              <li>
                <strong>Help:</strong> If you are experiencing issues with the
                messaging program you can reply with the keyword{" "}
                <strong>HELP</strong> for more assistance, or you can get help
                directly at{" "}
                <a
                  href="mailto:contact@jordhaus.com"
                  className="font-semibold text-[#00340c] underline"
                >
                  contact@jordhaus.com
                </a>{" "}
                or{" "}
                <a
                  href="tel:3124151093"
                  className="font-semibold text-[#00340c] underline"
                >
                  312-415-1093
                </a>
                .
              </li>
              <li>
                <strong>Carriers:</strong> Carriers are not liable for delayed
                or undelivered messages.
              </li>
              <li>
                <strong>Rates &amp; Frequency:</strong> As always, message and
                data rates may apply for any messages sent to you from us and
                to us from you. Message frequency varies based on your
                interaction with our team. If you have any questions about your
                text plan or data plan, it is best to contact your wireless
                provider.
              </li>
              <li>
                <strong>Privacy:</strong> If you have any questions regarding
                privacy, please read our{" "}
                <Link
                  href="/privacy"
                  className="font-semibold text-[#00340c] underline"
                >
                  Privacy Policy
                </Link>
                .
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#00340c]">
              3. Website Tools &amp; Estimates
            </h2>
            <p>
              Planting calendars, water-flow maps, and soil dashboards on this
              site are informational tools. Site-specific conditions vary and
              are verified during an on-site visit.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#00340c]">4. Contact</h2>
            <p>
              JördHaus — Redmond, WA. Email{" "}
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
