---
title: "Why 60fps matters more than your color palette"
description: "A janky animation undoes a perfect palette in one scroll. Why frame rate is a brand decision, and the cheap ways to protect it."
date: 2026-05-28
category: "Motion & Craft"
tags: ["performance", "motion", "60fps"]
xHook: "You spent a week on your palette. Then you shipped an animation that drops to 20fps on scroll, and the whole thing feels broken. Jank reads as 'cheap' faster than any color ever could. 60fps is a brand decision."
---

You can get every color, every font, every pixel right — and one stuttering animation will make the whole product feel broken. The body notices dropped frames before the conscious mind notices anything, and "this feels janky" instantly becomes "this feels cheap." Frame rate isn't an engineering detail. It's a brand decision.

## Why jank reads as "cheap"

Smoothness signals control. When motion stutters, some part of the user's brain registers that the thing is struggling, fragile, not-quite-right — the same instinct that makes a wobbly table feel low-quality. It's pre-verbal and it's instant. No palette survives it.

60fps means a new frame every ~16ms. Miss that budget and the eye sees a stutter. The goal of performant motion is simply: never miss the budget.

## The cheap ways to protect it

You don't need to be a performance engineer. Four rules cover most of it:

1. **Animate only `transform` and `opacity`.** These run on the GPU and don't trigger layout. Animating `width`, `height`, `top`, or `margin` forces the browser to recalculate the page every frame — that's where jank comes from. Want to move something? `translate`, not `top`.
2. **Pause off-screen animations.** A looping animation you can't see is still burning frames. Use an intersection observer to stop anything outside the viewport.
3. **Cap the work.** Particles, blurs, and heavy effects scale badly. Limit particle counts, cap `backdrop-blur` layers, lower device-pixel-ratio for canvas on mobile. More isn't smoother.
4. **Throttle scroll and pointer handlers.** Don't run expensive work on every single scroll/mousemove event. Lerp toward the target instead — it's smoother *and* cheaper.

Tell your AI exactly this: *"GPU-accelerated transforms only, pause off-screen animations, throttle the pointer handler, target 60fps."* It'll happily comply — it just won't volunteer it.

## The test

Open your site, throttle the CPU to 4x in dev tools (simulating a mid-range phone), and scroll. If it stutters there, it stutters for a chunk of your users on every visit — and they feel it even if they never name it.

**The takeaway:** smooth is a feeling of quality you can't fake with color. Protect the frame budget like you protect the brand, because it *is* the brand.

Every [showcase](/showcase) prompt specifies 60fps and GPU-only transforms for exactly this reason — premium motion that doesn't melt on a phone.
