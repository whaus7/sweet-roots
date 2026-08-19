import { reverseGeocode, searchCities } from "@/app/planting-schedule/lib/location";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));

  if (query) {
    const results = await searchCities(query);
    return Response.json({ results });
  }

  if (Number.isFinite(lat) && Number.isFinite(lon)) {
    const place = await reverseGeocode(lat, lon);
    return Response.json({ results: place ? [place] : [] });
  }

  return Response.json(
    { error: "Provide q or lat and lon" },
    { status: 400 },
  );
}
