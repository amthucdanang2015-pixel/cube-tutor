"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronDown, MoreHorizontal, Play, SkipBack, SkipForward, Heart } from "lucide-react";

/* ---------- AFTER: immersive, color-led ---------- */
export function After() {
  const reduce = useReducedMotion();
  const lyrics = ["Waiting for the night to fall", "I know that it must come", "Drift along in the dark", "The city is a firework"];
  const [li, setLi] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setLi((p) => (p + 1) % lyrics.length), 2600);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#0b0b0f] px-5 pb-4 pt-2 text-white">
      {/* ambient glow from the art */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, #a855f7aa, #1db95455 55%, transparent 70%)" }}
        animate={reduce ? {} : { opacity: [0.7, 1, 0.7], scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* top bar */}
      <div className="relative z-10 flex items-center justify-between text-white/70">
        <ChevronDown className="h-5 w-5" />
        <div className="text-center text-[10px] uppercase tracking-widest text-white/50">
          Playing from<br /><span className="text-white/80">Focus Flow</span>
        </div>
        <MoreHorizontal className="h-5 w-5" />
      </div>

      {/* album art */}
      <motion.div
        initial={{ opacity: 0, scale: 0.86, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto mt-6 aspect-square w-[68%] overflow-hidden rounded-2xl shadow-2xl"
        style={{ boxShadow: "0 24px 60px -12px rgba(168,85,247,0.5)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#a855f7] via-[#6366f1] to-[#1db954]" />
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_30%_30%,white,transparent_40%)]" />
      </motion.div>

      {/* title + like */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="relative z-10 mt-5 flex items-center justify-between"
      >
        <div className="min-w-0">
          <h3 className="truncate text-xl font-bold tracking-tight">Midnight City</h3>
          <p className="truncate text-sm text-white/55">M83</p>
        </div>
        <Heart className="h-6 w-6 shrink-0 fill-[#1db954] text-[#1db954]" />
      </motion.div>

      {/* lyric line */}
      <div className="relative z-10 mt-3 h-5 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={li}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="text-sm font-medium text-white/80"
          >
            {lyrics[li]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* waveform scrubber */}
      <div className="relative z-10 mt-4 flex h-8 items-center gap-[3px]">
        {Array.from({ length: 40 }).map((_, i) => {
          const played = i < 16;
          return (
            <motion.span
              key={i}
              className="flex-1 rounded-full"
              style={{ background: played ? "#1db954" : "rgba(255,255,255,0.25)" }}
              animate={reduce ? { height: 8 } : { height: [6, 8 + (i % 7) * 2.4, 6] }}
              transition={{ duration: 1.1 + (i % 5) * 0.12, repeat: Infinity, ease: "easeInOut" }}
            />
          );
        })}
      </div>
      <div className="relative z-10 mt-1 flex justify-between text-[10px] text-white/40">
        <span>1:24</span>
        <span>4:03</span>
      </div>

      {/* three controls only */}
      <div className="relative z-10 mt-3 flex items-center justify-center gap-8">
        <SkipBack className="h-6 w-6 fill-white text-white" />
        <motion.button whileTap={{ scale: 0.92 }} className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-lg">
          <Play className="h-6 w-6 fill-black" />
        </motion.button>
        <SkipForward className="h-6 w-6 fill-white text-white" />
      </div>
    </div>
  );
}

/* ---------- BEFORE: cluttered chrome ---------- */
export function Before() {
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#3a2a4a] to-[#121212] px-4 pb-3 pt-2 text-white">
      <div className="flex items-center justify-between text-[10px] text-white/60">
        <span>▾</span>
        <span>PLAYLIST · MY MIX #3</span>
        <span>⋯</span>
      </div>
      <div className="mx-auto mt-3 aspect-square w-[52%] rounded bg-gradient-to-br from-purple-500 to-green-500" />
      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="text-base font-bold">Midnight City</p>
          <p className="text-xs text-white/50">M83</p>
        </div>
        <div className="flex gap-2 text-white/60 text-xs">＋ ✓</div>
      </div>
      <div className="mt-2 h-1 w-full rounded bg-white/20"><div className="h-full w-1/3 rounded bg-white" /></div>
      <div className="mt-1 flex justify-between text-[9px] text-white/40"><span>1:24</span><span>4:03</span></div>
      {/* crowded control row */}
      <div className="mt-2 flex items-center justify-between text-white/80">
        <span className="text-[10px]">🔀</span>
        <span>⏮</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">▶</span>
        <span>⏭</span>
        <span className="text-[10px]">🔁</span>
      </div>
      {/* extra clutter */}
      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 text-[10px] text-white/50">
        <span>📱 Devices</span>
        <span>↗ Share</span>
        <span>☰ Queue</span>
        <span>🎤 Lyrics</span>
      </div>
      <div className="mt-2 rounded bg-white/5 p-2 text-[9px] text-white/40">Up Next: Outro — M83 · Wait — M83 · Reunion…</div>
    </div>
  );
}
