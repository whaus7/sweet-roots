import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = asString(body.name);
    const email = asString(body.email);
    const phone = asString(body.phone);
    const message = asString(body.message);
    const website = asString(body.website);
    const source = asString(body.source) || "contact";

    if (website) {
      return NextResponse.json({ success: true });
    }

    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    if (!message) {
      return NextResponse.json(
        { error: "Please tell us how we can help." },
        { status: 400 }
      );
    }

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Please add a phone number or an email so we can reach you." },
        { status: 400 }
      );
    }

    if (email && !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.CONTACT_FROM || "contact@jordhaus.com";
    const to = process.env.CONTACT_TO || "whaus777@gmail.com";
    const port = Number(process.env.SMTP_PORT || 587);

    if (!host || !user || !pass) {
      console.error("[contact] SMTP is not configured");
      return NextResponse.json(
        { error: "Email is not configured yet. Please call or try again later." },
        { status: 503 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const sourceLabel = source === "home" ? "Home page" : "Contact page";
    const textLines = [
      `New JördHaus inquiry from the ${sourceLabel.toLowerCase()}.`,
      "",
      `Name: ${name}`,
      `Email: ${email || "(not provided)"}`,
      `Phone: ${phone || "(not provided)"}`,
      "",
      "Message:",
      message,
    ];

    await transporter.sendMail({
      from: `JördHaus <${from}>`,
      to,
      replyTo: email || undefined,
      subject: `New inquiry from ${name}`,
      text: textLines.join("\n"),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[contact] send failed", error);
    return NextResponse.json(
      { error: "Unable to send your message. Please try again." },
      { status: 500 }
    );
  }
}
