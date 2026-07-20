/**
 * The Quality Skills library (D-021/D-022) — skills, gates, and taste for every
 * phase of real software delivery, built to stop AI slop before it ships.
 *
 * tasteskill.dev covers frontend taste; this covers the whole lifecycle. The
 * model (D-022): NINE phases mirroring how products are actually built —
 * discovery → spec → design → architecture → frontend → backend → quality →
 * launch → operate. Data & auth live INSIDE backend (they are backend duties,
 * not a separate lifecycle stage); motion/first-run/copy live inside design;
 * unit tests and review bars live inside quality.
 *
 * Source of truth for the site UI. The publishable mirror lives in /skills at
 * the repo root (kept in sync manually until the GitHub export ships).
 */

export type PhaseId =
  | "discovery" | "spec" | "design" | "architecture"
  | "frontend" | "backend" | "quality" | "launch" | "operate";

export interface Phase { id: PhaseId; name: string; question: string; covers: string }
export const PHASES: Phase[] = [
  { id: "discovery", name: "Discovery", question: "Are we building the right thing?", covers: "problem, users, evidence" },
  { id: "spec", name: "Spec", question: "Do we agree what done means?", covers: "scope, acceptance, non-goals" },
  { id: "design", name: "Design", question: "Is every state, word, and motion designed?", covers: "flows, states, motion, first-run, copy" },
  { id: "architecture", name: "Architecture", question: "Will this survive success?", covers: "system design, data model, core logic" },
  { id: "frontend", name: "Frontend", question: "Does it feel hand-made and fast?", covers: "taste, performance, accessibility" },
  { id: "backend", name: "Backend", question: "Is the contract honest and the data safe?", covers: "API, auth, payments, jobs, webhooks" },
  { id: "quality", name: "Quality", question: "What breaks, and would we know?", covers: "unit tests, e2e, review bars" },
  { id: "launch", name: "Launch", question: "Is the floor production-grade?", covers: "prod floor, SEO, analytics" },
  { id: "operate", name: "Operate", question: "Does the system get smarter?", covers: "incidents, rules, iteration" },
];

export interface Methodology { id: string; name: string; how: string; loop: PhaseId[] }
export const METHODOLOGIES: Methodology[] = [
  { id: "agile", name: "Agile / Scrum", how: "Discovery and launch bookend releases; spec → quality loops every sprint. Gates are the sprint's definition of done.", loop: ["spec", "design", "architecture", "frontend", "backend", "quality"] },
  { id: "kanban", name: "Kanban / Continuous", how: "Every card walks the full lane left to right. Gates are per-item — nothing merges without its phase gates.", loop: ["spec", "design", "frontend", "backend", "quality", "launch"] },
  { id: "waterfall", name: "Waterfall / Fixed scope", how: "Phases run once, in order, each with a hard exit gate. Right for contracts, compliance, and fixed bids.", loop: ["discovery", "spec", "design", "architecture", "frontend", "backend", "quality", "launch", "operate"] },
  { id: "vibe", name: "AI-first / Solo builder", how: "You + agents. Discovery and spec compress to hours, but the gates stay — they're what separates a product from slop.", loop: ["spec", "design", "frontend", "backend", "quality", "launch", "operate"] },
];

export const STACKS = ["Next.js / React", "Node / API", "Python", "Mobile", "Any stack"] as const;
export type Stack = (typeof STACKS)[number];

export interface QualitySkill {
  slug: string;
  phase: PhaseId;
  title: string;
  oneLiner: string;
  /** the gate: the checklist that must pass before the phase exits */
  gate: string[];
  /** the skill: paste into your agent as a standing instruction */
  prompt: string;
  stacks: Stack[]; // which stacks it applies to ("Any stack" = all)
  /** red flags: you have this problem if… (filled from qualitySkills.extra) */
  smells?: string[];
  /** one concrete test that proves the gate held (filled from qualitySkills.extra) */
  verify?: string;
  /** one of the Essential 10 — highest damage-prevented per minute (D-024) */
  essential?: boolean;
}

const ALL: Stack[] = ["Any stack"];
const WEB: Stack[] = ["Next.js / React", "Mobile", "Any stack"];
const API: Stack[] = ["Node / API", "Python", "Any stack"];

export const QUALITY_SKILLS: QualitySkill[] = [
  /* ---------------- discovery ---------------- */
  {
    slug: "problem-brief",
    phase: "discovery",
    title: "The one-page problem brief",
    oneLiner: "No code until the problem fits on one page a stranger understands.",
    gate: [
      "One named user with one painful problem — not a persona collage",
      "The pain is quoted from a real person, not imagined",
      "One sentence: what changes for them when this ships",
      "What we are NOT building is written down",
      "A kill criterion exists: what result would make us stop",
    ],
    prompt:
      "Before proposing any solution or writing any code, produce a one-page problem brief: (1) the specific user and the moment their problem occurs, (2) evidence it's real (quote, ticket, observed behavior — flag anything assumed), (3) the single outcome that defines success, (4) explicit non-goals, (5) the kill criterion. Refuse to expand scope beyond the brief without updating it first. If evidence is missing, say 'this is an assumption' out loud rather than dressing it as fact.",
    stacks: ALL,
  },

  /* ---------------- spec ---------------- */
  {
    slug: "spec-cut",
    phase: "spec",
    title: "Cut to a shippable slice",
    oneLiner: "Scope is a knife: one thin, end-to-end slice a user can finish.",
    gate: [
      "The slice is end-to-end (UI → logic → data), not a horizontal layer",
      "A named user can complete one real task start-to-finish",
      "Acceptance criteria are testable sentences, not vibes",
      "Everything deferred is listed under 'later' — visible, not forgotten",
      "The slice ships in days, not weeks; if not, cut again",
    ],
    prompt:
      "Turn this idea into the thinnest end-to-end slice a real user can complete. Write acceptance criteria as concrete, testable sentences ('given X, when Y, then Z'). List everything cut under 'Later' so scope loss is explicit and recoverable. Reject horizontal slices ('build the database first') — every slice must touch UI, logic, and data. If the slice can't ship within days, propose the next cut and say what it costs.",
    stacks: ALL,
  },

  /* ---------------- design ---------------- */
  {
    slug: "every-state-designed",
    phase: "design",
    title: "Every state is a designed state",
    oneLiner: "Empty, loading, error, success-after — designed before the happy path ships.",
    gate: [
      "Empty state teaches the first action (not a blank div)",
      "Loading state matches final layout (skeleton, no jumps)",
      "Error state says what happened and what to do next, in human words",
      "The state 2 seconds AFTER success is designed (what does the user see now?)",
      "Flows are drawn before screens; dead ends have exits",
    ],
    prompt:
      "For every screen you design or build, enumerate and implement all five states before polishing the happy path: empty (teach the first action), loading (skeleton that matches final layout — no layout shift), error (plain-language cause + next step + retry), success, and after-success (what the user sees 2 seconds later). A screen missing any state is unfinished. Map the flow before drawing the screen; every dead end needs a way out.",
    stacks: ALL,
  },
  {
    slug: "motion-system",
    phase: "design",
    title: "Motion is a system, not a garnish",
    oneLiner: "One easing family, three durations, every animation has a job.",
    gate: [
      "Easing + duration scale defined as tokens (≈150/250/400ms), used everywhere",
      "Every animation names its job: orient, confirm, or direct attention — decoration-only motion is cut",
      "Only transform and opacity animate; nothing animates layout properties",
      "Entrances run once; ambient loops are slow, subtle, and pause off-screen",
      "prefers-reduced-motion collapses everything to a static or opacity-only fallback",
    ],
    prompt:
      "Define motion as a system before animating anything: one easing family (e.g. cubic-bezier(0.22,1,0.36,1)), a three-step duration scale stored as tokens, and a written rule for what each step is for. Every animation must name its job — orienting (where did this come from), confirming (did my action work), or directing attention. Cut anything that is only decoration. Animate transform and opacity exclusively; never animate width/height/top/left. Never attach a static centering transform and a transform animation to the same element — wrap instead. Entrances play once per session; infinite loops must be slow (6s+), low-amplitude, and honor prefers-reduced-motion with a static pose. If two elements animate at once, one of them is wrong.",
    stacks: WEB,
  },
  {
    slug: "first-run",
    phase: "design",
    title: "The first 60 seconds",
    oneLiner: "Splash, onboarding, first value — the first minute is a designed product surface.",
    gate: [
      "Time-to-first-value is stated and measured ('user sees X within Y seconds')",
      "Splash/boot is a brand moment under 2s — never a dead spinner screen",
      "First session has seeded example content and ONE guided action, not a tour",
      "Signup/permissions are requested AFTER the first value moment, not before",
      "Each first-run step is instrumented; drop-off per step is visible",
    ],
    prompt:
      "Treat the first 60 seconds as its own product surface. Define the first value moment precisely ('user sees their first X within Y seconds') and design backwards from it. Splash and boot are a brand moment, not a spinner: under 2 seconds, choreographed, skippable. The first session is a designed state — seed realistic example content and guide exactly one action; refuse multi-step tours and empty dashboards. Delay signup, permission prompts, and upsells until after the user has felt value once. Instrument every first-run step so drop-off is measurable, and re-walk the flow as a brand-new user after every release — cold cache, incognito, slow network.",
    stacks: ALL,
  },
  {
    slug: "copy-voice",
    phase: "design",
    title: "Words are part of the interface",
    oneLiner: "Human, specific, exact — copy is designed, never placeholder.",
    gate: [
      "Zero lorem ipsum, zero 'Click here', zero 'Something went wrong' without a next step",
      "Buttons say what they do ('Save changes', not 'Submit')",
      "Errors: what happened + what to do, in words a non-engineer understands",
      "Numbers are exact; claims are backed or deleted",
      "One voice line exists ('plain, specific, no hype') and all copy passes it",
    ],
    prompt:
      "Write interface copy as part of the design, never as filler. Buttons state their action ('Save changes', 'Send invoice'); errors state cause and next step in plain language ('Couldn't save — check your connection and retry', never a bare code). No lorem ipsum anywhere at any stage: real copy exposes real layout problems. Numbers are exact ('$9,800/mo', '48 hours'); superlatives without evidence get deleted. Keep one written voice line for the product and reject copy that breaks it. Read every sentence aloud — if it doesn't sound like a competent human said it, rewrite it.",
    stacks: ALL,
  },

  /* ---------------- architecture ---------------- */
  {
    slug: "boring-architecture",
    phase: "architecture",
    title: "Boring architecture, written down",
    oneLiner: "Choose the dullest tech that works, and record why in one page.",
    gate: [
      "Every non-obvious choice has a 5-line ADR: context, decision, alternatives, trade-off, exit path",
      "No new infra a single senior couldn't operate alone",
      "Data flows one direction; components own their state or clearly don't",
      "The 10× question is answered: what breaks at 10× data/users, and is that OK for now",
      "No abstraction until the second concrete use exists",
    ],
    prompt:
      "Default to boring, proven technology; every deviation needs a written 5-line ADR (context, decision, alternatives considered, trade-offs, how we'd back out). Design data to flow one direction. Answer the 10× question explicitly: what breaks at 10× scale, and why that's acceptable today. Refuse speculative abstraction — duplicate once, abstract on the second real use. If asked for microservices, queues, or a new database, first prove the monolith + Postgres can't do it.",
    stacks: ALL,
  },
  {
    slug: "data-model-first",
    phase: "architecture",
    title: "The data model comes first",
    oneLiner: "Schema before endpoints — constraints in the database, not in hope.",
    gate: [
      "Entities, relations, and ownership drawn before any endpoint exists",
      "Invariants live in the schema: NOT NULL, unique, foreign keys, checks",
      "Every table: created_at/updated_at; deletion strategy (hard/soft) decided explicitly",
      "Migrations are reversible and rehearsed against production-shaped data",
      "PII is inventoried: field, purpose, retention, deletion path",
    ],
    prompt:
      "Design the data model before writing endpoints or UI: name the entities, their relations, and who owns each row. Enforce invariants in the schema itself — NOT NULL, unique, foreign keys, and check constraints are not optional garnish; app-level validation is a convenience layer, not the defense. Every table carries created_at/updated_at, and the deletion strategy (hard vs soft) is an explicit decision, not an accident. Write every migration with a tested rollback and rehearse against production-shaped data volumes. Maintain a PII inventory (field, purpose, retention, deletion path) and challenge every new personal field: do we truly need it?",
    stacks: API,
  },
  {
    slug: "pure-core-logic",
    phase: "architecture",
    title: "Business logic is a pure core",
    oneLiner: "Rules live in pure functions; I/O stays at the edges; state machines are explicit.",
    gate: [
      "Business rules live in pure modules with zero imports of network/DB/framework",
      "State is an explicit machine: states and transitions enumerated, illegal states unrepresentable",
      "Money is integer minor units + currency; time is UTC with zones only at display",
      "Domain edge cases are enumerated in types/tests, not tribal knowledge",
      "The core runs and is testable with no server, no browser, no mocks",
    ],
    prompt:
      "Isolate business rules into a pure core: functions and modules that import no network, database, or framework code — I/O lives at the edges and calls in. Model state as an explicit machine: enumerate the states and legal transitions, and make illegal states unrepresentable in the types rather than guarded by scattered ifs. Represent money as integer minor units with a currency, never floats; keep time in UTC and apply timezones only at the display edge. Enumerate domain edge cases (zero, negative, expired, concurrent, duplicate) in types and tests. The proof of a pure core: it runs in a plain test runner with no mocks. If testing a rule requires a server, the rule is in the wrong place.",
    stacks: ALL,
  },

  /* ---------------- frontend ---------------- */
  {
    slug: "frontend-taste",
    phase: "frontend",
    title: "Hand-made over generated",
    oneLiner: "Tokens, motion discipline, and the 100ms rule — the anti-slop frontend bar.",
    gate: [
      "Zero hard-coded colors/sizes — tokens only; one type scale, one spacing grid",
      "Every interactive element: hover, focus-visible, active, disabled, loading states",
      "Motion follows the motion system (one easing family, entrances once)",
      "Every click responds visibly within 100ms",
      "375px wide: no horizontal scroll; keyboard-only: everything reachable",
    ],
    prompt:
      "Build UI exclusively from the project's design tokens — if a value isn't a token, add the token or don't use the value. Every interactive element ships with hover, focus-visible, active, disabled, and loading states. Follow the project's motion system; entrance animations run once. Every interaction must show a response within 100ms. Before calling anything done: tab through it keyboard-only, check 375px for overflow, and delete any decoration that doesn't serve the content. Generic AI layouts (centered hero, three feature cards, gradient blob) are a smell — start from the content's own structure instead.",
    stacks: WEB,
  },
  {
    slug: "performance-budget",
    phase: "frontend",
    title: "Performance is a budget, not a hope",
    oneLiner: "Numbers written down, measured on the production build, enforced at the gate.",
    gate: [
      "Budgets exist in writing: LCP < 2.5s, INP < 200ms, per-route JS budget",
      "Measured against the production build on a throttled profile — never dev mode",
      "Images: sized, lazy below the fold, modern formats; fonts load without layout shift",
      "Every third-party script is justified line-by-line and loads after interactive",
      "The gate fails when a budget is exceeded — no 'we'll optimize later'",
    ],
    prompt:
      "Set performance budgets in writing before building: LCP under 2.5s, INP under 200ms, and a JavaScript budget per route. Measure only against the production build with CPU/network throttling — dev-mode numbers are fiction. Enforce image discipline: explicit dimensions, lazy loading below the fold, modern formats, preconnect to third-party hosts. Load fonts without layout shift (metric-compatible fallback or size-adjust). Justify every third-party script by name and business need; default is no. When a budget is exceeded, treat it as a failing test: the change doesn't merge until it fits or the budget is consciously re-negotiated in writing.",
    stacks: WEB,
  },
  {
    slug: "accessibility-floor",
    phase: "frontend",
    title: "The accessibility floor",
    oneLiner: "Keyboard, contrast, semantics, reduced motion — the floor nobody ships below.",
    gate: [
      "Keyboard-only pass: everything reachable, focus visible, Escape closes overlays",
      "Real semantics: buttons are <button>, links are <a>, inputs have labels",
      "Icon-only controls carry aria-labels; informative images carry real alt text",
      "Contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text and UI chrome",
      "prefers-reduced-motion honored globally and per animated component",
    ],
    prompt:
      "Hold an accessibility floor on every surface: complete keyboard operability (tab order sane, focus always visible, Escape closes any overlay, a skip link exists), real semantics (native button/a/label elements — no clickable divs), aria-labels on icon-only controls, alt text that describes informative images and empty alt on decorative ones, contrast of at least 4.5:1 for body text and 3:1 for large text and UI chrome, and prefers-reduced-motion honored both globally and inside every JS-driven animation. Run the keyboard pass on every new interactive element before it merges, and run a screen-reader pass on the money path once per release. Accessibility issues are bugs, not enhancements.",
    stacks: WEB,
  },

  /* ---------------- backend (owns API, auth, data access, payments, jobs) ---------------- */
  {
    slug: "honest-api",
    phase: "backend",
    title: "The honest API contract",
    oneLiner: "Typed boundaries, one error envelope, no lying 200s.",
    gate: [
      "Every endpoint has a typed request/response schema validated at the boundary",
      "One error envelope everywhere: code, human message, correlation id",
      "Status codes tell the truth — no 200 with { error } inside",
      "Mutations are idempotent or explicitly guarded against replay",
      "Timeouts, retries, and rate limits exist and are written down",
    ],
    prompt:
      "Every API boundary validates input against a schema and rejects loudly — never trust the client. Responses use one consistent envelope; errors carry a machine code, a human-readable message, and a correlation id. Status codes must be honest: no 200-with-error-body, no silent catch-and-continue. Make mutations idempotent (idempotency keys or natural idempotence) and state the timeout/retry policy for every outbound call. If a failure path isn't handled, fail fast and visibly rather than guessing.",
    stacks: API,
  },
  {
    slug: "auth-authz",
    phase: "backend",
    title: "Auth you didn't invent",
    oneLiner: "Proven library, scoped queries, IDOR-tested — identity is not a place to be creative.",
    gate: [
      "Sessions/tokens come from a proven library or provider — nothing hand-rolled",
      "Every query is scoped by the authenticated principal — no 'fetch then filter'",
      "IDOR-tested: swap another user's id into every endpoint, expect 403/404",
      "Secrets live in env/secret manager only; repo history is clean; rotation is possible",
      "Auth events (login, failure, reset, escalation) are logged without leaking credentials",
    ],
    prompt:
      "Never hand-roll authentication: use a proven library or provider for sessions, hashing, and tokens (short-lived access tokens, httpOnly secure cookies, CSRF where cookies are used). Authorization is enforced server-side on every resource access: scope every query by the authenticated principal at the query level — fetching broadly and filtering in application code is a vulnerability, not a pattern. Before shipping any endpoint, run the IDOR test: substitute another user's id and expect 403/404. Secrets exist only in the environment or a secret manager, never in code, git history, or logs, and every secret has a rotation path. Log auth events (login, failed attempt, password reset, privilege change) with enough context to investigate and never enough to leak a credential.",
    stacks: API,
  },
  {
    slug: "payments-that-balance",
    phase: "backend",
    title: "Payments that balance",
    oneLiner: "Integer money, idempotent webhooks, a ledger that reconciles to the cent.",
    gate: [
      "Money is integer minor units + currency everywhere — floats never touch payments",
      "Webhooks: signature-verified, idempotent by event id, safe out of order",
      "Every money state transition is recorded — an auditable trail per order/subscription",
      "Reconciliation runs on a schedule: provider totals match database totals, drift alerts",
      "Test mode covers success, decline, refund, dispute, and duplicate webhook delivery",
    ],
    prompt:
      "Treat payments as a ledger problem, not an API call. Represent money as integer minor units with an explicit currency; floats never touch payment math. Process provider webhooks defensively: verify signatures, deduplicate by event id, and design handlers to be idempotent and correct even when events arrive out of order or twice. Record every state transition (created → paid → refunded → disputed) in an append-style trail you can audit per order. Reconcile on a schedule: totals in the provider dashboard must equal totals in your database, and drift raises an alert, not a shrug. Before launch, walk the full matrix in test mode: success, decline, refund, partial refund, dispute, and duplicate delivery. Never mark anything paid from a client-side callback — only from a verified server-side event.",
    stacks: API,
  },
  {
    slug: "jobs-and-webhooks",
    phase: "backend",
    title: "Background work that survives failure",
    oneLiner: "Idempotent jobs, retries with backoff, dead letters someone actually reads.",
    gate: [
      "Every job is idempotent — running it twice produces the same world",
      "Retries use backoff with a max attempt count; exhausted jobs land in a dead-letter path",
      "Webhook handlers ack fast and process async; slow work never blocks a request",
      "Scheduled work has overlap protection (lock/queue) — two runs can't collide",
      "A failed job is visible to a human within minutes, not discovered by a user",
    ],
    prompt:
      "Design every background job to be idempotent: keyed by a natural identifier so running it twice produces the same result. Retry with exponential backoff and a maximum attempt count, then route to a dead-letter queue that a human is notified about — silent exhaustion is data loss on a delay. Webhook endpoints acknowledge fast (validate, persist, 200) and do real work asynchronously. Protect scheduled work against overlap with locks or single-flight queues, and assume the scheduler will someday fire twice or not at all. Long-running work never blocks a user-facing request: enqueue, return, and notify on completion. For every async path, answer in writing: what happens if this fails halfway?",
    stacks: API,
  },

  /* ---------------- quality ---------------- */
  {
    slug: "unit-test-the-logic",
    phase: "quality",
    title: "Unit-test the logic, not the framework",
    oneLiner: "Pure business rules tested at the edges — where the money bugs live.",
    gate: [
      "Every pure business rule has unit tests: happy path, boundaries, malformed input",
      "Money/date/timezone logic tested at the edges: DST, leap days, rounding, zero, negative",
      "Test names state behavior ('rejects expired coupon'), not methods ('test1')",
      "Only true externals are mocked — never the logic under test",
      "Occasionally break the code on purpose and confirm a test fails (mutation check)",
    ],
    prompt:
      "Unit-test the pure core where the expensive bugs live: business rules, calculations, and state transitions. For each rule cover the happy path, every boundary (zero, negative, empty, maximum, duplicate), and malformed input. Money, dates, and timezones get edge-case tests by default: DST transitions, leap days, rounding direction, currency mismatch. Name tests as behavior specs — 'rejects a coupon after expiry' — so failures read as broken requirements. Mock only true externals (network, clock, randomness); if you must mock the thing you're testing, the design is wrong — fix the design. Periodically run a manual mutation check: break the logic deliberately and confirm a test catches it. A suite that can't catch a planted bug is decoration.",
    stacks: ALL,
  },
  {
    slug: "e2e-money-path",
    phase: "quality",
    title: "One e2e that walks the money path",
    oneLiner: "Signup → core action → visible result, headless, on every merge.",
    gate: [
      "One end-to-end smoke covers the money path and runs on every merge",
      "Every past production bug has a regression test named after the incident",
      "The suite finishes in minutes; flaky tests are fixed or deleted the same week",
      "Console and network are clean during e2e — warnings are failures in waiting",
      "Fixtures look real: names, lengths, unicode — not 'test test test'",
    ],
    prompt:
      "Maintain exactly one end-to-end smoke that walks the money path — sign up, perform the core action, see the result — headlessly, on every merge. Add a regression test named after every bug that ever reached production ('regression: double-charge on retry, 2026-03'). Keep the whole suite fast enough that nobody is tempted to skip it, and treat flaky tests as production bugs: fix or delete within the week. During e2e runs, a console error or unexpected network failure fails the build — warnings are failures in waiting. Use production-shaped fixtures (real-length names, unicode, empty optionals); 'test test test' data hides layout and validation bugs. Don't multiply e2e scenarios — depth belongs in unit tests; e2e proves the wiring.",
    stacks: ALL,
  },
  {
    slug: "review-bars",
    phase: "quality",
    title: "The five review bars",
    oneLiner: "Speed, trust, restraint, scale, voice — ask all five before approving.",
    gate: [
      "Linear bar: every interaction responds < 100ms, zero dead clicks",
      "Stripe bar: every number exact, every claim backed, every edge state designed",
      "Apple bar: something was removed; what remains is intentional",
      "Vercel bar: survives 10× the data without a rewrite",
      "Notion bar: the words sound like a person you'd hire",
    ],
    prompt:
      "Review code and product against five bars, in this order: (1) Speed — does every interaction respond within 100ms with visible state? (2) Trust — are numbers exact, claims backed, empty/loading/error/after-success states present? (3) Restraint — what was removed; does every element serve the one claim of the surface? (4) Scale — does this survive 10× data without a rewrite? (5) Voice — does the copy sound human and specific? Reject with the bar named and a concrete fix, not a vibe. Approve only when you would put your own name on it.",
    stacks: ALL,
  },

  /* ---------------- launch ---------------- */
  {
    slug: "launch-floor",
    phase: "launch",
    title: "The production floor",
    oneLiner: "404s, focus rings, OG cards, budgets — the unglamorous list that separates products from demos.",
    gate: [
      "Designed 404 and error pages; every retired URL redirects",
      "Keyboard: skip link, visible focus, everything operable; reduced-motion honored",
      "Perf budget met against the production build, not dev",
      "OG image, favicon, titles, sitemap, robots, structured data — every share looks intentional",
      "Rollback is one command and has been rehearsed once",
    ],
    prompt:
      "Before any launch, walk the production floor: designed 404/error pages; redirects for every URL that ever existed; keyboard pass (skip link, focus-visible, Escape closes overlays); reduced-motion fallbacks; performance budget verified against the production build, not dev; OG image + favicon + per-page titles + sitemap + robots + structured data; console clean on every route; and a rehearsed one-command rollback. Refuse 'we'll add it after launch' — after launch it's an incident, before launch it's a checklist item.",
    stacks: ALL,
  },
  {
    slug: "analytics-before-opinions",
    phase: "launch",
    title: "Instrument before you argue",
    oneLiner: "The money path emits events; errors page a human; one dashboard answers the question.",
    gate: [
      "The money path emits events end-to-end (view → start → complete) under one naming scheme",
      "Errors are tracked with release tags and source maps; past a threshold, a human is paged",
      "One dashboard answers: are people completing the core action this week?",
      "Every metric on it has an owner and a decision it informs — vanity metrics deleted",
      "No PII in event payloads; consent/DNT respected where required",
    ],
    prompt:
      "Instrument the product before launch so the first debate after launch is settled by data, not volume. Define one event naming scheme (object_action: 'checkout_completed') and emit events along the entire money path — view, start, each drop-off point, completion — plus the activation moment from first-run. Wire error tracking with release tags and source maps, and page a human past a failure threshold; silent errors are an outage of observability. Build exactly one dashboard that answers 'are people completing the core action this week?' — every metric on it must have an owner and a decision it informs; delete vanity numbers. Keep PII out of event payloads and respect consent requirements. When asked to add tracking beyond decisions ('log everything'), push back: data nobody acts on is liability, not insight.",
    stacks: ALL,
  },

  /* ---------------- operate ---------------- */
  {
    slug: "postmortem-to-rule",
    phase: "operate",
    title: "Every scar becomes a rule",
    oneLiner: "The system must get smarter with every failure — or you'll pay for the same bug twice.",
    gate: [
      "Every incident/user complaint gets a 5-line blameless postmortem within 48h",
      "Each postmortem produces exactly one new rule, test, or deleted footgun",
      "Rules live in ONE always-read document, each citing its incident",
      "A rule with no scar behind it is reviewed for deletion quarterly",
      "Error tracking pages a human; silence is treated as an outage of observability",
    ],
    prompt:
      "After every incident, regression, or repeated user complaint, write a 5-line blameless postmortem within 48 hours: what happened, impact, root cause, the one change that prevents recurrence, and where that change now lives (rule, test, or deleted code). Append rules to the project's single living rulebook with the incident cited — never scatter them across docs. Periodically challenge rules that no longer map to a real scar. If errors aren't reaching a human, treat that as its own sev-1.",
    stacks: ALL,
  },
];

/* ---------------- depth layer (D-023): more skills + smells + verify ---------------- */
import { MORE_SKILLS, SMELLS, VERIFY, ESSENTIALS } from "./qualitySkills.extra";

QUALITY_SKILLS.push(...MORE_SKILLS);
for (const s of QUALITY_SKILLS) {
  s.smells = SMELLS[s.slug] ?? s.smells ?? [];
  s.verify = VERIFY[s.slug] ?? s.verify ?? "";
  s.essential = ESSENTIALS.includes(s.slug);
}
