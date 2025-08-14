import Image from "next/image";

interface HeroBannerNewProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  altText?: string;
}

export default function HeroBannerNew({
  title,
  subtitle,
  backgroundImage,
  altText = "Hero Banner",
}: HeroBannerNewProps) {
  return (
    <>
      <div className="relative w-full md:h-[50px] lg:h-[80px] mb-4 border border-slate-300">
        {/* Container with max-width constraint */}
        <div className="max-w-[1100px] mx-auto h-full relative">
          {/* Flexbox layout for title and image */}
          <div className="flex h-full">
            {/* Left side - Content */}
            <div className="flex-1 flex items-center px-4">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {title}
              </h1>
            </div>

            {/* Right side - Image */}
            <div className="flex-1 relative">
              <Image
                src={backgroundImage}
                alt={altText}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* 30-degree tilted white line separator */}
          {/* <div className="absolute left-1/2 top-0 w-1 h-full z-20">
            <div
              className="w-1 h-full bg-white shadow-lg"
              style={{
                transform: "translateX(-50%) rotate(20deg)",
                transformOrigin: "center center",
                width: "4px",
              }}
            />
          </div> */}
        </div>

        {/* Triangle mask to create overlapping effect - positioned relative to outer container */}
        {/* <div
          className="absolute left-1/2 top-4 w-full h-full z-50"
          style={{
            transform: "translateX(-50%) rotate(60deg)",
            transformOrigin: "center center",
            background:
              "linear-gradient(90deg, rgb(241 245 249) 0%, rgb(241 245 249) 80%, transparent 80%, transparent 100%)",
            width: "150px",
            height: "100%",
          }}
        /> */}

        {/* Additional white line for better visual separation */}
        {/* <div className="absolute left-1/2 top-0 w-1 h-full z-20">
        <div
          className="w-1 h-full bg-white/80"
          style={{
            transform: "translateX(-50%) rotate(30deg)",
            transformOrigin: "center center",
            width: "4px",
          }}
        />
      </div> */}

        {/* Extended image section that goes to browser edge */}
        {/* <div className="absolute right-0 top-0 w-1/2 h-full -mr-[calc(50vw-550px)]">
        <div className="relative w-full h-full">
          <Image
            src={backgroundImage}
            alt={altText}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div> */}
      </div>
      <div className="max-w-[1100px] mx-auto h-full px-4 relative">
        <p className="text-md text-gray-600 leading-relaxed">{subtitle}</p>
      </div>
    </>
  );
}
