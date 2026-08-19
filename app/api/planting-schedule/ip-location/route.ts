import { placeFromHeaders } from "@/app/planting-schedule/lib/request-place";

export async function GET() {
  const place = await placeFromHeaders();
  if (!place) {
    return Response.json({ error: "Could not detect location" }, { status: 404 });
  }
  return Response.json(place);
}
