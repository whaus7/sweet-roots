import Image from "next/image";

export function StoreArticle({
  id,
  kicker,
  title,
  lede,
  image,
  sections,
}: {
  id: string;
  kicker: string;
  title: string;
  lede: string;
  image?: { src: string; alt: string; width: number; height: number };
  sections: { heading: string; paragraphs: string[] }[];
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="border-t border-[#d9d0c0] bg-[#f4efe4] px-6 py-16 text-[#1c1812] sm:px-8 sm:py-24"
    >
      <article className="mx-auto max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#5c5348]">
          {kicker}
        </p>
        <h2
          id={`${id}-title`}
          className="catalog-display mt-3 text-4xl leading-tight sm:text-5xl"
        >
          {title}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-[#3c342c]">{lede}</p>
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="mt-10 h-auto w-full"
          />
        ) : null}
        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h3 className="catalog-display text-2xl">{section.heading}</h3>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-3 text-base leading-relaxed text-[#3c342c]"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </section>
  );
}
