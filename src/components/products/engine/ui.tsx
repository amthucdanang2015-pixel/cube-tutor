"use client";

/* ============================================================================
 * Engine UI primitives (D-028). The small, shared pieces every Playground
 * studio is built from. Extracted verbatim from flowtime's StyleStudio — the
 * golden master — so a second product cannot drift from the first.
 * ==========================================================================*/

export function Facet({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-3.5">
      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-white/35">{label}</p>
      {children}
    </div>
  );
}

export function Chips({ items, value, onPick, render }: { items: [string, string][]; value?: string; onPick: (v: string) => void; render?: (slug: string, name: string) => React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map(([slug, name]) => (
        <button key={slug} onClick={() => onPick(slug)}
          className={`rounded-lg border px-2.5 py-1 text-[11px] transition ${value === slug ? "border-accent2/60 bg-accent2/10 text-accent2" : "border-line text-white/55 hover:text-white"}`}>
          {render ? render(slug, name) : name}
        </button>
      ))}
    </div>
  );
}

export function FilterChip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`rounded-full px-2.5 py-1 text-[11px] capitalize transition ${on ? "bg-white text-ink" : "text-white/45 hover:text-white"}`}>{children}</button>;
}

export function IconBtn({ onClick, label, children }: { onClick: () => void; label?: string; children: React.ReactNode }) {
  return <button onClick={onClick} aria-label={label} className="rounded-full border border-line p-2 text-white/70 transition hover:border-white/30 hover:text-white">{children}</button>;
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="rounded border border-line bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/60">{children}</kbd>;
}

/** Segmented pill row — the studio's one control shape for exclusive choices. */
export function Segmented<T extends string>({ items, value, onPick, label }: { items: { id: T; name: string; hint?: string }[]; value: T; onPick: (v: T) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="flex shrink-0 rounded-full border border-line p-0.5">
      {items.map((it) => (
        <button key={it.id} onClick={() => onPick(it.id)} title={it.hint} aria-pressed={value === it.id}
          className={`rounded-full px-2.5 py-1.5 text-[11px] font-medium transition ${value === it.id ? "bg-white text-ink" : "text-white/50 hover:text-white"}`}>
          {it.name}
        </button>
      ))}
    </div>
  );
}
