"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { isImmersive } from "@/lib/chrome";
import { BRAND, NAV_LINKS } from "@/config/brand";
import { Wordmark } from "@/components/brand/Wordmark";

export function Nav({startLearning, handlePractice, handleMethod}: {startLearning: () => void; handlePractice: () => void; handleMethod: () => void;}) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 24));
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  if (isImmersive(pathname ?? "")) {
    return (
      <motion.div
        className="fixed left-3 top-3 z-50 sm:left-4 sm:top-4"
        initial={reduce ? false : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          href="/"
          aria-label="TasteLoop home"
          className="flex items-center rounded-full border border-white/10 bg-black/70 px-3.5 py-2 shadow-2xl backdrop-blur-xl transition hover:border-loop/40"
        >
          <Wordmark />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 flex max-w-7xl items-center justify-center mx-auto"
      initial={reduce ? false : { y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: reduce ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.nav
        aria-label="Primary navigation"
        animate={{
          backgroundColor: scrolled || open ? "rgba(21,21,18,0.90)" : "rgba(21,21,18,0.18)",
          borderColor: scrolled || open ? "rgba(242,240,232,0.14)" : "rgba(242,240,232,0.06)",
        }}
        transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full px-8 py-2"
      >
        <div className="flex items-center justify-between gap-2">
          <Link href="/cube-tutor" aria-label={`${BRAND.name} home`} className="flex min-h-10 items-center pl-2 pr-1">
            <Wordmark animated />
          </Link>

          <div className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => {
              const current = pathname === link.href || pathname?.startsWith(`${link.href}/`);
              if(link.href === "/cube-tutor#main") {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    className={`rounded-full px-3 py-2 text-sm transition ${current ? "bg-white/[0.07] text-white" : "text-white/62 hover:bg-white/[0.04] hover:text-white"}`}
                    onClick={handlePractice}
                  >
                    {link.label}
                  </Link>
                );
              } 
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={current ? "page" : undefined}
                  onClick={handleMethod}
                  className={`rounded-full px-3 py-2 text-sm transition ${current ? "bg-white/[0.07] text-white" : "text-white/62 hover:bg-white/[0.04] hover:text-white"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href="/cube-tutor#lesson"
              className="rounded-full bg-loop px-3.5 py-2.5 text-xs font-semibold text-ink transition hover:bg-loop/90 sm:px-4 sm:text-sm"
              onClick={startLearning}   
            >
              <span className="sm:hidden">Start</span>
              <span className="hidden sm:inline">Start learning</span>
            </Link>
            <button
              type="button"
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-white/75 transition hover:border-white/30 hover:text-white lg:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-navigation"
              initial={reduce ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: reduce ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden lg:hidden"
            >
              <div className="grid gap-1 border-t border-line px-1 pb-2 pt-3 sm:grid-cols-2">
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className="rounded-xl px-3 py-3 text-sm text-white/72 hover:bg-white/[0.05] hover:text-white">
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </motion.header>
  );
}
