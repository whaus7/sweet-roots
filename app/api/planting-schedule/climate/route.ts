import { getClimateStats } from "@/app/planting-schedule/lib/climate";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return Response.json(
      { error: "Provide lat and lon" },
      { status: 400 },
    );
  }

  try {
    const climate = await getClimateStats(lat, lon);
    return Response.json(climate);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Climate data unavailable";
    return Response.json({ error: message }, { status: 502 });
  }
}
