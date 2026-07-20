import { CubeTutorApp } from "@/components/cube-tutor/CubeTutorApp";

export const revalidate = 86400;

export default async function Home() {
  return <CubeTutorApp />;
}
