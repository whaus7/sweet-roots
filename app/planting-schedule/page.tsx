import HeroBanner from "@/app/components/HeroBanner";
import { LocationPicker } from "@/app/planting-schedule/components/location-picker";
import { PlantList } from "@/app/planting-schedule/components/plant-list";
import { UnitToggle } from "@/app/planting-schedule/components/unit-provider";
import { describeClimate, getClimateStats } from "@/app/planting-schedule/lib/climate";
import { formatLongDate, todayInTimeZone } from "@/app/planting-schedule/lib/dates";
import { needsCityName, parseCoord, parsePlaceName, reverseGeocode } from "@/app/planting-schedule/lib/location";
import { loadPlants } from "@/app/planting-schedule/lib/plants";
import { placeFromHeaders } from "@/app/planting-schedule/lib/request-place";
import { isVarietyInWindow, scorePlants } from "@/app/planting-schedule/lib/score";

type SearchParams = Promise<{
  lat?: string | string[];
  lon?: string | string[];
  place?: string | string[];
}>;

export default async function PlantingSchedulePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  let latitude = parseCoord(params.lat);
  let longitude = parseCoord(params.lon);
  let placeName = parsePlaceName(params.place);

  if (latitude == null || longitude == null) {
    const detected = await placeFromHeaders();
    if (detected) {
      latitude = detected.latitude;
      longitude = detected.longitude;
      placeName = detected.displayName;
    }
  }

  if (latitude != null && longitude != null && needsCityName(placeName)) {
    const reversed = await reverseGeocode(latitude, longitude);
    if (reversed?.displayName) placeName = reversed.displayName;
  }

  let climateError: string | null = null;
  const climate =
    latitude != null && longitude != null
      ? await getClimateStats(latitude, longitude).catch((error: unknown) => {
          climateError =
            error instanceof Error
              ? error.message
              : "Climate data is unavailable right now.";
          return null;
        })
      : null;

  const today = climate ? todayInTimeZone(climate.timezone) : null;
  const items =
    climate && today ? scorePlants(loadPlants(), climate, today) : [];
  const inWindowCount = items.filter(isVarietyInWindow).length;

  return (
    <div className="min-h-screen" style={{ background: "#fcfcfc" }}>
      <HeroBanner
        title="What to plant today"
        subtitle="Unique and lesser-known vegetables, fruit, asian greens and herbs with serious flavor ranked by how well recent average temperatures match each crop."
        backgroundImage="/images/planting-produce-watercolor.jpg"
        altText="Watercolor collage of fruits and vegetables on a white background"
        ink="dark"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20 mt-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <LocationPicker
            currentPlace={placeName}
            latitude={latitude ?? undefined}
            longitude={longitude ?? undefined}
          />
          <div className="flex items-center gap-3 pb-1">
            {today ? (
              <p className="text-sm text-gray-600">{formatLongDate(today)}</p>
            ) : null}
            <UnitToggle />
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Location is estimated from your network. Search to change it.
        </p>
        {climate && today ? (
          <p className="mt-1 text-sm text-gray-600">
            {describeClimate(climate, today)}
          </p>
        ) : null}

        <div className="mt-8">
          {climateError ? (
            <p className="rounded-2xl border border-dashed border-gray-200 px-6 py-16 text-center text-gray-600">
              {climateError}
            </p>
          ) : latitude == null || longitude == null ? (
            <p className="rounded-2xl border border-dashed border-gray-200 px-6 py-16 text-center text-gray-600">
              We couldn&apos;t estimate your location from the network (common on
              localhost). Search a city to see what to plant.
            </p>
          ) : (
            <>
              <p className="mb-4 text-sm text-gray-600">
                {inWindowCount}{" "}
                {inWindowCount === 1 ? "variety is" : "varieties are"} in range
                for recent temperatures this month, sorted by whether a sowing
                today can finish before the good months run out.
              </p>
              <PlantList items={items} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
