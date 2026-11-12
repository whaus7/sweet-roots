"use client";

import Link from "next/link";
import { openSiteChat } from "@/app/lib/chat/open";

export function QuestionsChatLink({ className }: { className?: string }) {
  return (
    <Link
      href="/contact"
      className={className}
      onClick={(event) => {
        if (openSiteChat()) event.preventDefault();
      }}
    >
      Questions?
    </Link>
  );
}
