"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Search, Pencil, Inbox, Star, Send, Archive, Check, Clock } from "lucide-react";

interface Mail {
  initial: string;
  color: string;
  sender: string;
  subject: string;
  summary: string;
  chips: string[];
}

const NEEDS: Mail[] = [
  { initial: "S", color: "#2563eb", sender: "Sarah Chen", subject: "Contract — final sign-off", summary: "Approved the terms; just needs your signature on page 4 by Friday.", chips: ["Sign", "Reply: thanks"] },
  { initial: "A", color: "#16a34a", sender: "AWS Billing", subject: "Invoice #4821 due", summary: "$1,240 due in 2 days. Card on file expires this month.", chips: ["Pay", "Update card"] },
  { initial: "M", color: "#db2777", sender: "Maya (design)", subject: "Re: redesign review", summary: "Left 6 comments on the Figma — wants your call on the hero before EOD.", chips: ["Open Figma", "Reply"] },
];
const FYI: Mail[] = [
  { initial: "L", color: "#9333ea", sender: "Linear", subject: "3 issues assigned to you", summary: "Two are blocked; one is ready to start. No reply needed.", chips: ["View"] },
  { initial: "V", color: "#ea580c", sender: "Vercel", subject: "Deploy succeeded", summary: "Production is live — build passed in 42s.", chips: [] },
];

export function After() {
  return (
    <div className="flex h-full bg-[#0f1115] text-[#e8eaed]">
      {/* sidebar */}
      <div className="hidden w-44 shrink-0 flex-col gap-1 border-r border-white/8 p-3 sm:flex">
        <button className="mb-3 flex items-center gap-2 rounded-full bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20">
          <Pencil className="h-4 w-4" /> Compose
        </button>
        <SideItem icon={<Inbox className="h-4 w-4" />} label="Inbox" badge="6" active />
        <SideItem icon={<Star className="h-4 w-4" />} label="Starred" />
        <SideItem icon={<Send className="h-4 w-4" />} label="Sent" />
      </div>

      {/* main */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
          <div className="flex flex-1 items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/40">
            <Search className="h-4 w-4" /> Search mail
          </div>
        </div>
        <div className="space-y-5 overflow-y-auto p-4" style={{ maxHeight: "calc(100% - 57px)" }}>
          <Group label="Needs you" accent="#2563eb" mails={NEEDS} />
          <Group label="FYI" accent="#6b7280" mails={FYI} />
          <div className="flex items-center gap-2 text-xs text-white/35">
            <span className="h-px flex-1 bg-white/8" /> Later · 14 more, none urgent <span className="h-px flex-1 bg-white/8" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SideItem({ icon, label, badge, active }: { icon: React.ReactNode; label: string; badge?: string; active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${active ? "bg-blue-500/15 font-semibold text-blue-300" : "text-white/60"}`}>
      {icon} <span className="flex-1">{label}</span>
      {badge && <span className="text-xs text-white/40">{badge}</span>}
    </div>
  );
}

function Group({ label, accent, mails }: { label: string; accent: string; mails: Mail[] }) {
  const reduce = useReducedMotion();
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
        <span className="text-xs font-bold uppercase tracking-widest text-white/50">{label}</span>
        <span className="text-xs text-white/30">{mails.length}</span>
      </div>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        className="space-y-1.5"
      >
        {mails.map((m) => (
          <motion.div
            key={m.sender}
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } }}
            whileHover={reduce ? {} : { x: 2 }}
            className="group relative flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-3 transition hover:border-white/15 hover:bg-white/[0.04]"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: m.color }}>
              {m.initial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate text-sm font-semibold">{m.sender}</p>
                <span className="shrink-0 text-[11px] text-white/30">9:4{mails.indexOf(m)}a</span>
              </div>
              <p className="truncate text-[13px] text-white/70">{m.subject}</p>
              <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-white/40">{m.summary}</p>
              {m.chips.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.chips.map((c) => (
                    <span key={c} className="rounded-md bg-blue-500/15 px-2 py-0.5 text-[11px] font-medium text-blue-300">{c}</span>
                  ))}
                </div>
              )}
            </div>
            {/* hover quick actions */}
            <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
              <QuickAction icon={<Archive className="h-3.5 w-3.5" />} />
              <QuickAction icon={<Check className="h-3.5 w-3.5" />} />
              <QuickAction icon={<Clock className="h-3.5 w-3.5" />} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function QuickAction({ icon }: { icon: React.ReactNode }) {
  return <span className="rounded-md bg-[#0f1115] p-1.5 text-white/60 ring-1 ring-white/10 hover:text-white">{icon}</span>;
}

/* ---------- BEFORE: dense classic inbox ---------- */
export function Before() {
  const rows = [
    ["Sarah Chen", "Contract — final sign-off needed before...", "9:41a"],
    ["AWS Billing", "Your invoice #4821 is now available to view", "9:12a"],
    ["LinkedIn", "You appeared in 9 searches this week 🎉", "8:55a"],
    ["Maya Patel", "Re: redesign review — left some comments", "8:40a"],
    ["Promotions", "🔥 50% OFF ends tonight — don't miss out!", "8:31a"],
    ["Linear", "[Linear] 3 issues assigned to you", "8:20a"],
    ["Medium Daily", "Top stories for you today", "7:58a"],
    ["Vercel", "Deployment succeeded for project web", "7:45a"],
  ];
  return (
    <div className="flex h-full flex-col bg-white text-[#202124]">
      {/* toolbar */}
      <div className="flex items-center gap-3 border-b border-gray-200 px-3 py-1.5 text-gray-500">
        <input type="checkbox" className="h-3.5 w-3.5" readOnly />
        <span className="text-xs">↻</span><span className="text-xs">⋮</span>
        <div className="ml-auto text-[10px] text-gray-400">1–50 of 12,438</div>
      </div>
      {/* tabs */}
      <div className="flex border-b border-gray-200 text-[11px] font-medium">
        <span className="border-b-2 border-blue-600 px-3 py-1.5 text-blue-600">Primary</span>
        <span className="px-3 py-1.5 text-gray-500">Social</span>
        <span className="px-3 py-1.5 text-gray-500">Promotions</span>
        <span className="px-3 py-1.5 text-gray-500">Updates</span>
      </div>
      {/* dense rows */}
      <div className="flex-1 overflow-hidden text-[11px]">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-2 border-b border-gray-100 px-3 py-1.5 hover:bg-gray-50">
            <input type="checkbox" className="h-3 w-3" readOnly />
            <span className="text-gray-300">☆</span>
            <span className="w-20 shrink-0 truncate font-semibold">{r[0]}</span>
            <span className="flex-1 truncate text-gray-600">{r[1]}</span>
            <span className="shrink-0 text-gray-400">{r[2]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
