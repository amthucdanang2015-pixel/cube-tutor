---
title: "The 12 motion words you need to direct AI"
description: "AI can build almost any animation — if you can name it. The twelve-word vocabulary that turns vague 'make it smoother' into precise direction."
date: 2026-06-10
category: "Motion & Craft"
tags: ["motion", "vocabulary", "prompting"]
xHook: "AI can build almost any animation. The bottleneck is that you can't name what you want. Here are the 12 words — stagger, spring, layout animation, direction-aware — that turn 'make it nicer' into exact direction."
featured: false
---

The reason your AI-built animations look generic isn't the model. It's that "make it smoother" isn't an instruction. Animators have precise words for what they want, and the moment you use them, the output jumps a tier. Here's the working vocabulary.

## The 12 words

1. **Stagger** — animate a group with a small delay between each item (e.g. 60ms), so a list cascades instead of appearing all at once. The single highest-impact word here.
2. **Spring** — physics-based motion defined by stiffness and damping, not duration. Feels alive; tweens feel mechanical.
3. **Ease** — the acceleration curve. "Ease-out" for things entering, "ease-in" for things leaving. Default linear motion is the tell of no taste.
4. **Layout animation** — when an element changes size or position, animate the *change* instead of cutting to the new state. Cheapest "wow" there is.
5. **Shared-element transition** — an element morphs from one screen into another (a card becomes the next page's hero). Native-app smoothness.
6. **Direction-aware** — a hover effect that responds to which edge the cursor entered from. Small detail, expensive feel.
7. **Scrub** — tie an animation's progress directly to scroll position, so the user scrubs it like a video.
8. **Parallax** — layers moving at different speeds to imply depth. Use sparingly; it's easy to overdo.
9. **Crossfade** — two states overlapping as one fades out and the other in, instead of a hard cut.
10. **Spatial consistency** — things enter from and exit to where they logically live, so motion has a believable geography.
11. **Magnetic** — an element that's gently pulled toward the cursor as it approaches. Great on primary buttons.
12. **Reduced-motion** — the accessibility fallback. Always specify it; it also forces you to define the *essential* version of your motion.

## How to use them

Don't say "add some nice animations." Say:

> "Stagger the feature cards on scroll-in (60ms, fade + 40px rise, ease-out). Magnetic hover on the primary button. Animate layout changes on the accordion. Respect reduced-motion."

That's a brief an AI can execute precisely — and a brief most founders can't write, which is exactly why their output looks the same as everyone's.

**The takeaway:** you don't need to learn to animate. You need twelve words. Naming the move *is* the skill.

Bookmark this one. Every prompt in the [showcase](/showcase) is written in this vocabulary, which is why the effects come out premium instead of default.
