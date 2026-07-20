export type Tier = "free" | "pro";

export interface ShowcaseSite {
  id: number;
  slug: string;
  title: string;
  category: string; // e.g. "Hero", "Scroll", "3D"
  tags: string[];
  concept: string; // first-3-seconds wow
  reference: string; // inspiration pointer
  stack: string[]; // libs the prompt uses
  prompt: string; // copy-paste vibe-coding prompt
  tier: Tier;
  accent: string; // gradient for the card
}

export const SITES: ShowcaseSite[] = [
  {
    id: 1,
    slug: "magnetic-cursor-type",
    title: "Magnetic Cursor-Reactive Type",
    category: "Hero",
    tags: ["cursor", "spring", "variable-font"],
    concept:
      "Oversized headline whose letters repel and attract the cursor over a drifting gradient mesh. Instant 'whoa' on hover.",
    reference: "qclay / Lafys, awsmd — craft à la Motion.dev",
    stack: ["Next.js", "Tailwind", "Motion"],
    prompt:
      "Build a full-screen hero in Next.js + Tailwind + Motion. Center an oversized (clamp 4rem–12rem) variable-font headline \"Ship something real.\" Each letter is its own motion span. On mousemove, letters within ~150px of the cursor translate away with spring physics (stiffness 150, damping 15) and scale 1.05; they ease back when the cursor leaves. Behind the text, an animated conic/radial gradient mesh slowly drifts (20s loop). Add a subtle film-grain overlay. Respect prefers-reduced-motion by disabling the repel. Make it buttery at 60fps.",
    tier: "free",
    accent: "from-violet-500/30 to-cyan-400/20",
  },
  {
    id: 2,
    slug: "horizontal-scroll-story",
    title: "Scroll-Driven Horizontal Story",
    category: "Scroll",
    tags: ["scrolltrigger", "parallax", "cinematic"],
    concept:
      "Vertical scroll moves content sideways through cinematic scenes with multi-speed parallax layers.",
    reference: "Awwwards SOTD, Dilum Sanjaya demos",
    stack: ["Next.js", "GSAP ScrollTrigger", "Lenis"],
    prompt:
      "Create a Next.js section that pins vertically and translates a horizontal track as the user scrolls, using GSAP ScrollTrigger + Lenis smooth scroll. 4 full-viewport panels, each with a headline and an image that parallaxes at a different speed than its panel (foreground faster than background). Add a thin top progress bar tracking scroll. Snap softly between panels. Mobile fallback: stack vertically with fade-in-on-enter. 60fps, prefers-reduced-motion aware.",
    tier: "free",
    accent: "from-amber-400/25 to-rose-500/20",
  },
  {
    id: 3,
    slug: "staggered-card-grid",
    title: "Staggered Card Grid Reveal",
    category: "Grid",
    tags: ["stagger", "3d-tilt", "reveal"],
    concept:
      "Cards cascade in with diagonal stagger on scroll, then tilt in 3D toward the cursor on hover.",
    reference: "HeroUI, coss/ui, animations.dev vocabulary",
    stack: ["Next.js", "Motion"],
    prompt:
      "Build a responsive 3-column card grid in Next.js + Motion. On scroll-into-view, cards animate from y:40, opacity:0, blur(8px) to resting state with a staggered delay (0.06s * index, diagonal order). On hover, each card does a direction-aware 3D tilt (rotateX/rotateY based on cursor position, max 8deg) with a soft shadow lift and a sheen gradient that follows the cursor. Use a spring transition. Keep it accessible and reduced-motion safe.",
    tier: "free",
    accent: "from-emerald-400/25 to-teal-500/20",
  },
  {
    id: 4,
    slug: "animated-gradient-saas-hero",
    title: "Animated Gradient + Noise SaaS Hero",
    category: "Hero",
    tags: ["gradient", "grain", "parallax"],
    concept:
      "A living gradient with grain behind a crisp product UI that floats with subtle parallax. The money shot.",
    reference: "MotionSites.ai, Paper.design",
    stack: ["Next.js", "Tailwind", "WebGL/CSS"],
    prompt:
      "Create a SaaS landing hero in Next.js + Tailwind. Background: an animated multi-stop gradient (a shader-like CSS or a small WebGL plane) that morphs slowly, overlaid with SVG noise at low opacity. Foreground: a headline, subhead, two buttons (primary with an animated gradient border), and a floating product screenshot that gently parallaxes with the cursor (max 12px) and has a soft glow. Buttons have a magnetic hover. Entrance: elements fade+rise in sequence on load. 60fps, reduced-motion aware.",
    tier: "free",
    accent: "from-indigo-500/30 to-fuchsia-500/20",
  },
  {
    id: 5,
    slug: "text-mask-scroll-reveal",
    title: "Text Mask Reveal on Scroll",
    category: "Scroll",
    tags: ["scrub", "editorial", "word-reveal"],
    concept:
      "Lines of a manifesto reveal word-by-word as you scroll, like a teleprompter wiping in.",
    reference: "animations.dev, editorial Awwwards sites",
    stack: ["Next.js", "GSAP ScrollTrigger"],
    prompt:
      "Build a Next.js scroll section where a multi-line paragraph reveals word-by-word tied to scroll progress (GSAP ScrollTrigger scrub). Each word starts at opacity 0.15 and fades to 1 as it crosses the viewport center; already-read words stay lit. Use a large serif for editorial feel. Pin the section while the reveal plays, then release. Add a small blinking caret at the current word. Mobile: same effect, smaller type. Reduced-motion: show all text at full opacity.",
    tier: "free",
    accent: "from-zinc-300/20 to-zinc-500/10",
  },
  {
    id: 6,
    slug: "bento-live-microinteractions",
    title: "Bento Grid with Live Micro-Interactions",
    category: "Grid",
    tags: ["bento", "microinteraction", "counter"],
    concept:
      "Apple-style bento where every tile has its own tiny living animation — a drawing chart, a toggle, a counter.",
    reference: "coss/ui, NextjsShop, Mobbin patterns",
    stack: ["Next.js", "Tailwind", "Motion"],
    prompt:
      "Create an asymmetric bento grid (Next.js + Tailwind + Motion), ~6 tiles of varying sizes. Each tile has a self-contained micro-interaction: (1) a number that counts up when in view, (2) an SVG line chart that draws itself, (3) an animated toggle that flips on a loop, (4) a marquee of logos, (5) a cursor-following spotlight, (6) a notification that slides in periodically. Tiles lift and brighten on hover. Stagger their entrance on scroll-in. Pause off-screen animations for performance.",
    tier: "free",
    accent: "from-sky-400/25 to-blue-600/20",
  },
  {
    id: 7,
    slug: "shared-element-page-morph",
    title: "Page Transition Morph",
    category: "Transition",
    tags: ["shared-element", "FLIP", "view-transitions"],
    concept:
      "Clicking a card morphs it fluidly into the next page's hero. Feels native-app smooth.",
    reference: "transitions.dev, Motion shared layout",
    stack: ["Next.js App Router", "Motion", "View Transitions API"],
    prompt:
      "Build a Next.js (App Router) two-page flow using Motion's layout/shared-element transitions (layoutId). A grid of project cards; clicking one expands that card's image into the detail page's hero with a seamless morph (FLIP). Reverse on back. Add a brief overlay wipe during navigation. Use the View Transitions API where supported, Motion fallback otherwise. Smooth, no flash of unstyled content, reduced-motion aware.",
    tier: "free",
    accent: "from-rose-400/25 to-orange-500/20",
  },
  {
    id: 8,
    slug: "sticky-scroll-feature",
    title: "Sticky Scroll Feature Showcase",
    category: "Scroll",
    tags: ["sticky", "crossfade", "sync"],
    concept:
      "Left text scrolls while the right visual swaps and animates in sync. Classic, premium when motion is right.",
    reference: "Mobbin flows, Stripe-style sites",
    stack: ["Next.js", "GSAP ScrollTrigger"],
    prompt:
      "Create a Next.js sticky-scroll feature section. Left: a column of 4 feature blurbs that scroll normally. Right: a sticky visual panel that crossfades + slides between 4 mockups as the corresponding left block hits the viewport center (IntersectionObserver or GSAP ScrollTrigger). The active left blurb brightens; inactive ones dim. Visual transitions use a spring crossfade with a slight scale. Stack on mobile (visual above its text). 60fps, reduced-motion safe.",
    tier: "free",
    accent: "from-cyan-400/25 to-emerald-500/20",
  },
  {
    id: 9,
    slug: "velocity-marquee",
    title: "Velocity-Reactive Marquee Wall",
    category: "Motion",
    tags: ["marquee", "velocity", "skew"],
    concept:
      "Infinite logo/word marquee that speeds up and skews with scroll velocity. Tactile, alive.",
    reference: "Logggos, LogoInspo, Motion useVelocity",
    stack: ["Next.js", "Motion"],
    prompt:
      "Build an infinite horizontal marquee in Next.js + Motion. Two rows scrolling opposite directions. Use scroll velocity (Motion useScroll + useVelocity) to modulate marquee speed and apply a subtle skewX while scrolling fast, easing back to 0 when idle. Items are logos or words with hover-pause and a slight scale on hover. Seamless loop (duplicate content). GPU-accelerated transforms only. Reduced-motion: static row.",
    tier: "free",
    accent: "from-fuchsia-400/25 to-violet-600/20",
  },
  {
    id: 10,
    slug: "spotlight-dark-hero",
    title: "Cursor-Following Spotlight Dark Hero",
    category: "Hero",
    tags: ["spotlight", "mask", "dark"],
    concept:
      "Near-black hero where a soft light follows the cursor, revealing hidden gradient text and grid lines.",
    reference: "Dark.design, mnmm.xyz, searchsystem",
    stack: ["Next.js", "Tailwind"],
    prompt:
      "Create a dark (#0a0a0a) full-screen hero in Next.js + Tailwind. A radial spotlight (~400px, soft) follows the cursor via a CSS mask/radial-gradient, revealing a faint dotted grid and a gradient headline that's nearly invisible outside the light. CTA button glows when the spotlight is over it. Spotlight eases toward the cursor with lerp for smoothness. On touch devices, the spotlight slowly auto-orbits. Reduced-motion: static dim reveal. 60fps.",
    tier: "free",
    accent: "from-violet-600/30 to-slate-500/10",
  },
  {
    id: 11,
    slug: "3d-product-scroll-spin",
    title: "3D Product Spin on Scroll",
    category: "3D",
    tags: ["r3f", "scroll", "exploded-view"],
    concept:
      "A 3D object rotates and explodes/assembles as you scroll. The Dilum-grade flex.",
    reference: "Dilum Sanjaya demos, SceneAI, Paper.design",
    stack: ["Next.js", "React Three Fiber", "drei"],
    prompt:
      "Build a Next.js + React Three Fiber scene: load a glTF model (use a primitive like a torus knot or a simple device mesh if none). Tie scroll progress to camera orbit + model rotation (drei ScrollControls). At thresholds, parts of the model separate (exploded view) then reassemble. Add soft studio lighting, an environment map, and contact shadows. Lazy-load the canvas; show a CSS fallback poster on mobile/low-power. Cap DPR for perf. Reduced-motion: static beauty shot.",
    tier: "pro",
    accent: "from-orange-400/25 to-red-500/20",
  },
  {
    id: 12,
    slug: "liquid-gooey-cursor",
    title: "Liquid Gooey Cursor & Buttons",
    category: "Cursor",
    tags: ["goo-filter", "metaball", "lerp"],
    concept:
      "A gooey metaball cursor merges with buttons; buttons stretch like liquid on hover.",
    reference: "qclay, Lafys, awsmd",
    stack: ["Next.js", "SVG filters"],
    prompt:
      "Create a custom liquid cursor in Next.js using an SVG goo filter (feGaussianBlur + feColorMatrix). A trailing metaball follows the cursor with lerp; when over interactive elements it merges into a larger blob and the element scales/stretches with a gooey ease. Hide the native cursor. Buttons get a liquid fill-from-center on hover. Disable on touch + reduced-motion. Keep the goo filter performant (limit blur radius).",
    tier: "pro",
    accent: "from-lime-400/25 to-emerald-600/20",
  },
  {
    id: 13,
    slug: "kinetic-typography-loop",
    title: "Kinetic Typography Loop",
    category: "Type",
    tags: ["kinetic", "3d-flip", "loop"],
    concept:
      "Words scale, rotate, and swap on a hypnotic loop — the kind of thing that gets 500 likes on X.",
    reference: "Paper.design, awsmd, kinetic-type Awwwards",
    stack: ["Next.js", "Motion"],
    prompt:
      "Build a Next.js + Motion kinetic typography hero. A single rotating word (\"real / fast / yours / shipped\") swaps every 1.8s with a 3D flip + blur transition. Surrounding static words (\"Build something ___\") stay fixed. Add a looping mask-reveal underline and a slight character-level jitter on the active word. Center everything, big variable font. Pause on tab blur. Reduced-motion: simple crossfade swap.",
    tier: "pro",
    accent: "from-pink-400/25 to-purple-600/20",
  },
  {
    id: 14,
    slug: "drag-physics-gallery",
    title: "Drag-to-Explore Physics Gallery",
    category: "Gallery",
    tags: ["drag", "inertia", "infinite"],
    concept:
      "A canvas of images you fling and drag with momentum, like a physical board.",
    reference: "Savee, a1.gallery, Minimal Gallery",
    stack: ["Next.js", "Motion"],
    prompt:
      "Create a draggable infinite image canvas in Next.js + Motion. Images laid on a 2D plane; user drags to pan with inertia/momentum (Motion drag + dragMomentum). Content wraps infinitely in all directions. Hovering an image scales it and dims neighbors; clicking opens a lightbox with a shared-element morph. Add velocity-based slight rotation on the images while flinging. Touch + mouse. Reduced-motion: static scrollable grid.",
    tier: "pro",
    accent: "from-teal-400/25 to-sky-600/20",
  },
  {
    id: 15,
    slug: "morphing-svg-blob",
    title: "Morphing SVG Path Hero",
    category: "Hero",
    tags: ["morph", "svg", "blob"],
    concept:
      "A blob morphs continuously and bulges toward the cursor; text sits in the negative space.",
    reference: "Paper.design, mnmm.xyz",
    stack: ["Next.js", "GSAP MorphSVG / Flubber"],
    prompt:
      "Build a Next.js hero with a large morphing SVG blob using Flubber or GSAP MorphSVG (or animate a path's d via a few keyframe shapes). The blob breathes on a loop and bulges toward the cursor. Fill it with an animated gradient. Headline sits over/around it with mix-blend-mode for contrast. Add floating small shapes with parallax. Reduced-motion: static blob. Keep paths optimized.",
    tier: "pro",
    accent: "from-violet-400/25 to-indigo-600/20",
  },
  {
    id: 16,
    slug: "terminal-code-reveal",
    title: "Terminal / Code-Reveal Aesthetic",
    category: "Hero",
    tags: ["terminal", "typewriter", "crt"],
    concept:
      "A faux terminal types out a story with a CRT glow — perfect for dev-tool audiences.",
    reference: "DesignPrompts.dev 'terminal' style, searchsystem",
    stack: ["Next.js", "Tailwind"],
    prompt:
      "Create a Next.js terminal-style hero. A monospaced 'console' types out lines (typewriter effect, blinking caret, realistic timing) describing the product, with syntax-highlighted tokens and occasional '$ command' prompts. Subtle CRT scanline + flicker + green/amber phosphor glow (toggleable theme). A real, focusable input at the bottom that responds to a couple of fake commands (help, ship). Reduced-motion: render full text instantly. Accessible (announce content).",
    tier: "pro",
    accent: "from-green-400/25 to-emerald-700/20",
  },
  {
    id: 17,
    slug: "image-trail-cursor",
    title: "Image Trail on Mouse Move",
    category: "Cursor",
    tags: ["trail", "throttle", "high-energy"],
    concept:
      "Trailing images spawn and fade along the cursor path across a hero — high-energy, very shareable.",
    reference: "awsmd, Codrops-style effects, qclay",
    stack: ["Next.js", "Motion"],
    prompt:
      "Build a Next.js hero where moving the mouse spawns a trail of images (from a small set) that appear at intervals along the path, each scaling up then fading/falling away (Motion). Throttle spawning by distance moved. Headline stays centered above the trail. Limit concurrent images for perf; recycle DOM nodes. Disable on touch; reduced-motion shows a static collage. 60fps.",
    tier: "pro",
    accent: "from-rose-400/25 to-pink-600/20",
  },
  {
    id: 18,
    slug: "stat-choreography",
    title: "Scroll-Triggered Stat Choreography",
    category: "Scroll",
    tags: ["count-up", "odometer", "draw"],
    concept:
      "Big stats count up and bars draw in a tight sequence — great for 'results' sections that sell.",
    reference: "Stripe / Linear-style, Mobbin",
    stack: ["Next.js", "Motion"],
    prompt:
      "Create a Next.js + Motion stats section. On scroll-in, 3 large metrics count up (easeOut, ~1.2s) while accompanying bars/rings draw to their value, staggered 0.15s apart. Add a subtle odometer roll on the digits. Numbers glow briefly when they finish. Include a small animated sparkline per stat. Reduced-motion: show final values instantly. Pause until in view.",
    tier: "pro",
    accent: "from-blue-400/25 to-indigo-600/20",
  },
  {
    id: 19,
    slug: "glassmorphism-floating-ui",
    title: "Glassmorphism Floating UI",
    category: "Hero",
    tags: ["glass", "depth", "specular"],
    concept:
      "Frosted-glass panels layered with depth, parallax, and a light refraction sweep on hover.",
    reference: "HeroUI vibrant themes, Apple-style",
    stack: ["Next.js", "Tailwind", "Motion"],
    prompt:
      "Build a Next.js hero with stacked glassmorphic cards (backdrop-blur, subtle border, inner highlight). Cards float at different z-depths and parallax with the cursor (closer = more movement). On hover, a card lifts, its blur sharpens slightly, and a moving specular highlight crosses it. Background: a soft animated gradient so the blur has something to refract. Mind backdrop-blur perf (limit layers). Reduced-motion: static stack.",
    tier: "pro",
    accent: "from-cyan-300/25 to-blue-500/20",
  },
  {
    id: 20,
    slug: "neo-brutalist-landing",
    title: "Neo-Brutalist Interactive Landing",
    category: "Style",
    tags: ["brutalism", "snap", "bold"],
    concept:
      "Bold borders, hard shadows, clashing color, chunky hover states that 'thunk' into place.",
    reference: "DesignPrompts.dev 'neo-brutalism', abtest.design",
    stack: ["Next.js", "Tailwind", "Motion"],
    prompt:
      "Create a neo-brutalist Next.js landing: thick black borders, hard offset box-shadows, raw grotesk type, primary colors. Interactive elements snap on hover (shadow collapses, element shifts to meet it) with a quick spring. Include a draggable sticker element and a marquee banner with a warning-tape pattern. Cursor swaps to a custom blocky pointer. Loud but usable. Reduced-motion: keep snaps instant, no looping motion.",
    tier: "pro",
    accent: "from-yellow-400/30 to-orange-500/20",
  },
  {
    id: 21,
    slug: "parallax-long-scroll-story",
    title: "Parallax Storytelling (long-scroll)",
    category: "Scroll",
    tags: ["parallax", "pinned", "narrative"],
    concept:
      "A multi-act scroll story with layered parallax, pinned chapters, and a persistent progress rail.",
    reference: "Awwwards SOTD long-scroll, Dilum demos",
    stack: ["Next.js", "GSAP ScrollTrigger", "Lenis"],
    prompt:
      "Build a Next.js long-scroll narrative with GSAP ScrollTrigger + Lenis. 3 'acts', each pinned briefly with multi-layer parallax (bg, mid, fg moving at different rates), text that fades/slides in, and a transition wash between acts. A fixed side progress rail shows act dots that fill as you pass. Add scroll-velocity-based subtle blur on fast scroll. Mobile: lighter parallax. Reduced-motion: simple fade sections.",
    tier: "pro",
    accent: "from-indigo-400/25 to-violet-700/20",
  },
  {
    id: 22,
    slug: "generative-particle-field",
    title: "Audio-Reactive / Generative Visual",
    category: "3D",
    tags: ["canvas", "particles", "flow-field"],
    concept:
      "A canvas visual that reacts to hover or a play button — particles or waves pulsing. Rare, memorable.",
    reference: "SceneAI, Paper.design, creative-coding Awwwards",
    stack: ["Next.js", "Canvas / R3F", "Web Audio"],
    prompt:
      "Create a Next.js generative hero on a canvas (or R3F): a field of particles / flow-field that responds to cursor proximity (attract/repel) and pulses subtly on a loop. Optional 'play' toggle adds a Web Audio oscillator whose amplitude drives particle scale (muted by default; require a user gesture). Use requestAnimationFrame, cap particle count for perf, pause off-screen. Reduced-motion + no-audio default. Mobile: fewer particles.",
    tier: "pro",
    accent: "from-fuchsia-400/25 to-pink-600/20",
  },
  {
    id: 23,
    slug: "hover-expand-list",
    title: "Hover-Expand List Motion",
    category: "Nav",
    tags: ["layout", "preview", "accordion"],
    concept:
      "A vertical list where hovering an item expands it and slides in an image preview. Elegant nav.",
    reference: "Mobbin nav patterns, Linear-style",
    stack: ["Next.js", "Motion"],
    prompt:
      "Build a Next.js + Motion vertical list of 5 items. Hovering an item expands its height, reveals a description, and slides in a preview image from the right; siblings compress slightly. Use layout animations for smooth height changes (spring). The active item's text scales up and a thin accent line draws under it. Keyboard accessible (focus = expand). Reduced-motion: instant expand, no slide.",
    tier: "pro",
    accent: "from-emerald-300/25 to-teal-600/20",
  },
  {
    id: 24,
    slug: "split-flap-board",
    title: "Split-Flap / Departure-Board Text",
    category: "Type",
    tags: ["solari", "flip", "tactile"],
    concept:
      "Text flips in like an airport board — nostalgic, tactile, oddly satisfying.",
    reference: "kinetic-type sites, Paper.design",
    stack: ["Next.js", "Motion"],
    prompt:
      "Create a Next.js split-flap (Solari board) component. Each character cell flips through glyphs to land on the target letter with staggered timing and a mechanical ease; add a faint flip sound (muted default). Use it for a rotating headline that changes every few seconds. 3D flip via rotateX on a top/bottom half. Monospace, dark cells, subtle bevel. Reduced-motion: instant set. Perf: limit cells, batch updates.",
    tier: "pro",
    accent: "from-slate-300/20 to-zinc-600/15",
  },
  {
    id: 25,
    slug: "infinite-zoom-reveal",
    title: "Infinite Zoom / Recursive Reveal",
    category: "Scroll",
    tags: ["zoom", "recursive", "surreal"],
    concept:
      "Scrolling zooms infinitely into a scene that recursively becomes the next — surreal, premium.",
    reference: "Dilum demos, experimental Awwwards",
    stack: ["Next.js", "Lenis"],
    prompt:
      "Build a Next.js infinite-zoom effect: scroll scales a container (and swaps assets at scale thresholds) so the user appears to fall continuously into the scene, each layer revealing the next seamlessly. Use transform scale on GPU layers, crossfade at handoff points, tie to Lenis scroll progress. Loop or end on a CTA. Heavy effect — gate behind a 'press to enter'. Mobile/reduced-motion: stepped fade between 3 scenes.",
    tier: "pro",
    accent: "from-purple-400/25 to-indigo-700/20",
  },
  {
    id: 26,
    slug: "magnetic-dock-nav",
    title: "Magnetic Dock / Floating Nav",
    category: "Nav",
    tags: ["dock", "magnify", "morph"],
    concept:
      "macOS-style dock where icons scale by cursor distance; a floating pill nav morphs on scroll.",
    reference: "Apple, Mobbin, Motion examples",
    stack: ["Next.js", "Motion"],
    prompt:
      "Create a Next.js + Motion floating navigation: a centered pill that, on scroll down, shrinks and gains a blur background (morph via layout animation). Include a macOS-style dock where each icon scales based on cursor distance (magnification curve) with neighbors easing. The active route gets an animated indicator that slides between items (layoutId). Fully keyboard accessible. Reduced-motion: static sizes, instant indicator.",
    tier: "pro",
    accent: "from-sky-300/25 to-cyan-600/20",
  },
  {
    id: 27,
    slug: "before-after-reveal",
    title: "Reveal-on-Drag Before/After",
    category: "Interactive",
    tags: ["clip-path", "drag", "comparison"],
    concept:
      "A draggable slider wipes between 'slop' and 'polished' — literally sells your value prop.",
    reference: "abtest.design, product-comparison sites",
    stack: ["Next.js", "Motion"],
    prompt:
      "Build a Next.js before/after comparison: two layered visuals with a draggable vertical handle (Motion drag, constrained) that clips the top layer via clip-path to reveal the bottom. Handle has a grabbed-state scale and a glowing line. Labels 'Before / After' fade based on position. Auto-demo nudge on first view (handle slides then settles). Touch + mouse. Reduced-motion: static 50/50 split with toggle.",
    tier: "pro",
    accent: "from-amber-300/25 to-rose-600/20",
  },
  {
    id: 28,
    slug: "particle-logo-assembly",
    title: "Particle Logo Assembly",
    category: "3D",
    tags: ["particles", "text-sample", "intro"],
    concept:
      "Particles fly in and assemble into a logo/wordmark on load, then drift subtly. Strong brand intro.",
    reference: "SceneAI, creative-coding demos",
    stack: ["Next.js", "Canvas"],
    prompt:
      "Create a Next.js canvas where particles scatter then animate to positions sampled from a logo/text (render text to an offscreen canvas, read pixel coords as targets). Particles ease to targets with stagger, then idle with subtle noise drift; cursor proximity pushes them and they spring back. Re-scatter on click. Cap particle count, use a single canvas + rAF. Reduced-motion: show static logo. Mobile: fewer particles.",
    tier: "pro",
    accent: "from-violet-300/25 to-fuchsia-600/20",
  },
  {
    id: 29,
    slug: "scroll-snap-theme-shift",
    title: "Scroll-Snap Sections w/ Theme Shift",
    category: "Scroll",
    tags: ["scroll-snap", "theme-morph", "cinematic"],
    concept:
      "Each fullscreen section snaps into place and the whole palette transitions between them.",
    reference: "Dark.design, umanmade, editorial Awwwards",
    stack: ["Next.js", "Lenis", "CSS variables"],
    prompt:
      "Build a Next.js full-page scroll-snap experience (CSS scroll-snap + Lenis). 4 fullscreen sections; as each enters, CSS custom properties for bg/text/accent transition smoothly (so colors morph between sections). Content fades+rises on enter. A fixed minimal nav reflects the current section's theme. Add a soft directional wipe at boundaries. Reduced-motion: instant snaps, no color tween jank. Mobile-friendly.",
    tier: "pro",
    accent: "from-zinc-300/20 to-violet-600/15",
  },
  {
    id: 30,
    slug: "command-palette-hero",
    title: "AI Command-Palette Hero",
    category: "Interactive",
    tags: ["cmd-k", "filter", "keyboard-first"],
    concept:
      "A live ⌘K command palette front-and-center that animates suggestions — speaks to AI-builder buyers.",
    reference: "Linear / Raycast, coss/ui, NextjsShop",
    stack: ["Next.js", "Motion"],
    prompt:
      "Create a Next.js hero featuring an always-open command palette (⌘K style). As the user types (or on idle, auto-type a demo query), animated suggestion rows filter/reorder with a spring (Motion layout animations), each with an icon and a highlight on the matched substring. Selecting a row triggers a satisfying confirm animation. Glassy panel, blurred backdrop, keyboard-first. Reduced-motion: instant filtering. Fully accessible (aria-activedescendant).",
    tier: "pro",
    accent: "from-cyan-300/25 to-indigo-600/20",
  },
];

export const FREE_LIMIT = 10;

export function getSite(slug: string): ShowcaseSite | undefined {
  return SITES.find((s) => s.slug === slug);
}

export const CATEGORIES = Array.from(new Set(SITES.map((s) => s.category)));
