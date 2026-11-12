import type { MetadataRoute } from "next";
import { site } from "@/app/lib/site";

const PATHS = [
  "/",
  "/store/composting-worms",
  "/store/continuous-flow-bins",
  "/store/microgreens",
  "/contact",
  "/about",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({
    url: path === "/" ? site.url : `${site.url}${path}`,
    lastModified: new Date(),
  }));
}
