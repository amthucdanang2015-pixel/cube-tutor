"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, Play, RotateCcw } from "lucide-react";
import { CubeCanvas } from "./CubeCanvas";
import { LESSON_STEPS, useCubeStore } from "@/store/cubeStore";
import { Nav } from "../Nav";

export function CubeTutorApp() {
  const {
    stage,
    setStage,
    currentStepIndex,
    nextStep,
    prevStep,
    enqueueMove,
    isMoving,
    resetCube,
    animSpeed,
    setAnimSpeed,
  } = useCubeStore();

  const startLearning = () =>{
    setStage("learning")
  }
  const handlePractice = () => {
    setStage("cube-input");
  }

  const handleMethod = () => {
    setStage("learning");
    enqueueMove(step.demoMoves!)
    
  }

  const step = LESSON_STEPS[currentStepIndex];

  return (
    <>
      <Nav startLearning={startLearning} handlePractice={handlePractice} handleMethod={handleMethod} />
      <main>
        <main id="main" className="pt-0"></main>
        <div className="relative overflow-hidden" id="main2">
          <section
            id="lesson"
            className="mx-auto grid min-h-[92svh] max-w-7xl scroll-mt-28 items-center gap-10 px-6 pb-16 pt-32 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:pb-20 lg:pt-36"
          >
            <div className="relative z-10">
              <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.025] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/62">
                <span className="h-1.5 w-1.5 rounded-full bg-loop" />{" "}
                Interactive product demo
              </p>
              <h1 className="mt-7 max-w-3xl text-balance text-5xl font-semibold leading-[0.94] tracking-[-0.06em] sm:text-7xl lg:text-[5.6rem]">
                Understand the cube,{" "}
                <span className="text-gradient">not only the moves.</span>
              </h1>
              <p className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-white/62 sm:text-lg">
                Cube Tutor turns the layer-by-layer method into an interactive
                3D lesson. See the pattern, run the move, slow it down, and
                learn why the cube changes.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => startLearning()}
                  className="inline-flex items-center gap-2 rounded-full bg-loop px-6 py-3 text-sm font-semibold text-ink transition hover:bg-loop/90 disabled:opacity-50"
                  type="button"
                >
                  Start learning <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handlePractice()}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm text-white/78 transition hover:border-white/30 hover:text-white"
                  type="button"
                >
                  Practice moves <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
                Drag to orbit. Use the lesson panel to replay moves.
              </p>
            </div>

            <div className="relative min-w-0">
              <div className="living-loop min-h-[440px] p-4 sm:min-h-[520px]">
                <div className="absolute left-6 top-6 z-10 rounded-full border border-line bg-black/35 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/48 backdrop-blur">
                  Cube Tutor 3D
                </div>
                <div className="h-[400px] sm:h-[488px]">
                  <CubeCanvas />
                </div>
              </div>

              <div
                id="practice"
                className="mt-4 grid scroll-mt-28 gap-3 lg:grid-cols-[minmax(0,1fr)_14rem]"
              >
                {stage === "landing" && (
                  <Panel>
                    <h2 className="text-xl font-semibold tracking-[-0.025em]">
                      Choose a path
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-white/58">
                      Start with guided lessons or practice single face
                      rotations against the live cube.
                    </p>
                  </Panel>
                )}

                {stage === "learning" && (
                  <Panel>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-loop">
                          Step {currentStepIndex + 1} / {LESSON_STEPS.length}
                        </p>
                        <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em]">
                          {step.title}
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={resetCube}
                        className="grid h-10 w-10 place-items-center rounded-full border border-line text-white/56 transition hover:border-white/30 hover:text-white"
                        aria-label="Reset cube lesson"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-white/58">
                      {step.description}
                    </p>

                    {step.demoMoves && (
                      <div className="mt-4 grid gap-3">
                        <button
                          disabled={isMoving}
                          onClick={() => enqueueMove(step.demoMoves!)}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line bg-white/[0.04] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.08] disabled:opacity-50"
                          type="button"
                        >
                          <Play className="h-4 w-4" /> Demonstrate move
                        </button>

                        <div className="flex items-center gap-3 rounded-2xl bg-white/[0.035] px-4 py-3">
                          <span className="w-8 select-none font-mono text-[10px] uppercase tracking-widest text-white/38">
                            Slow
                          </span>
                          <input
                            type="range"
                            min="0.04"
                            max="0.4"
                            step="0.01"
                            value={animSpeed}
                            onChange={(event) =>
                              setAnimSpeed(parseFloat(event.target.value))
                            }
                            aria-label="Demo animation speed"
                            className="flex-1 cursor-pointer accent-loop"
                          />
                          <span className="w-8 select-none text-right font-mono text-[10px] uppercase tracking-widest text-white/38">
                            Fast
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <button
                        onClick={() => {
                          if (currentStepIndex === 0) resetCube();
                          else prevStep();
                        }}
                        className="rounded-full px-3 py-2 text-sm font-medium text-white/50 transition hover:bg-white/[0.04] hover:text-white"
                        type="button"
                      >
                        Back
                      </button>
                      <button
                        onClick={nextStep}
                        disabled={currentStepIndex === LESSON_STEPS.length - 1}
                        className="rounded-full bg-loop px-4 py-2 text-sm font-semibold text-ink transition hover:bg-loop/90 disabled:opacity-35"
                        type="button"
                      >
                        Next step
                      </button>
                    </div>
                  </Panel>
                )}

                {stage === "cube-input" && (
                  <Panel>
                    <h2 className="text-xl font-semibold tracking-[-0.025em]">
                      Practice face turns
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-white/58">
                      Rotate the cube with the mouse, then run clockwise or
                      counterclockwise face turns.
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      {["U", "D", "R", "L", "F", "B"].map((face) => (
                        <div key={face} className="grid grid-cols-2 gap-1.5">
                          <button
                            disabled={isMoving}
                            onClick={() => enqueueMove(face)}
                            className="rounded-full bg-white/[0.07] py-2 text-sm font-semibold transition hover:bg-white/[0.12] disabled:opacity-50"
                            type="button"
                          >
                            {face}
                          </button>
                          <button
                            disabled={isMoving}
                            onClick={() => enqueueMove(`${face}'`)}
                            className="rounded-full bg-white/[0.07] py-2 text-sm font-semibold transition hover:bg-white/[0.12] disabled:opacity-50"
                            type="button"
                          >
                            {face}&apos;
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <button
                        onClick={resetCube}
                        className="rounded-full px-3 py-2 text-sm font-medium text-white/50 transition hover:bg-white/[0.04] hover:text-white"
                        type="button"
                      >
                        Reset
                      </button>
                      <Link
                        href="/work#intake"
                        className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-white/90"
                      >
                        Build this further
                      </Link>
                    </div>
                  </Panel>
                )}

                <Panel id="method" className="hidden scroll-mt-28 lg:block">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/38">
                    Method
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/58">
                    White cross, first layer, second layer, top face, final
                    layer. Each step keeps the cube visible.
                  </p>
                </Panel>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

function Panel({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <div id={id} className={`rounded-[1.6rem] border border-line bg-white/[0.035] p-5 shadow-[0_24px_80px_-50px_rgba(0,0,0,.9)] backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}
