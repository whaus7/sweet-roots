export function getSiteUrl(request: Request) {
  const fromEnv = (
    process.env.CHAT_PUBLIC_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    ""
  ).replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  const host =
    request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!host) return "http://localhost:3002";

  const proto = request.headers.get("x-forwarded-proto") || "http";
  return `${proto}://${host}`;
}

export function productImageUrl(origin: string, src: string) {
  if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
    return undefined;
  }
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return `${origin}${src}`;
}
