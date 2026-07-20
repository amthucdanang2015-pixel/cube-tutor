import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(import.meta.dirname),
  async redirects() {
    // Old offer surfaces consolidate to /work (constitution §4).
    return [
      { source: "/audit", destination: "/work", permanent: false },
      { source: "/build", destination: "/work", permanent: false },
      { source: "/services", destination: "/work", permanent: false },
      { source: "/services/:slug", destination: "/work", permanent: false },
      { source: "/pricing", destination: "/work", permanent: false },
      { source: "/pro", destination: "/work", permanent: false },
      { source: "/tools/vibe-audit", destination: "/work", permanent: false },
      // Design-studies surface retired for now; the home showcase is the proof (D-017).
      { source: "/redesigns", destination: "/", permanent: false },
      // /styles grew into the multi-product playground (D-021).
      { source: "/styles", destination: "/playground/flowtime", permanent: false },
      { source: "/styles/live", destination: "/playground/flowtime/live", permanent: false },
    ];
  },
};

export default nextConfig;
