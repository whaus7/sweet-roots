"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../contexts/UserContext";

const TOOLS = [
  { href: "/soil-tests", label: "Soil Tests" },
  { href: "/brix-logs", label: "Brix Logs" },
  { href: "/land-survey", label: "Water Flow" },
  { href: "/planting-schedule", label: "Planting" },
];

const navLinkClass =
  "text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";

export function Header() {
  const { user, logout } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!toolsRef.current?.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
    }
    window.addEventListener("mousedown", onPointer);
    return () => window.removeEventListener("mousedown", onPointer);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-[1100] mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/images/sweet-roots-logo.svg"
                alt="Sweet Roots Farm Logo"
                width={300}
                height={34}
                priority
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <Link href="/" className={navLinkClass}>
              Home
            </Link>
            <Link href="/store" className={navLinkClass}>
              Store
            </Link>
            <div ref={toolsRef} className="relative">
              <button
                type="button"
                className={`${navLinkClass} inline-flex items-center gap-1`}
                aria-expanded={isToolsOpen}
                aria-haspopup="true"
                onClick={() => setIsToolsOpen((open) => !open)}
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
            <Link href="/about" className={navLinkClass}>
              About Us
            </Link>

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

          <div className="md:hidden">
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
            <Link
              href="/store"
              className={navLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Store
            </Link>
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
              href="/about"
              className={navLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
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
