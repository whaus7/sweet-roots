export type CommonsPhoto = {
  title: string;
  thumbUrl: string;
  pageUrl: string;
  artist: string;
  license: string;
};

type CommonsPage = {
  title?: string;
  index?: number;
  imageinfo?: Array<{
    url?: string;
    thumburl?: string;
    descriptionurl?: string;
    mime?: string;
    width?: number;
    extmetadata?: {
      Artist?: { value?: string };
      LicenseShortName?: { value?: string };
    };
  }>;
};

type CommonsResponse = {
  query?: {
    pages?: Record<string, CommonsPage>;
  };
};

const COMMONS_API = "https://commons.wikimedia.org/w/api.php";
const USER_AGENT =
  "JordhausPlantingSchedule/1.0 (https://jordhaus.com; contact@jordhaus.com)";
const PHOTO_LIMIT = 3;
const GENERIC_COMMON_NAMES = new Set([
  "mustard",
  "tomato",
  "turnip",
  "kale",
  "radish",
  "cabbage",
  "onion",
  "lettuce",
  "spinach",
  "pepper",
  "eggplant",
  "okra",
  "herb",
  "green",
]);

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
}

function isUsableImage(info: NonNullable<CommonsPage["imageinfo"]>[number]): boolean {
  if (!info.mime?.startsWith("image/")) return false;
  if (info.mime === "image/svg+xml") return false;
  if (info.width != null && info.width < 200) return false;
  const url = info.thumburl || info.url;
  return Boolean(url && info.descriptionurl);
}

function looksLikeNonPhoto(title: string): boolean {
  return /distribution|range map|locator|coat of arms|flag of|\blogo\b|icon|diagram of/i.test(
    title,
  );
}

function toPhoto(page: CommonsPage): CommonsPhoto | null {
  const info = page.imageinfo?.[0];
  if (!page.title || !info || !isUsableImage(info) || looksLikeNonPhoto(page.title)) {
    return null;
  }
  return {
    title: page.title.replace(/^File:/, ""),
    thumbUrl: info.thumburl || info.url || "",
    pageUrl: info.descriptionurl || "",
    artist: stripHtml(info.extmetadata?.Artist?.value ?? ""),
    license: stripHtml(info.extmetadata?.LicenseShortName?.value ?? ""),
  };
}

async function searchCommons(query: string, needed: number): Promise<CommonsPhoto[]> {
  const trimmed = query.trim();
  if (!trimmed || needed <= 0) return [];

  const params = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    generator: "search",
    gsrsearch: trimmed,
    gsrnamespace: "6",
    gsrlimit: String(Math.max(needed * 4, 8)),
    prop: "imageinfo",
    iiprop: "url|mime|size|extmetadata",
    iiurlwidth: "960",
    iiextmetadatafilter: "LicenseShortName|Artist",
  });

  const response = await fetch(`${COMMONS_API}?${params}`, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
    },
    next: { revalidate: 86_400 },
  });

  if (!response.ok) return [];

  const data = (await response.json()) as CommonsResponse;
  const pages = Object.values(data.query?.pages ?? {}).sort(
    (a, b) => (a.index ?? 0) - (b.index ?? 0),
  );

  const photos: CommonsPhoto[] = [];
  for (const page of pages) {
    const photo = toPhoto(page);
    if (!photo) continue;
    photos.push(photo);
    if (photos.length >= needed) break;
  }
  return photos;
}

export function commonsSearchTerms(commonName: string, scientificName: string): string[] {
  const common = commonName.trim();
  const scientific = scientificName.trim();
  const terms: string[] = [];
  const preferScientific = GENERIC_COMMON_NAMES.has(common.toLowerCase());

  if (preferScientific) {
    if (scientific) terms.push(scientific);
    if (common) terms.push(common);
  } else {
    if (common) terms.push(common);
    if (scientific) terms.push(scientific);
  }

  return [...new Set(terms)];
}

export async function findPlantPhotos(
  commonName: string,
  scientificName: string,
): Promise<CommonsPhoto[]> {
  const seen = new Set<string>();
  const photos: CommonsPhoto[] = [];

  for (const term of commonsSearchTerms(commonName, scientificName)) {
    if (photos.length >= PHOTO_LIMIT) break;
    const found = await searchCommons(term, PHOTO_LIMIT - photos.length);
    for (const photo of found) {
      if (seen.has(photo.pageUrl)) continue;
      seen.add(photo.pageUrl);
      photos.push(photo);
      if (photos.length >= PHOTO_LIMIT) break;
    }
  }

  return photos;
}
