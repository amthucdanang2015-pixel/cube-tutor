"use client";

import type { ComponentType } from "react";
import * as F from "./free";
import * as A from "./proA";
import * as B from "./proB";

/** slug → live preview component. Keep in sync with src/data/showcase.ts. */
export const PREVIEWS: Record<string, ComponentType> = {
  "magnetic-cursor-type": F.PMagneticType,
  "horizontal-scroll-story": F.PHorizontalStory,
  "staggered-card-grid": F.PStaggerGrid,
  "animated-gradient-saas-hero": F.PGradientHero,
  "text-mask-scroll-reveal": F.PTextReveal,
  "bento-live-microinteractions": F.PBento,
  "shared-element-page-morph": F.PMorphCard,
  "sticky-scroll-feature": F.PStickyFeature,
  "velocity-marquee": F.PVelocityMarquee,
  "spotlight-dark-hero": F.PSpotlight,
  "3d-product-scroll-spin": A.P3DSpin,
  "liquid-gooey-cursor": A.PGooeyCursor,
  "kinetic-typography-loop": A.PKineticType,
  "drag-physics-gallery": A.PDragGallery,
  "morphing-svg-blob": A.PMorphBlob,
  "terminal-code-reveal": A.PTerminal,
  "image-trail-cursor": A.PImageTrail,
  "stat-choreography": A.PStats,
  "glassmorphism-floating-ui": A.PGlass,
  "neo-brutalist-landing": A.PBrutalist,
  "parallax-long-scroll-story": B.PParallax,
  "generative-particle-field": B.PParticles,
  "hover-expand-list": B.PExpandList,
  "split-flap-board": B.PSplitFlap,
  "infinite-zoom-reveal": B.PInfiniteZoom,
  "magnetic-dock-nav": B.PDock,
  "before-after-reveal": B.PBeforeAfter,
  "particle-logo-assembly": B.PLogoAssembly,
  "scroll-snap-theme-shift": B.PThemeShift,
  "command-palette-hero": B.PCommandPalette,
};

export function Preview({ slug, className = "" }: { slug: string; className?: string }) {
  const Cmp = PREVIEWS[slug];
  return (
    <div className={`relative h-full w-full overflow-hidden [container-type:inline-size] ${className}`}>
      {Cmp ? <Cmp /> : <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />}
    </div>
  );
}
