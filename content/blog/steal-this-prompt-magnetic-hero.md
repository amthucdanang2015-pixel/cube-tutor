---
title: "Steal this prompt: a magnetic hero that doesn't look generic"
description: "A copy-paste prompt for a cursor-reactive headline over a drifting gradient mesh — the hero that makes people stop scrolling."
date: 2026-06-11
category: "Prompt Drops"
tags: ["prompt", "hero", "motion", "v0", "cursor"]
xHook: "Steal this prompt. It builds a hero where the headline letters repel your cursor over a drifting gradient mesh. Paste into v0/Cursor/Lovable. It's the difference between 'whoa' and 'another landing page.'"
---

The hero is the only section guaranteed to be seen. Most AI-built heros are a centered headline, a subhead, and a button — three dead elements stacked on a gradient. Here's a prompt that turns the headline itself into the interaction.

## The prompt

> Build a full-screen hero in Next.js + Tailwind + Motion. Center an oversized (clamp 4rem–12rem) variable-font headline. Each letter is its own motion span. On mousemove, letters within ~150px of the cursor translate away with spring physics (stiffness 150, damping 15) and scale 1.05; they ease back when the cursor leaves. Behind the text, an animated conic/radial gradient mesh slowly drifts (20s loop). Add a subtle film-grain overlay. Respect prefers-reduced-motion by disabling the repel. Make it buttery at 60fps.

Paste it as-is. In Cursor, have your project open so it edits real files. In v0/Lovable/Bolt, drop it in the prompt box and then refine with "make the repel softer" or "slow the gradient drift."

## Why it works

Three things are doing the heavy lifting, and you can reuse them anywhere:

- **The headline is interactive.** People move their mouse just to watch the letters dodge it. That's a few extra seconds on the page, which is the whole game for a hero.
- **The background moves slowly.** A 20-second gradient loop plus grain reads as "crafted." A static gradient reads as "default." Same colors, opposite impression.
- **It degrades gracefully.** `prefers-reduced-motion` disables the repel, so it stays accessible and never feels gimmicky to people who don't want motion.

## The one thing to get right

Spring physics, not duration-based easing. A timed tween makes the letters feel mechanical; a spring (stiffness/damping) makes them feel *physical*, like they have weight. If you change one parameter, change `damping` — lower is bouncier, higher is calmer.

**The takeaway:** the cheapest way to make a hero memorable is to make one element respond to the person looking at it.

This is effect #1 in the [showcase](/showcase) — there are 29 more, each with its own copy-paste prompt and a live preview so you can see it before you build it. And if you want it tuned to a specific aesthetic, the [style prompt library](/prompts) has a version for every look.
