export function LivingLoop({ className = "" }: { className?: string }) {
  return (
    <figure className={`living-loop ${className}`}>
      <svg
        viewBox="0 0 760 520"
        role="img"
        aria-labelledby="living-loop-title living-loop-description"
        className="h-auto w-full"
      >
        <title id="living-loop-title">The TasteLoop operating system</title>
        <desc id="living-loop-description">
          Many agent outputs converge at a human quality gate. One direction meets real-world feedback, loops back, and becomes a stronger next pass.
        </desc>
        <defs>
          <filter id="loop-soft-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <marker id="loop-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>

        <g className="loop-candidates" fill="none" strokeLinecap="round">
          <path d="M36 98 C154 96 184 184 312 226" />
          <path d="M36 166 C148 164 214 204 312 236" />
          <path d="M36 236 C166 234 224 240 312 246" />
          <path d="M36 306 C158 308 212 282 312 256" />
          <path d="M36 376 C148 380 188 308 312 266" />
        </g>

        <g className="loop-output-dots" aria-hidden="true">
          <circle cx="36" cy="98" r="5" />
          <circle cx="36" cy="166" r="5" />
          <circle cx="36" cy="236" r="5" />
          <circle cx="36" cy="306" r="5" />
          <circle cx="36" cy="376" r="5" />
        </g>

        <path className="loop-selected loop-flow" d="M36 236 C166 234 224 240 320 246" fill="none" strokeLinecap="round" />
        <path className="loop-gate-glow" d="M364 168 L326 324" fill="none" strokeLinecap="round" />
        <path className="loop-gate" d="M364 168 L326 324" fill="none" strokeLinecap="round" />

        <path
          className="loop-reality loop-flow"
          d="M352 246 C456 246 486 162 582 170 C684 178 704 292 637 350 C578 400 458 372 446 292 C439 246 476 217 522 225"
          fill="none"
          strokeLinecap="round"
          markerEnd="url(#loop-arrow)"
        />
        <path
          className="loop-return loop-flow"
          d="M522 225 C469 214 428 226 352 252"
          fill="none"
          strokeLinecap="round"
          markerEnd="url(#loop-arrow)"
        />

        <g className="loop-node">
          <circle cx="582" cy="170" r="17" />
          <circle cx="582" cy="170" r="5" className="loop-node-core" />
        </g>
        <g className="loop-node">
          <circle cx="637" cy="350" r="17" />
          <circle cx="637" cy="350" r="5" className="loop-node-core" />
        </g>

        <g className="loop-labels">
          <text x="36" y="58">many possible outputs</text>
          <text x="286" y="358">human review</text>
          <text x="374" y="184">quality gate</text>
          <text x="548" y="126">real feedback</text>
          <text x="510" y="436">stronger next pass</text>
        </g>
      </svg>
      <figcaption className="sr-only">
        Agents expand the option space. Human judgment chooses what crosses the gate. Reality corrects the choice, and the correction strengthens the next loop.
      </figcaption>
    </figure>
  );
}
