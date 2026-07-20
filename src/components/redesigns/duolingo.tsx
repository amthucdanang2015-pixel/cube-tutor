"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Flame, ArrowRight, BookOpen, Dumbbell, User } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function CountUp({ to, duration = 900 }: { to: number; duration?: number }) {
  const [n, setN] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return setN(to);
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(p * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration, reduce]);
  return <>{n}</>;
}

/* ---------- AFTER: the 100× redesign ---------- */
export function After() {
  const reduce = useReducedMotion();
  const upNext = [
    { icon: "🗣️", title: "Greetings", sub: "5 new words" },
    { icon: "☕", title: "At the café", sub: "Order & pay" },
    { icon: "🧭", title: "Directions", sub: "Find your way" },
  ];
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex h-full flex-col bg-[#fff7ed] px-5 pb-3 pt-3 text-[#2b2b2b]"
    >
      {/* greeting + streak */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <p className="text-[11px] text-black/40">Good morning</p>
          <p className="text-base font-bold tracking-tight">Ready for 12 min?</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-amber-600">
          <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
          <span className="text-sm font-extrabold tabular-nums"><CountUp to={12} /></span>
        </div>
      </motion.div>

      {/* focus card */}
      <motion.div
        variants={item}
        className="relative mt-4 overflow-hidden rounded-3xl bg-gradient-to-br from-[#58cc02] to-[#46a302] p-4 text-white shadow-lg shadow-green-600/20"
      >
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Today&apos;s lesson</p>
        <div className="mt-1 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold leading-tight">Greetings</h3>
            <p className="text-xs text-white/70">Basics · Unit 2</p>
          </div>
          <Ring />
        </div>
        <motion.button
          whileHover={reduce ? {} : { scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-white py-2.5 text-sm font-extrabold text-[#46a302] shadow-sm"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </motion.button>
      </motion.div>

      {/* up next */}
      <motion.p variants={item} className="mt-5 text-[11px] font-bold uppercase tracking-widest text-black/35">
        Up next
      </motion.p>
      <div className="relative mt-2 flex-1">
        <div className="absolute left-[18px] top-2 bottom-6 w-0.5 bg-black/8" />
        <div className="space-y-2">
          {upNext.map((u) => (
            <motion.div key={u.title} variants={item} className="flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff7ed] text-lg">{u.icon}</div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{u.title}</p>
                <p className="truncate text-[11px] text-black/40">{u.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* bottom tabs */}
      <motion.div variants={item} className="mt-3 flex items-center justify-around rounded-2xl bg-white py-2 shadow-sm">
        <Tab icon={<BookOpen className="h-5 w-5" />} label="Learn" active />
        <Tab icon={<Dumbbell className="h-5 w-5" />} label="Practice" />
        <Tab icon={<User className="h-5 w-5" />} label="You" />
      </motion.div>
    </motion.div>
  );
}

function Ring() {
  const reduce = useReducedMotion();
  const r = 22;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-14 w-14">
      <svg viewBox="0 0 56 56" className="h-full w-full -rotate-90">
        <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="5" />
        <motion.circle
          cx="28" cy="28" r={r} fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: reduce ? c * 0.4 : c }}
          animate={{ strokeDashoffset: c * 0.4 }}
          transition={{ duration: 1.2, ease: "easeInOut", delay: 0.3 }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-extrabold">60%</span>
    </div>
  );
}

function Tab({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-0.5 ${active ? "text-[#58cc02]" : "text-black/30"}`}>
      {icon}
      <span className="text-[9px] font-bold">{label}</span>
    </div>
  );
}

/* ---------- BEFORE: the cluttered original (representative) ---------- */
export function Before() {
  return (
    <div className="flex h-full flex-col bg-white px-3 pb-3 pt-2 text-[#3c3c3c]">
      {/* noisy top bar */}
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="flex items-center gap-0.5 text-blue-500">🇪🇸</span>
        <span className="flex items-center gap-0.5 text-orange-500">🔥 12</span>
        <span className="flex items-center gap-0.5 text-red-500">❤️ 5</span>
        <span className="flex items-center gap-0.5 text-yellow-500">💎 480</span>
        <span className="flex items-center gap-0.5 text-amber-600">👑 1.2k</span>
      </div>

      {/* banners */}
      <div className="mt-2 rounded-lg bg-yellow-300 px-2 py-1.5 text-center text-[10px] font-extrabold text-yellow-900">
        ⚡ DOUBLE XP ENDS IN 14:59
      </div>
      <div className="mt-1.5 flex items-center justify-between rounded-lg bg-purple-500 px-2 py-1.5 text-[10px] font-extrabold text-white">
        <span>👑 GET SUPER · 50% OFF</span>
        <span className="rounded bg-white/20 px-1.5 py-0.5">TRY</span>
      </div>
      <div className="mt-1.5 flex items-center justify-between rounded-lg border-2 border-gray-200 px-2 py-1.5 text-[10px] font-bold">
        <span>🏆 SILVER LEAGUE · #14</span>
        <span className="text-gray-400">2d left</span>
      </div>

      {/* busy lesson path */}
      <p className="mt-2 text-center text-[10px] font-bold text-gray-400">SECTION 1, UNIT 2</p>
      <div className="mt-1 flex flex-1 flex-col items-center gap-2 overflow-hidden">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex h-9 w-9 items-center justify-center rounded-full border-b-4 text-sm font-bold text-white"
            style={{
              background: i < 2 ? "#58cc02" : "#e5e5e5",
              borderColor: i < 2 ? "#46a302" : "#cfcfcf",
              transform: `translateX(${[0, -28, -40, -28, 0][i]}px)`,
            }}
          >
            {i < 2 ? "★" : "●"}
          </div>
        ))}
      </div>

      {/* crowded tab bar */}
      <div className="mt-2 flex items-center justify-around border-t-2 border-gray-100 pt-1.5 text-[8px] font-bold text-gray-400">
        {["Learn", "Sections", "League", "Quests", "Shop", "Profile"].map((t, i) => (
          <span key={t} className={i === 0 ? "text-green-500" : ""}>{t}</span>
        ))}
      </div>
    </div>
  );
}
