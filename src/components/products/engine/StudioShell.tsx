/* ============================================================================
 * StudioShell (D-028) — the two-column Playground studio, and nothing else.
 *
 *   LEFT  (aside)   the style configurator. Identical on every product.
 *   RIGHT (section) the living product demo + that product's own controls.
 *
 * It owns the wrappers so no product can restyle its own rail. Adding a product
 * = one folder + one registry entry + two thin pages. Zero engine edits.
 * ==========================================================================*/

export function StudioShell({ rail, stage }: { rail: React.ReactNode; stage: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[320px_1fr]">
      <aside className="scroll-slim order-2 border-t border-line lg:order-1 lg:h-[100svh] lg:overflow-y-auto lg:border-r lg:border-t-0">
        {rail}
      </aside>
      <section className="order-1 flex flex-col px-4 pb-8 pt-16 lg:order-2 lg:h-[100svh] lg:overflow-y-auto lg:px-8 lg:pt-16">
        {stage}
      </section>
    </div>
  );
}
