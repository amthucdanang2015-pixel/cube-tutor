import type { MetadataRoute } from "next";
import { BRAND } from "@/config/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BRAND.name} — ${BRAND.headline}`,
    short_name: BRAND.name,
    description: BRAND.socialDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#0d0d0b",
    theme_color: "#0d0d0b",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
