"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CartButton } from "./cart/CartButton";
import { useUser } from "../contexts/UserContext";

const STORE = [
  { href: "/store/microgreens", label: "Microgreens" },
  { href: "/store/continuous-flow-bins", label: "Continuous-flow Beds" },
  { href: "/store/composting-worms", label: "Composting Worms" },
];

const EDUCATION_SECTIONS = [
  {
    title: "Soil tests",
    items: [
      { href: "/details/compaction", label: "Compaction" },
      { href: "/details/brix", label: "Brix" },
      { href: "/details/plfa", label: "PLFA" },
      { href: "/details/npk", label: "NPK" },
      { href: "/details/microscopy", label: "Microscopy" },
      { href: "/details/cnratio", label: "Carbon to nitrogen" },
    ],
  },
  {
    title: "Microgreens",
    items: [
      { href: "/store/microgreens#winter-greens", label: "Winter nutrition" },
    ],
  },
  {
    title: "Continuous-flow bins",
    items: [
      {
        href: "/store/continuous-flow-bins#one-bin",
        label: "One bin, not a stack",
      },
    ],
  },
  {
    title: "Composting worms",
    items: [
      {
        href: "/store/composting-worms#bioreactors",
        label: "Nature's bioreactors",
      },
    ],
  },
];

function EducationLinks({
  onNavigate,
  linkClassName,
  titleClassName,
}: {
  onNavigate: () => void;
  linkClassName: string;
  titleClassName: string;
}) {
  return (
    <>
      {EDUCATION_SECTIONS.map((section) => (
        <div key={section.title} role="group" aria-label={section.title}>
          <p className={titleClassName}>{section.title}</p>
          {section.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkClassName}
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ))}
    </>
  );
}

const TOOLS = [
  { href: "/planting-schedule", label: "Planting" },
  { href: "/land-survey", label: "Water Flow" },
  { href: "/brix-logs", label: "Brix Logs" },
];

const navLinkClass =
  "text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";

export function Header() {
  const { user, logout } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileStoreOpen, setIsMobileStoreOpen] = useState(false);
  const [isMobileEducationOpen, setIsMobileEducationOpen] = useState(false);
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);
  const storeRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const pronunciationRef = useRef<HTMLAudioElement | null>(null);

  function playPronunciation() {
    const audio =
      pronunciationRef.current ?? new Audio("/audio/jordhaus.wav");
    pronunciationRef.current = audio;
    audio.currentTime = 0;
    void audio.play();
  }

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      const target = event.target as Node;
      if (!storeRef.current?.contains(target)) {
        setIsStoreOpen(false);
      }
      if (!educationRef.current?.contains(target)) {
        setIsEducationOpen(false);
      }
      if (!toolsRef.current?.contains(target)) {
        setIsToolsOpen(false);
      }
    }
    window.addEventListener("mousedown", onPointer);
    return () => window.removeEventListener("mousedown", onPointer);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="group relative flex items-center pr-8">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/jordhaus-logo.svg"
                alt="JördHaus"
                width={377}
                height={78}
                className="h-8 w-auto"
                priority
              />
            </Link>
            <button
              type="button"
              onClick={playPronunciation}
              aria-label="Hear how to say JördHaus"
              className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#00340c] opacity-0 pointer-events-none transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 hover:bg-green-50 [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:opacity-100"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden
              >
                <path d="M4 10v4h3.5L12 18.5v-13L7.5 10H4z" strokeLinejoin="round" />
                <path d="M15.5 9.5a3.2 3.2 0 0 1 0 5" strokeLinecap="round" />
                <path d="M17.8 7.2a6.2 6.2 0 0 1 0 9.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <Link href="/" className={navLinkClass}>
              Home
            </Link>
            <div ref={storeRef} className="relative">
              <button
                type="button"
                className={`${navLinkClass} inline-flex items-center gap-1`}
                aria-expanded={isStoreOpen}
                aria-haspopup="true"
                onClick={() => {
                  setIsStoreOpen((open) => !open);
                  setIsEducationOpen(false);
                  setIsToolsOpen(false);
                }}
              >
                Store
                <svg
                  className={`h-4 w-4 transition-transform ${
                    isStoreOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isStoreOpen ? (
                <div className="absolute right-0 top-full z-50 mt-1 min-w-52 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  {STORE.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                      onClick={() => setIsStoreOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            <div ref={educationRef} className="relative">
              <button
                type="button"
                className={`${navLinkClass} inline-flex items-center gap-1`}
                aria-expanded={isEducationOpen}
                aria-haspopup="true"
                onClick={() => {
                  setIsEducationOpen((open) => !open);
                  setIsStoreOpen(false);
                  setIsToolsOpen(false);
                }}
              >
                Education
                <svg
                  className={`h-4 w-4 transition-transform ${
                    isEducationOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isEducationOpen ? (
                <div className="absolute left-0 top-full z-50 mt-1 min-w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                  <EducationLinks
                    onNavigate={() => setIsEducationOpen(false)}
                    titleClassName="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400"
                    linkClassName="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                  />
                </div>
              ) : null}
            </div>
            <div ref={toolsRef} className="relative">
              <button
                type="button"
                className={`${navLinkClass} inline-flex items-center gap-1`}
                aria-expanded={isToolsOpen}
                aria-haspopup="true"
                onClick={() => {
                  setIsToolsOpen((open) => !open);
                  setIsStoreOpen(false);
                  setIsEducationOpen(false);
                }}
              >
                Tools
                <svg
                  className={`h-4 w-4 transition-transform ${
                    isToolsOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isToolsOpen ? (
                <div className="absolute left-0 top-full z-50 mt-1 min-w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  {TOOLS.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                      onClick={() => setIsToolsOpen(false)}
                    >
                      {tool.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            <Link href="/contact" className={navLinkClass}>
              Get in Touch
            </Link>
            <CartButton />

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={
                        user.name === "William Hausman"
                          ? "Sweet Roots Farm"
                          : user.name
                      }
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm font-medium">
                        {user.name === "William Hausman"
                          ? "Sweet Roots Farm"
                          : user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-gray-700 hidden lg:block">
                    {user.name === "William Hausman"
                      ? "Sweet Roots Farm"
                      : user.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className={navLinkClass}>
                Login
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-1 md:hidden">
            <CartButton />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 focus:outline-none focus:text-green-600"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div
          className={`md:hidden ${
            isMenuOpen ? "block" : "hidden"
          } border-t border-gray-200`}
        >
          <nav className="flex flex-col space-y-1 py-4">
            <Link
              href="/"
              className={navLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <button
              type="button"
              className={`${navLinkClass} flex w-full items-center justify-between text-left`}
              aria-expanded={isMobileStoreOpen}
              onClick={() => setIsMobileStoreOpen((open) => !open)}
            >
              Store
              <svg
                className={`h-4 w-4 transition-transform ${
                  isMobileStoreOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isMobileStoreOpen
              ? STORE.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-gray-600 hover:text-green-600 px-6 py-2 rounded-md text-sm font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))
              : null}
            <button
              type="button"
              className={`${navLinkClass} flex w-full items-center justify-between text-left`}
              aria-expanded={isMobileEducationOpen}
              onClick={() => setIsMobileEducationOpen((open) => !open)}
            >
              Education
              <svg
                className={`h-4 w-4 transition-transform ${
                  isMobileEducationOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isMobileEducationOpen ? (
              <EducationLinks
                onNavigate={() => setIsMenuOpen(false)}
                titleClassName="px-6 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400"
                linkClassName="block text-gray-600 hover:text-green-600 px-8 py-2 rounded-md text-sm font-medium"
              />
            ) : null}
            <button
              type="button"
              className={`${navLinkClass} flex w-full items-center justify-between text-left`}
              aria-expanded={isMobileToolsOpen}
              onClick={() => setIsMobileToolsOpen((open) => !open)}
            >
              Tools
              <svg
                className={`h-4 w-4 transition-transform ${
                  isMobileToolsOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isMobileToolsOpen
              ? TOOLS.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="text-gray-600 hover:text-green-600 px-6 py-2 rounded-md text-sm font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {tool.label}
                  </Link>
                ))
              : null}
            <Link
              href="/contact"
              className={navLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Get in Touch
            </Link>

            {user ? (
              <>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    {user.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-sm text-gray-700">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
