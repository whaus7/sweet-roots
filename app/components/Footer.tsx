import Image from "next/image";
import Link from "next/link";
import Mountains from "@/app/components/footer/Mountains";

const FOOTER_GREEN = "#00340c";
const ACCENT = "#d4a017";

const EXPLORE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/store", label: "Store" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const TOOL_LINKS = [
  { href: "/soil-tests", label: "Soil Tests" },
  { href: "/brix-logs", label: "Brix Logs" },
  { href: "/land-survey", label: "Water Flow" },
  { href: "/planting-schedule", label: "Planting" },
];

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3
        className="text-sm font-bold uppercase tracking-[0.2em]"
        style={{ color: ACCENT }}
      >
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-base font-semibold text-white transition hover:text-[#d4a017]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function IconPin() {
  return (
    <svg
      className="mt-1 h-5 w-5 shrink-0"
      style={{ color: ACCENT }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      style={{ color: ACCENT }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      style={{ color: ACCENT }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="text-white">
      <div className="flex justify-center overflow-x-hidden bg-[#fcfcfc]" id="hero">
        <div>
          <Mountains />
        </div>
      </div>

      <div style={{ background: FOOTER_GREEN }}>
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-4 lg:px-8 lg:pb-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
            <div>
              <Link href="/" className="inline-block">
                <Image
                  src="/images/jordhaus-logo-white.png"
                  alt="JördHaus"
                  width={300}
                  height={72}
                  className="h-auto w-[240px] max-w-full"
                />
              </Link>

              <address className="mt-6 space-y-4 not-italic">
                <div className="flex items-start gap-3">
                  <IconPin />
                  <p className="text-base font-semibold leading-relaxed text-white sm:text-lg">
                    Bellevue, WA
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <IconPhone />
                  <a
                    href="tel:3124151093"
                    className="text-xl font-bold text-white transition hover:text-[#d4a017] sm:text-2xl"
                  >
                    312-415-1093
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <IconMail />
                  <a
                    href="mailto:contact@jordhaus.com"
                    className="text-base font-semibold text-white transition hover:text-[#d4a017]"
                  >
                    contact@jordhaus.com
                  </a>
                </div>
              </address>
            </div>

            <nav
              aria-label="Footer navigation"
              className="grid gap-8 sm:grid-cols-2 lg:gap-12"
            >
              <FooterLinkColumn title="Explore" links={EXPLORE_LINKS} />
              <FooterLinkColumn title="Tools" links={TOOL_LINKS} />
            </nav>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-6 text-xs text-white/60 lg:px-8">
            <p>&copy; {new Date().getFullYear()} JördHaus. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
