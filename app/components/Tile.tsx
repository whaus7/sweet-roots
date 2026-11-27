import type { ReactNode } from "react";

interface TileProps {
  readonly children: ReactNode;
  type: string;
  title: string;
  tileType?: string;
  altStyle?: boolean;
  variant?: "default" | "plain" | "white";
}

const shellClass = {
  default:
    "rounded-lg border border-[#d9d0c0] bg-[#faf7f0] px-5 py-5 text-[#1c1812]",
  plain: "text-[#1c1812]",
  white:
    "rounded-lg border border-[#d9d0c0] bg-white px-5 py-5 text-[#1c1812]",
};

const titleClass = {
  default:
    "catalog-display mb-4 border-b border-[#d9d0c0] pb-3 text-center text-2xl leading-tight",
  plain: "catalog-display mb-4 text-left text-2xl leading-tight",
  white:
    "catalog-display mb-4 border-b border-[#d9d0c0] pb-3 text-center text-2xl leading-tight",
};

export const Tile = ({ children, title, variant = "default" }: TileProps) => {
  return (
    <section className={shellClass[variant]}>
      <h2 className={titleClass[variant]}>{title}</h2>
      <div className="text-base leading-relaxed text-[#3c342c]">{children}</div>
      {/* {tileType && (
        <div className="flex justify-end gap-4 mt-4">
          <Link
            href={`/history/${tileType}`}
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          >
            Log Readings
          </Link>
          <Link
            href={`/details/${tileType}`}
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          >
            Learn more
          </Link>
        </div>
      )} */}
    </section>
  );
};
