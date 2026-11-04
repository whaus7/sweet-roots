import Image from "next/image";
import { ContactForm } from "./ContactForm";

type ContactFormPanelProps = {
  source?: "home" | "contact";
  heading?: string;
  subheading?: string;
};

const FLOWERS = [
  {
    src: "/images/contact/flowers-tl.jpg",
    className: "-left-8 -top-10 w-40 sm:-left-12 sm:-top-14 sm:w-56 lg:w-64",
  },
  {
    src: "/images/contact/flowers-tr.jpg",
    className: "-right-8 -top-10 w-40 sm:-right-12 sm:-top-14 sm:w-56 lg:w-64",
  },
  {
    src: "/images/contact/flowers-bl.jpg",
    className: "-bottom-10 -left-8 w-40 sm:-bottom-14 sm:-left-12 sm:w-56 lg:w-64",
  },
  {
    src: "/images/contact/flowers-br.jpg",
    className: "-bottom-10 -right-8 w-40 sm:-bottom-14 sm:-right-12 sm:w-56 lg:w-64",
  },
] as const;

export function ContactFormPanel({
  source = "contact",
  heading,
  subheading,
}: ContactFormPanelProps) {
  return (
    <div className="relative mx-2 my-8 sm:mx-6 sm:my-12">
      <div className="relative z-10 rounded-lg border border-[#00340c]/10 bg-white/90 px-6 pb-8 pt-12 shadow-md backdrop-blur-[2px] sm:px-10 sm:pb-10 sm:pt-16">
        <ContactForm
          source={source}
          heading={heading}
          subheading={subheading}
        />
      </div>

      {FLOWERS.map((flower) => (
        <div
          key={flower.src}
          className={`pointer-events-none absolute z-20 mix-blend-multiply ${flower.className}`}
          aria-hidden
        >
          <Image
            src={flower.src}
            alt=""
            width={512}
            height={512}
            className="h-auto w-full select-none"
          />
        </div>
      ))}
    </div>
  );
}
