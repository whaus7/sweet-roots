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
  const items = climate ? scorePlants(loadPlants(), climate, today ?? undefined) : [];
  const inWindowCount = items.filter(isVarietyInWindow).length;

  return (
    <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col px-5 pb-20 pt-10 sm:px-8">
      <header className="flex flex-col gap-8 border-b border-[var(--rule)] pb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--terracotta)]">
              Year-round planting assistant
            </p>
            <h1 className="mt-2 font-serif text-4xl tracking-tight text-[var(--ink)] sm:text-5xl">
              What to plant today
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {today ? (
              <p className="text-sm text-[var(--ink-muted)]">
                {formatLongDate(today)}
              </p>
            ) : null}
            <UnitToggle />
          </div>
        </div>
        <p className="max-w-2xl text-[var(--ink-muted)]">
          Unique and lesser-known vegetables, fruit, and herbs with serious
          flavor — especially Asian winter greens and kitchen crops from India,
          Africa, and Italy — ranked by how ideal they are to sow in your
          climate right now, outdoors and under an unheated greenhouse.
        </p>
        <div className="flex flex-col gap-1">
          <LocationPicker
            currentPlace={placeName}
            latitude={latitude ?? undefined}
            longitude={longitude ?? undefined}
          />
          {climate ? (
            <p className="text-sm text-[var(--ink-muted)]">
              {describeClimate(climate)}
            </p>
          ) : null}
        </div>
      </header>

      <div className="mt-8 flex-1">
        {climateError ? (
          <p className="rounded-2xl border border-dashed border-[var(--rule)] px-6 py-16 text-center text-[var(--ink-muted)]">
            {climateError}
          </p>
        ) : latitude == null || longitude == null ? (
          <p className="rounded-2xl border border-dashed border-[var(--rule)] px-6 py-16 text-center text-[var(--ink-muted)]">
            Search for a city to see varieties in a good planting window.
          </p>
        ) : (
          <>
            <p className="mb-4 text-sm text-[var(--ink-muted)]">
              {inWindowCount}{" "}
              {inWindowCount === 1 ? "variety is" : "varieties are"} in a
              plantable window today, sorted from most ideal to least.
            </p>
            <PlantList items={items} />
          </>
        )}
      </div>
    </div>
  );
}
