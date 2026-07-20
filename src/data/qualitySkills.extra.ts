import type { QualitySkill, Stack } from "./qualitySkills";

/**
 * Depth layer for the Quality Skills library (D-023):
 * - MORE_SKILLS: skills the base set was missing (teardowns, agent specs,
 *   layout, dependencies, component APIs, responsive, AI code review, config).
 * - SMELLS: per-skill red flags — "you have this problem if…".
 * - VERIFY: per-skill single concrete test that proves the gate held.
 * Merged into QUALITY_SKILLS at module load (see qualitySkills.ts bottom).
 */

const ALL: Stack[] = ["Any stack"];
const WEB: Stack[] = ["Next.js / React", "Mobile", "Any stack"];

/** The Essential 10 (D-024) — if you adopt nothing else, adopt these. Chosen for
 *  damage prevented per minute invested: they catch the failures that cost real
 *  money (payments, auth), real trust (states, taste), and real weeks (specs,
 *  AI review). Shown with a ★ and their own filter. */
export const ESSENTIALS = [
  "prompt-spec",
  "spec-cut",
  "every-state-designed",
  "frontend-taste",
  "honest-api",
  "auth-authz",
  "payments-that-balance",
  "unit-test-the-logic",
  "ai-code-review",
  "launch-floor",
];

export const MORE_SKILLS: QualitySkill[] = [
  {
    slug: "competitive-teardown",
    phase: "discovery",
    title: "Steal the bar, not the pixels",
    oneLiner: "Tear down the three best competitors before designing anything.",
    gate: [
      "Three best-in-class products torn down from screenshots, not memory",
      "For each: what they observably do best (load choreography, states, copy, pricing framing)",
      "The bar is written: 'ours must feel at least as X as Y's Z'",
      "One deliberate divergence chosen — and why it wins for OUR user",
      "Inferred internals are labeled inference, never presented as fact",
    ],
    prompt:
      "Before designing any significant surface, tear down the three best products with a similar job. Work from real screenshots and recordings, not memory. For each, extract what is observably excellent: first-load choreography, empty/loading/error states, copy tone, information density, pricing presentation, motion discipline. Write the explicit quality bar as sentences ('our onboarding must reach first value faster than X's'). Choose one deliberate divergence and defend it in one paragraph. Never dress inference as fact — 'their backend probably…' is labeled speculation or cut. The goal is their bar, not their pixels: copying layouts produces a worse version of someone else's product.",
    stacks: ALL,
  },
  {
    slug: "prompt-spec",
    phase: "spec",
    title: "Specs written for agents",
    oneLiner: "An AI agent is your fastest junior — brief it like one, verify it like one.",
    gate: [
      "Context in the prompt: what exists, file paths, stack, constraints",
      "One task per prompt with a testable definition of done",
      "Style examples included (a good sample beats three adjectives)",
      "Forbidden moves stated: no new deps, no schema changes, no drive-by refactors",
      "Output reviewed against the spec line by line — never skimmed and merged",
    ],
    prompt:
      "When delegating work to an AI agent, write the spec as a contract. Include: (1) current state — relevant files, stack, existing patterns to follow; (2) exactly one task with a testable definition of done; (3) an example of the desired output style — one good sample beats three adjectives; (4) explicit forbidden moves (no new dependencies, no schema changes, no refactors outside the task); (5) how the result will be verified. After the agent responds, review against the spec item by item — an agent that 'did something impressive' has not necessarily done the task. If two instructions conflict, the agent will pick one silently: resolve conflicts in the spec, not in review.",
    stacks: ALL,
  },
  {
    slug: "layout-composition",
    phase: "design",
    title: "Layout carries the meaning",
    oneLiner: "Hierarchy, grid, and whitespace do the talking before color does.",
    gate: [
      "One clear focal point per screen; the eye path is deliberate, not accidental",
      "Everything sits on the spacing grid — no 13px oddballs",
      "Type scale ≤ 5 sizes per surface; weight and size carry hierarchy, not color alone",
      "Whitespace groups meaning: related things close, unrelated things apart",
      "The squint test passes: blur the text and the structure still reads correctly",
    ],
    prompt:
      "Compose layouts so structure alone communicates: decide the single focal point of each screen and the order the eye should travel, then enforce it with size, weight, and position — before touching color. Snap every margin, padding, and gap to the spacing grid; a 13px one-off is a bug. Cap the type scale at five sizes per surface and let weight do hierarchy work. Use whitespace as grouping: tighten within a concept, widen between concepts — a border you can delete by spacing better is a border too many. Test by squinting (or blurring the mock): if the hierarchy disappears without legible text, the layout isn't carrying meaning. Generic symmetric layouts are a smell; start from the content's own shape.",
    stacks: ALL,
  },
  {
    slug: "dependency-diet",
    phase: "architecture",
    title: "Every dependency is a hire",
    oneLiner: "Each package is code you now maintain but didn't write — interview it first.",
    gate: [
      "Every dependency justified by name and job; no two deps doing the same job",
      "Lockfile committed; upgrades are scheduled work, not vibes",
      "Anything you could write in ~50 lines is written, not installed",
      "License + maintenance health checked before adopting (last release, issues, bus factor)",
      "The removal path is known: what breaks and what replaces it if this dep dies",
    ],
    prompt:
      "Treat every dependency as a hire: it joins your codebase, ships its bugs with your name on them, and must be managed. Before adding one, answer in writing: what job does it do, why not the platform or ~50 lines of our own code, is it maintained (recent releases, open issue triage, more than one maintainer), and what's the license? Never carry two packages doing the same job. Commit the lockfile and treat upgrades as scheduled work with a changelog read — not an accident of reinstalling. For each significant dep, know the exit: what breaks if it's abandoned and what would replace it. When an agent proposes adding a package, the default answer is no until the justification exists.",
    stacks: ALL,
  },
  {
    slug: "component-api-design",
    phase: "frontend",
    title: "Components with honest APIs",
    oneLiner: "Props speak the domain; variants are unions; composition beats configuration.",
    gate: [
      "Props read as the domain ('dueDate'), not the implementation ('leftPadding')",
      "Variants are unions ('variant=\"danger\"'), never boolean soup ('isRed isBig isOutline')",
      "Composition over configuration: children > render props > a 12th boolean flag",
      "One component, one job — the second job becomes a second component",
      "Changing a prop's meaning ships with a migration note, not a silent break",
    ],
    prompt:
      "Design component APIs the way you design REST APIs — for the caller, not the implementation. Props name domain concepts, not CSS ('status', not 'color'). Model variants as a single union prop; three booleans that only make sense in certain combinations are a state machine hiding in a trench coat. Prefer composition: accept children before adding configuration flags, and split the component when it grows a second job. Keep the required-prop count low — sensible defaults are part of the API. When a prop must change meaning, treat it as a breaking change: rename it and leave a migration note. If you can't write the component's job in one sentence, the API isn't done.",
    stacks: WEB,
  },
  {
    slug: "responsive-behavior",
    phase: "frontend",
    title: "Design the in-betweens",
    oneLiner: "Breakpoints come from content, and the widths between them must also work.",
    gate: [
      "Tested at 320 / 375 / 768 / 1024 / 1440 — and one odd width (e.g. 900)",
      "Breakpoints come from where the content breaks, not from device names",
      "Inside frames/embeds, size by container or prop — viewport media queries lie there",
      "Touch targets ≥ 44px; hover-only affordances have a touch equivalent",
      "No horizontal scroll at any width; text wraps rather than truncating meaning",
    ],
    prompt:
      "Design responsive behavior from the content out: a breakpoint exists where the content stops working, not where a device marketing name lives. Verify at 320, 375, 768, 1024, 1440 — and drag slowly through the widths between; the in-betweens are where layouts snap, overlap, and orphan. Inside any simulated frame, embed, or resizable panel, media queries measure the viewport and lie — size by container query or an explicit prop. Keep touch targets at 44px minimum and give every hover-revealed affordance a touch path. Horizontal document scroll is always a bug: find the unclipped decoration or min-content blowout and fix the cause, not with overflow-hidden on body.",
    stacks: WEB,
  },
  {
    slug: "ai-code-review",
    phase: "quality",
    title: "Review AI code like a rival wrote it",
    oneLiner: "Agents produce plausible code — plausible is not correct.",
    gate: [
      "Every AI-suggested API call verified against real docs (hallucination check)",
      "Dead code, unused imports, and duplicate helpers deleted before merge",
      "Error paths genuinely handled — not try/catch-log-continue",
      "Zero behavior changes outside the task's stated scope (diff read fully)",
      "No pasted blocks of unknown origin or incompatible license",
    ],
    prompt:
      "Review AI-generated code as if a very confident junior from a rival team wrote it. First, hallucination-check: every API, prop, and config key must exist in the installed version — verify against real docs, not the agent's confidence. Second, read the whole diff, not the summary: agents make silent out-of-scope changes; anything beyond the task gets reverted. Third, delete the scaffolding: dead code, unused imports, duplicated helpers the agent didn't know existed — search before accepting a 'new' utility. Fourth, inspect error handling: catch-log-continue is not handling, it's hiding. Fifth, reject pasted blocks of unknown origin. The bar is unchanged from human code: you sign what you merge.",
    stacks: ALL,
  },
  {
    slug: "env-config-parity",
    phase: "launch",
    title: "Config is code, environments are honest",
    oneLiner: "One command boots it; a missing variable fails loudly; staging is production-shaped.",
    gate: [
      "All config via environment; .env.example lists every variable with a comment",
      "A missing/invalid env var fails at boot with a named error — not deep at runtime",
      "Staging is production-shaped: same services, same migrations, same flags",
      "Feature flags have owners and expiry dates — no immortal if-statements",
      "A fresh machine boots the app from README alone, no tribal knowledge",
    ],
    prompt:
      "Treat configuration as part of the codebase. Every setting comes from the environment, documented in a committed .env.example with a one-line comment per variable. Validate all env vars at boot against a schema and fail loudly with the variable's name — a missing key discovered at 2am deep in a request handler is a design failure. Keep staging production-shaped: same services, same migration state, same flag defaults; 'works in staging' must mean something. Give every feature flag an owner and an expiry — flags without funerals become permanent forks in your logic. The acceptance test is brutal and simple: a fresh machine, the README, one command — the app boots.",
    stacks: ALL,
  },
];

export const SMELLS: Record<string, string[]> = {
  "problem-brief": ["The solution is named before the user is", "'Users want…' with no quote behind it", "Scope grows mid-build without touching the brief"],
  "spec-cut": ["'Build the backend first' phase plans", "Acceptance criteria that say 'works well'", "A 'quick MVP' already three weeks long"],
  "every-state-designed": ["A blank div where data will appear 'later'", "A lone spinner centered in a void", "Error copy written by the framework, not you"],
  "motion-system": ["Every component animates differently", "Bounce on things that aren't playful", "Width/left/top in an animation"],
  "first-run": ["A signup wall before any value", "An empty dashboard on first login", "A five-step tour nobody reads"],
  "copy-voice": ["'Something went wrong'", "Lorem ipsum on a 'finished' screen", "Buttons that say Submit"],
  "boring-architecture": ["A queue for ten users", "Microservices before product-market fit", "An abstraction with exactly one caller"],
  "data-model-first": ["Validation living only in the API layer", "Tables without created_at", "'We'll add the foreign key later'"],
  "pure-core-logic": ["Business rules inside route handlers", "Boolean flags standing in for states", "Float math touching money"],
  "frontend-taste": ["Hex codes sprinkled through components", "Hover states on half the buttons", "The centered-hero-three-cards template"],
  "performance-budget": ["'Feels fast on my machine'", "A 400 kB hero image", "Analytics loading before content"],
  "accessibility-floor": ["Clickable divs", "Icon buttons with no accessible name", "outline: none with no replacement"],
  "honest-api": ["200 with { error } inside", "A different error shape per endpoint", "Retry logic 'to be added later'"],
  "auth-authz": ["Hand-rolled session/JWT handling", "userId read from the request body", "A secret in the repo 'temporarily'"],
  "payments-that-balance": ["Money stored as floats", "Marking paid from the client-side callback", "No answer to 'what if the webhook fires twice?'"],
  "jobs-and-webhooks": ["Jobs that assume they run exactly once", "Webhook work done inline in the request", "A dead-letter queue nobody reads"],
  "unit-test-the-logic": ["Tests that restate the implementation", "High coverage, zero edge cases", "Mocking the function under test"],
  "e2e-money-path": ["'We test manually before releases'", "Flaky tests skipped 'for now'", "Fixtures full of 'test test test'"],
  "review-bars": ["LGTM within a minute", "Feedback about vibes with no bar named", "Approving what you wouldn't sign"],
  "launch-floor": ["The framework's default 404", "'OG image after launch'", "Rollback plan: 'revert the commit, probably'"],
  "analytics-before-opinions": ["'Log everything, we'll sort it later'", "Dashboards nobody opens", "Errors discovered via user tweets"],
  "postmortem-to-rule": ["The same bug fixed twice", "Lessons living in chat threads", "Postmortems that name a person, not a cause"],
  "competitive-teardown": ["Designing from memory of a competitor", "'They probably use X' stated as fact", "Copying a layout without knowing why it works"],
  "prompt-spec": ["A one-line prompt for a three-file change", "Merging agent output after reading the summary only", "The same correction given to the agent twice"],
  "layout-composition": ["Three things competing to be the focal point", "A 13px margin next to a 16px one", "Borders doing the job whitespace should"],
  "dependency-diet": ["left-pad energy: a dep for 5 lines", "Two date libraries in one lockfile", "npm install as the first response to any problem"],
  "component-api-design": ["isPrimary + isSecondary + isDanger on one component", "A 'flexible' component with 30 props", "Renaming a prop with no migration note"],
  "responsive-behavior": ["Perfect at 375 and 1440, broken at 900", "Hover-only actions on touch screens", "overflow-x: hidden on body as a 'fix'"],
  "ai-code-review": ["An API that doesn't exist in the installed version", "A helper duplicated because the agent didn't search", "A diff touching files the task never mentioned"],
  "env-config-parity": ["Config values pasted in code 'for now'", "Staging on SQLite, production on Postgres", "A feature flag older than the feature"],
};

export const VERIFY: Record<string, string> = {
  "problem-brief": "Hand the brief to someone outside the project — they must restate the problem correctly in one sentence.",
  "spec-cut": "Walk the slice on paper as the named user: every step from open to done exists in the spec.",
  "every-state-designed": "Kill the network and open every screen — each must still look designed.",
  "motion-system": "List every animation and its job in one column; delete anything that has no job.",
  "first-run": "Cold cache, incognito, throttled network: time land → first value; it must beat your stated number.",
  "copy-voice": "Read every string aloud; rewrite any sentence a competent human wouldn't say.",
  "boring-architecture": "For each piece of infra ask: could one senior operate this alone at 3am? If no, the ADR must say why it's worth it.",
  "data-model-first": "Insert invalid data straight into the database — the schema itself must reject it.",
  "pure-core-logic": "Run the core's tests with networking disabled — all must pass.",
  "frontend-taste": "Tab through the surface keyboard-only at 375px — every state visible, nothing overflows.",
  "performance-budget": "Lighthouse the production build on a throttled mobile profile — budgets green or the merge waits.",
  "accessibility-floor": "Complete the money path keyboard-only, then once with a screen reader.",
  "honest-api": "Send malformed input to every endpoint — every response uses the one envelope and an honest status code.",
  "auth-authz": "Swap another user's id into every endpoint (IDOR pass) — expect 403/404 everywhere.",
  "payments-that-balance": "Replay the same webhook event twice in test mode — exactly one state change, and the ledger still balances.",
  "jobs-and-webhooks": "Kill a job halfway and rerun it — the world must end in the same correct state.",
  "unit-test-the-logic": "Plant a deliberate bug in a core rule — a test must catch it, or the suite is decoration.",
  "e2e-money-path": "Run the smoke headlessly from a clean database: signup → result, green, console clean.",
  "review-bars": "Every review comment names its bar; approval states all five were checked.",
  "launch-floor": "Walk the floor checklist against the production build and attach proof for each line.",
  "analytics-before-opinions": "Break the money path in staging — the funnel must show the drop and a human must get paged.",
  "postmortem-to-rule": "Map last month's incidents: each one points to exactly one rule, test, or deleted footgun.",
  "competitive-teardown": "Show the written bar next to screenshots; a teammate can tell which product set each line.",
  "prompt-spec": "Score the agent's output against the spec line by line before merging — every line pass/fail.",
  "layout-composition": "Blur the screen (or squint): the hierarchy must still read; the focal point must still win.",
  "dependency-diet": "Read the lockfile diff on every PR — a new dependency without written justification fails review.",
  "component-api-design": "Write the component's job in one sentence and show a usage example — both must be obvious.",
  "responsive-behavior": "Drag the window slowly from 320 to 1440 — nothing jumps, overlaps, or disappears at any width.",
  "ai-code-review": "Pick three APIs from the diff at random and find them in the official docs for the installed version.",
  "env-config-parity": "Fresh machine, README, one command — the app boots with no tribal knowledge.",
};
