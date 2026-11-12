import Link from "next/link";

export function ShopGuideLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <p className="bg-[#f4efe4] px-6 py-10 text-center text-[#1c1812]">
      <Link
        href={href}
        className="catalog-display text-xl underline decoration-[#1c1812]/30 underline-offset-4 hover:decoration-[#1c1812]"
      >
        {children}
      </Link>
    </p>
  );
}
