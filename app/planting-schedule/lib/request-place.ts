import { lookupIpLocation } from "@/app/planting-schedule/lib/location";
import { headers } from "next/headers";
import type { Place } from "@/app/planting-schedule/lib/types";

export async function placeFromHeaders(): Promise<Place | null> {
  const h = await headers();
  return lookupIpLocation({
    ip: h.get("x-forwarded-for") ?? h.get("x-real-ip"),
    vercel: {
      latitude: h.get("x-vercel-ip-latitude"),
      longitude: h.get("x-vercel-ip-longitude"),
      city: h.get("x-vercel-ip-city"),
      region: h.get("x-vercel-ip-country-region") ?? h.get("x-vercel-ip-region"),
      country: h.get("x-vercel-ip-country"),
    },
  });
}
