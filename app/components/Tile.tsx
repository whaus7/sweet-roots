import type { ReactNode } from "react";
import Link from "next/link";

interface TileProps {
  readonly children: ReactNode;
  type: string;
  title: string;
  tileType?: string;
  altStyle?: boolean;
}

export const Tile = ({
  children,
  type,
  title,
  tileType,
  altStyle = false,
}: TileProps) => {
  return (
    <div
      className="result-widget shadow-md"
      style={{
        gridArea: `${type}`,
        ...(altStyle && {
          backgroundColor: "white",
          border: "1px solid #e6f3ff", // Blue border
          borderRadius: "0.375rem",
        }),
      }}
    >
      <div className="tileTitle text-center text-lg mb-4">{title}</div>
      {children}
      {tileType && (
        <div className="flex justify-end mt-4">
          <Link
            href={`/details/${tileType}`}
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          >
            Read more
          </Link>
        </div>
      )}
    </div>
  );
};
