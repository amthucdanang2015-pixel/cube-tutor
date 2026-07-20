export interface LoopStage {
  name: string;
  verb: string;
  human: string;
  agent: string;
  evidence: string;
  output: string;
}

export const LOOP_STAGES: LoopStage[] = [
  {
    name: "Signal",
    verb: "Find what is true",
    human: "Choose the customer, problem, and moment worth understanding.",
    agent: "Organize interviews, behavior, support, market, and product signals.",
    evidence: "Observed behavior, direct customer language, or product data.",
    output: "A signal brief with assumptions marked.",
  },
  {
    name: "Decide",
    verb: "Make the trade-off",
    human: "Own the bet, the non-goals, and the reason this matters now.",
    agent: "Model options, constraints, risks, and second-order effects.",
    evidence: "A decision must trace back to the signal and business reality.",
    output: "A decision record and a kill criterion.",
  },
  {
    name: "Make",
    verb: "Create the smallest truth",
    human: "Set the taste bar and protect the critical product idea.",
    agent: "Accelerate research synthesis, design variants, code, and production work.",
    evidence: "A working slice must answer the decision—not merely look complete.",
    output: "A testable product slice in real code.",
  },
  {
    name: "Review",
    verb: "Hold the gate",
    human: "Judge clarity, usefulness, craft, risk, and commercial coherence.",
    agent: "Run systematic checks across states, accessibility, code, and content.",
    evidence: "The slice passes explicit product and quality gates.",
    output: "A review record: keep, change, or reject.",
  },
  {
    name: "Test",
    verb: "Meet reality",
    human: "Choose the right people, question, and threshold for belief.",
    agent: "Instrument behavior, prepare sessions, and capture structured feedback.",
    evidence: "Observed use, conversion, comprehension, reliability, or willingness to pay.",
    output: "A reality report, including disconfirming evidence.",
  },
  {
    name: "Learn",
    verb: "Change the belief",
    human: "Interpret what the evidence means and what it does not mean.",
    agent: "Compare outcomes with the original assumptions and surface patterns.",
    evidence: "A learning needs more than preference; it must affect a decision.",
    output: "An updated belief and recommended next move.",
  },
  {
    name: "Codify",
    verb: "Strengthen the system",
    human: "Turn useful judgment into a standard the team will actually keep.",
    agent: "Update reusable skills, tests, tokens, prompts, and product knowledge.",
    evidence: "The correction prevents repeated ambiguity or repeated failure.",
    output: "A rule, skill, test, token, or removed footgun.",
  },
  {
    name: "Repeat",
    verb: "Run a better loop",
    human: "Choose the next most important decision and remain accountable for it.",
    agent: "Carry forward context and accelerate the next pass without resetting to zero.",
    evidence: "The next loop begins with stronger context than the last.",
    output: "A narrower, faster, better-informed next loop.",
  },
];

export const OPEN_LOOP_AREAS = [
  {
    href: "/playground",
    name: "Playground",
    label: "Taste made visible",
    description: "Working products across 112 design languages, with live switching and copyable direction.",
  },
  {
    href: "/animations",
    name: "Animations",
    label: "Motion with purpose",
    description: "A live vocabulary of motion patterns, replayable and ready to direct agents with precision.",
  },
  {
    href: "/gradient",
    name: "AURORA",
    label: "Creative engineering in public",
    description: "A production-grade living-gradient studio with real editing and export tools.",
  },
] as const;

export const PRINCIPLES = [
  "Agents make. Humans decide.",
  "Reality corrects the loop.",
  "Every correction strengthens the system.",
  "Building became faster. Choosing became more important.",
  "Roles remain. Handoffs weaken. Ownership becomes stronger.",
  "More output is not the goal. Better products are.",
] as const;
