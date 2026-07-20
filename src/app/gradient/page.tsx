import { GradientTool } from "@/components/gradient/GradientTool";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AURORA — living gradient studio | TasteLoop",
  description:
    "Design living gradient backgrounds with linear, radial and orbit layouts, layered treatments, an animation timeline, and high-resolution still or video export.",
};

export default function GradientPage() {
  return <GradientTool />;
}
