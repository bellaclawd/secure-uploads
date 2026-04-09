import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { PUBLIC_PAGES } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PAGES.map((page) => ({
    url: `${SITE_URL}${page.href}`,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
    lastModified: new Date(),
  }));
}
