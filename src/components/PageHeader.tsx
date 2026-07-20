import { Reveal } from "./Reveal";

export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <Reveal>
      <p className="text-sm font-medium text-accent2">{eyebrow}</p>
      <h1 className="mt-2 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      {intro && <p className="mt-4 max-w-2xl text-pretty text-white/55">{intro}</p>}
    </Reveal>
  );
}
