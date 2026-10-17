import Image from "next/image";

interface HeroBannerProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  altText?: string;
  burnAmount?: number;
  frameClassName?: string;
  ink?: "light" | "dark" | "black";
}

export default function HeroBanner({
  title,
  subtitle,
  backgroundImage,
  altText = "Hero Banner",
  burnAmount = 0.28,
  frameClassName = "h-48 md:h-64 lg:h-80",
  ink = "light",
}: HeroBannerProps) {
  const dark = ink === "dark" || ink === "black";
  const solidBlack = ink === "black";
  const clampedBurnAmount = dark ? 0 : Math.max(0, Math.min(1, burnAmount));
  const dramaticBurn = Math.pow(clampedBurnAmount, 0.7);

  return (
    <div className="relative w-full">
      <div className={`relative overflow-hidden ${frameClassName}`}>
        <Image
          src={backgroundImage}
          alt={altText}
          fill
          className="object-cover"
          priority
        />
        {clampedBurnAmount > 0 ? (
          <>
            <div
              className="absolute inset-0"
              style={{
                opacity: dramaticBurn * 0.8,
                background: `linear-gradient(to bottom, rgba(0,0,0,${
                  dramaticBurn * 0.6
                }) 0%, rgba(0,0,0,${dramaticBurn * 0.5}) 50%, rgba(0,0,0,${
                  dramaticBurn * 0.9
                }) 100%)`,
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                opacity: dramaticBurn * 0.4,
                background: `linear-gradient(to right, rgba(0,0,0,${
                  dramaticBurn * 0.4
                }) 0%, transparent 50%, rgba(0,0,0,${dramaticBurn * 0.4}) 100%)`,
              }}
            />
          </>
        ) : null}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6">
            <h1
              className={`text-2xl md:text-4xl lg:text-5xl font-bold mb-2 ${
                solidBlack
                  ? "text-black"
                  : dark
                    ? "text-gray-900"
                    : "text-white drop-shadow-lg"
              }`}
            >
              {title}
            </h1>
            <p
              className={`text-sm md:text-lg lg:text-xl max-w-3xl mx-auto ${
                solidBlack
                  ? "text-black"
                  : dark
                    ? "text-gray-600"
                    : "text-white/90 drop-shadow-md"
              }`}
            >
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
