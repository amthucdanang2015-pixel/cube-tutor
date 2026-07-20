import type { Metadata } from "next";
import { CubeTutorApp } from "@/components/cube-tutor/CubeTutorApp";

export const metadata: Metadata = {
  title: "Cube Tutor 3D",
  description: "Teach children and beginners why the Rubik's Cube works, not just the moves.",
};

export default function CubeTutorPage() {
  return (
    <div className="min-h-screen bg-ink text-white">
      <CubeTutorApp />
    </div>
  );
}
