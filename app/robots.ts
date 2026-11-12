import type { MetadataRoute } from "next";
import { site } from "@/app/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout", "/login", "/api", "/store/raised-bed-panels"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
