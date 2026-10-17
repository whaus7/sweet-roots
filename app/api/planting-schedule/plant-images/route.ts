import { findPlantPhotos } from "@/app/planting-schedule/lib/commons";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const common = searchParams.get("common")?.trim() ?? "";
  const scientific = searchParams.get("scientific")?.trim() ?? "";

  if (!common && !scientific) {
    return Response.json(
      { error: "Provide common or scientific" },
      { status: 400 },
    );
  }

  try {
    const photos = await findPlantPhotos(common, scientific);
    return Response.json({ photos });
  } catch {
    return Response.json({ photos: [] });
  }
}
