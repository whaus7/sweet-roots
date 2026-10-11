"use client";

import { FormEvent, useId, useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

type ContactFormProps = {
  heading?: string;
  subheading?: string;
  source?: "home" | "contact";
};

const FOREST = "#00340c";
const GOLD = "#d4a017";

const labelClass = "mb-1.5 block text-sm font-semibold text-[#00340c]";
const inputClass =
  "w-full rounded-md border border-[#00340c]/20 bg-white px-4 py-2.5 text-[#171717] shadow-sm transition focus:border-[#d4a017] focus:outline-none focus:ring-2 focus:ring-[#d4a017]/30";

export function ContactForm({
  heading = "Get in touch",
  subheading = "Tell us about your yard. We install raised beds in Bellevue — we don't ship panels.",
  source = "contact",
}: ContactFormProps) {
  const formId = useId();
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const website = String(data.get("website") ?? "").trim();

    if (!email && !phone) {
      setState("error");
      setErrorMessage("Please add a phone number or an email so we can reach you.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          website,
          source,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          typeof body.error === "string"
            ? body.error
            : "Something went wrong. Please try again."
        );
      }

      setState("success");
      form.reset();
    } catch (err) {
      setState("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-[#00340c]">
        <p className="font-semibold">Thank you — we got your message.</p>
        <p className="mt-2 text-sm">
          We will be in touch shortly about your raised beds and soil work.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h2
          className="text-xl font-bold sm:text-2xl"
          style={{ color: FOREST }}
        >
          {heading}
        </h2>
        <p className="mt-2 text-sm text-gray-700 sm:text-base">{subheading}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="hidden" aria-hidden="true">
          <label htmlFor={`${formId}-website`}>Website</label>
          <input
            type="text"
            id={`${formId}-website`}
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div>
          <label htmlFor={`${formId}-name`} className={labelClass}>
            Name *
          </label>
          <input
            type="text"
            id={`${formId}-name`}
            name="name"
            required
            autoComplete="name"
            className={inputClass}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${formId}-email`} className={labelClass}>
              Email
            </label>
            <input
              type="email"
              id={`${formId}-email`}
              name="email"
              autoComplete="email"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor={`${formId}-phone`} className={labelClass}>
              Phone
            </label>
            <input
              type="tel"
              id={`${formId}-phone`}
              name="phone"
              autoComplete="tel"
              className={inputClass}
            />
          </div>
        </div>
        <p className="text-xs text-gray-600">Phone or email is required.</p>

        <div>
          <label htmlFor={`${formId}-message`} className={labelClass}>
            How can we help? *
          </label>
          <textarea
            id={`${formId}-message`}
            name="message"
            required
            rows={5}
            className={inputClass}
          />
        </div>

        {state === "error" && (
          <p className="text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={state === "submitting"}
          className="inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          style={{ background: FOREST, ["--tw-ring-color" as string]: GOLD }}
        >
          {state === "submitting" ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
