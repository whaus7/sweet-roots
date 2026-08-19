import type { Place } from "./types";

type GeoResult = {
  name?: string;
  latitude?: number;
  longitude?: number;
  country?: string;
  admin1?: string;
  timezone?: string;
};

type GeoResponse = {
  results?: GeoResult[];
};

type IpWho = {
  success?: boolean;
  city?: string;
  region?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  timezone?: { id?: string };
};

export function formatDisplayName(place: {
  name: string;
  admin1?: string;
  country?: string;
}): string {
  const parts = [place.name];
  if (place.admin1 && place.admin1 !== place.name) parts.push(place.admin1);
  if (place.country) parts.push(place.country);
  return parts.join(", ");
}

export function toPlace(result: GeoResult): Place | null {
  if (
    result.latitude == null ||
    result.longitude == null ||
    !result.name
  ) {
    return null;
  }
  const name = result.name;
  return {
    name,
    displayName: formatDisplayName({
      name,
      admin1: result.admin1,
      country: result.country,
    }),
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country,
    admin1: result.admin1,
    timezone: result.timezone,
  };
}

export async function searchCities(query: string): Promise<Place[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", q);
  url.searchParams.set("count", "8");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");
  const response = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
  if (!response.ok) return [];
  const data = (await response.json()) as GeoResponse;
  return (data.results ?? [])
    .map(toPlace)
    .filter((place): place is Place => place !== null);
}

type NominatimAddress = {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  hamlet?: string;
  county?: string;
  state?: string;
  region?: string;
  country?: string;
};

type NominatimReverse = {
  name?: string;
  address?: NominatimAddress;
};

type BigDataCloudReverse = {
  city?: string;
  locality?: string;
  principalSubdivision?: string;
  countryName?: string;
};

const reverseCache = new Map<string, Place>();

function reverseCacheKey(latitude: number, longitude: number): string {
  return `${latitude.toFixed(3)},${longitude.toFixed(3)}`;
}

function placeFromParts(
  name: string,
  admin1: string | undefined,
  country: string | undefined,
  latitude: number,
  longitude: number,
): Place {
  return {
    name,
    displayName: formatDisplayName({ name, admin1, country }),
    latitude,
    longitude,
    country,
    admin1,
  };
}

async function reverseGeocodeNominatim(
  latitude: number,
  longitude: number,
): Promise<Place | null> {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("zoom", "12");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("accept-language", "en");
  const response = await fetch(url, {
    headers: {
      "User-Agent": "planting-schedule/0.1 (https://github.com/planting-schedule)",
    },
    next: { revalidate: 60 * 60 * 24 * 7 },
  });
  if (!response.ok) return null;
  const data = (await response.json()) as NominatimReverse;
  const address = data.address;
  const name =
    address?.city ||
    address?.town ||
    address?.village ||
    address?.municipality ||
    address?.hamlet ||
    data.name ||
    address?.county;
  if (!name) return null;
  return placeFromParts(
    name,
    address?.state || address?.region,
    address?.country,
    latitude,
    longitude,
  );
}

async function reverseGeocodeBigDataCloud(
  latitude: number,
  longitude: number,
): Promise<Place | null> {
  const url = new URL(
    "https://api.bigdatacloud.net/data/reverse-geocode-client",
  );
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("localityLanguage", "en");
  const response = await fetch(url, {
    next: { revalidate: 60 * 60 * 24 * 7 },
  });
  if (!response.ok) return null;
  const data = (await response.json()) as BigDataCloudReverse;
  const name = data.city || data.locality;
  if (!name) return null;
  return placeFromParts(
    name,
    data.principalSubdivision,
    data.countryName,
    latitude,
    longitude,
  );
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<Place | null> {
  const key = reverseCacheKey(latitude, longitude);
  const cached = reverseCache.get(key);
  if (cached) return cached;

  const place =
    (await reverseGeocodeNominatim(latitude, longitude).catch(() => null)) ??
    (await reverseGeocodeBigDataCloud(latitude, longitude).catch(() => null));
  if (!place) return null;
  reverseCache.set(key, place);
  return place;
}

function isLoopback(ip: string): boolean {
  return (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip === "::ffff:127.0.0.1" ||
    ip.startsWith("127.")
  );
}

export async function lookupIpLocation(options: {
  ip?: string | null;
  vercel?: {
    latitude?: string | null;
    longitude?: string | null;
    city?: string | null;
    region?: string | null;
    country?: string | null;
  };
}): Promise<Place | null> {
  const vercel = options.vercel;
  const vLat = Number(vercel?.latitude);
  const vLon = Number(vercel?.longitude);
  if (Number.isFinite(vLat) && Number.isFinite(vLon)) {
    const name = decodeURIComponent(vercel?.city || "Your location");
    return {
      name,
      displayName: formatDisplayName({
        name,
        admin1: vercel?.region ? decodeURIComponent(vercel.region) : undefined,
        country: vercel?.country || undefined,
      }),
      latitude: vLat,
      longitude: vLon,
    };
  }

  const ip = options.ip?.split(",")[0]?.trim();
  const url =
    ip && !isLoopback(ip) ? `https://ipwho.is/${ip}` : "https://ipwho.is/";
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return null;
  const data = (await response.json()) as IpWho;
  if (data.success === false || data.latitude == null || data.longitude == null) {
    return null;
  }
  const name = data.city || "Your location";
  return {
    name,
    displayName: formatDisplayName({
      name,
      admin1: data.region,
      country: data.country,
    }),
    latitude: data.latitude,
    longitude: data.longitude,
    country: data.country,
    admin1: data.region,
    timezone: data.timezone?.id,
  };
}

export function parseCoord(value: string | string[] | undefined): number | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function parsePlaceName(
  value: string | string[] | undefined,
): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() || undefined;
}

export function looksLikeCoordinates(value: string): boolean {
  return /^-?\d+(\.\d+)?°?\s*,\s*-?\d+(\.\d+)?°?$/.test(value.trim());
}

export function needsCityName(placeName?: string): boolean {
  if (!placeName) return true;
  if (placeName === "Your location" || placeName === "Current location") {
    return true;
  }
  return looksLikeCoordinates(placeName);
}
