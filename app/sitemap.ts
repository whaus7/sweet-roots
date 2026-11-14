import type { MetadataRoute } from "next";
import { site } from "@/app/lib/site";

const PATHS = [
  "/",
  "/store/composting-worms",
  "/store/continuous-flow-through-worm-bins",
  "/store/microgreens",
  "/contact",
  "/about",
  "/details/compaction",
  "/details/brix",
  "/details/plfa",
  "/details/npk",
  "/details/microscopy",
  "/details/cnratio",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({
    url: path === "/" ? site.url : `${site.url}${path}`,
    lastModified: new Date(),
  }));
}
