import { PageHeader } from "@/components/PageHeader";
import { LandingRoast } from "@/components/tools/LandingRoast";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Landing Page Roast — score your hero in seconds | TasteLoop",
  description: "Paste your hero copy and get clarity, trust, CTA, and differentiation scores, above-the-fold issues, recommended fixes, and a better hero prompt.",
};

export default function RoastPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <PageHeader eyebrow="Free tool" title="Landing Page Roast" intro="Paste your hero. Get an honest score across clarity, trust, CTA, and differentiation — plus the specific fixes and a prompt to rewrite it." />
      <div className="mt-12">
        <LandingRoast />
      </div>
    </div>
  );
}
