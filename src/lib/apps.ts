import { APP_STORE_DEVELOPER_ID, type ShippedApp } from "@/data/shipped";

/**
 * Fetches this developer's App Store catalogue with full screenshot galleries.
 * The developer lookup lists the apps but truncates each app's screenshots, so
 * we enrich each with an individual lookup. Cached daily. Used by both the home
 * page (server-rendered) and /api/apps — one source of truth (D-017).
 */

interface ItunesApp {
  kind?: string;
  trackId: number;
  trackName: string;
  artworkUrl512?: string;
  artworkUrl100?: string;
  screenshotUrls?: string[];
  trackViewUrl?: string;
  primaryGenreName?: string;
}

async function lookup(query: string): Promise<ItunesApp[]> {
  const res = await fetch(`https://itunes.apple.com/lookup?${query}`, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`itunes ${res.status}`);
  const data = (await res.json()) as { results?: ItunesApp[] };
  return data.results ?? [];
}

export async function getShippedApps(): Promise<ShippedApp[]> {
  try {
    const list = (await lookup(`id=${APP_STORE_DEVELOPER_ID}&entity=software&limit=50`)).filter((r) => r.kind === "software");

    const apps: ShippedApp[] = await Promise.all(
      list.map(async (base) => {
        let screenshots = base.screenshotUrls ?? [];
        try {
          const [full] = await lookup(`id=${base.trackId}`);
          if (full?.screenshotUrls?.length) screenshots = full.screenshotUrls;
        } catch {
          /* keep whatever the developer lookup gave */
        }

        // Apply local fallback if iTunes API failed to provide screenshots
        if (screenshots.length === 0) {
          const n = base.trackName.toLowerCase();
          if (n.includes("most likely")) screenshots = ["/shots/most-likely-to-0.png", "/shots/most-likely-to-1.png", "/shots/most-likely-to-2.png", "/shots/most-likely-to-3.png"];
          else if (n.includes("never ever")) screenshots = ["/shots/never-ever-0.jpg", "/shots/never-ever-1.jpg", "/shots/never-ever-2.jpg", "/shots/never-ever-3.jpg"];
          else if (n.includes("scan qr")) screenshots = ["/shots/new-scan-qr-0.png", "/shots/new-scan-qr-1.png", "/shots/new-scan-qr-2.png", "/shots/new-scan-qr-3.png"];
          else if (n.includes("rouly")) screenshots = ["/shots/rouly-0.png", "/shots/rouly-1.png", "/shots/rouly-2.png", "/shots/rouly-3.png"];
          else if (n.includes("yikes")) screenshots = ["/shots/yk-0.png", "/shots/yk-1.png", "/shots/yk-2.webp", "/shots/yk-3.png"];
          else if (n.includes("buzz")) screenshots = ["/shots/buzz-0.png", "/shots/buzz-1.png", "/shots/buzz-2.png", "/shots/buzz-3.png"];
          else if (n.includes("note")) screenshots = ["/shots/note-0.png", "/shots/note-1.png", "/shots/note-2.png", "/shots/note-3.png"];
          else if (n.includes("wenlambo")) screenshots = ["/shots/wenlambo_0.png", "/shots/wenlambo_1.png", "/shots/wenlambo_2.png", "/shots/wenlambo_3.png"];
          else if (n.includes("focus")) screenshots = ["/shots/focus_0.png", "/shots/focus_1.png", "/shots/focus_2.png", "/shots/focus_3.png"];
          else if (n.includes("dilemma")) screenshots = ["/shots/dilem_0.png", "/shots/dilem_1.png", "/shots/dilem_2.png", "/shots/dilem_3.png"];
        }

        return {
          id: base.trackId,
          name: base.trackName,
          icon: base.artworkUrl512 ?? base.artworkUrl100 ?? "",
          screenshots: screenshots.slice(0, 8),
          url: base.trackViewUrl ?? "",
          genre: base.primaryGenreName ?? "",
        };
      }),
    );

    // apps with a real screenshot gallery lead — they get the richest treatment
    return apps
      .filter((a) => a.icon)
      .sort((a, b) => {
        const aTop = a.name.includes("VocabTunes") || a.name.includes("King English") ? 1 : 0;
        const bTop = b.name.includes("VocabTunes") || b.name.includes("King English") ? 1 : 0;
        if (aTop !== bTop) return bTop - aTop;

        return (b.screenshots.length > 0 ? 1 : 0) - (a.screenshots.length > 0 ? 1 : 0);
      });
  } catch {
    return [];
  }
}
