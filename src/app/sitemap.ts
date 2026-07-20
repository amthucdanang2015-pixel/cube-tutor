import type { MetadataRoute } from "next";
import { BRAND } from "@/config/brand";

const routes = ["", "/shipped", "/playground", "/playground/flowtime", "/playground/cards", "/skills", "/animations", "/gradient", "/work", "/about"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((path) => ({
    url: `${BRAND.siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/work" || path === "/shipped" ? 0.9 : 0.75,
  }));
}
