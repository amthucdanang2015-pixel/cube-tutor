import { create } from "zustand";

export type LessonStage = "landing" | "method" | "cube-input" | "learning";

export interface LessonStep {
  id: string;
  title: string;
  description: string;
  demoMoves?: string[]; // E.g., ["R", "U", "R'", "U'"]
}

export const LESSON_STEPS: LessonStep[] = [
  {
    id: "white-cross",
    title: "Stage 1: The White Cross",
    description: "Our first goal is to build a cross on the white face. Notice how the edge pieces need to match both the top white center and the side centers.",
    demoMoves: ["R", "U", "R'", "U'"],
  },
  {
    id: "first-layer-corners",
    title: "Stage 2: First Layer Corners",
    description: "Now we insert the corners to complete the first layer. The key is to match the corner's side colors with the adjacent center pieces.",
    demoMoves: ["L'", "U'", "L", "U"],
  },
  {
    id: "second-layer",
    title: "Stage 3: Second Layer Edges",
    description: "We are solving the middle layer. This requires moving edge pieces from the top layer down to the middle without breaking our white base.",
    demoMoves: ["U", "R", "U'", "R'", "U'", "F'", "U", "F"],
  },
  {
    id: "yellow-cross",
    title: "Stage 4: The Yellow Cross",
    description: "Time for the top layer! Our first sub-goal is to form a cross on the yellow face, ignoring the corners for now.",
    demoMoves: ["F", "R", "U", "R'", "U'", "F'"],
  },
  {
    id: "yellow-face",
    title: "Stage 5: The Yellow Face",
    description: "Next, we orient the remaining corners so the entire top face is yellow.",
    demoMoves: ["R", "U", "R'", "U", "R", "U", "U", "R'"],
  },
  {
    id: "final-layer-corners",
    title: "Stage 6: Final Layer Corners",
    description: "We are almost done. Now we position the yellow corners into their correct places.",
    demoMoves: ["R'", "F", "R'", "B", "B", "R", "F'", "R'", "B", "B", "R", "R"],
  },
  {
    id: "final-layer-edges",
    title: "Stage 7: Final Layer Edges",
    description: "The last step! We cycle the final edge pieces into their solved positions to complete the cube.",
    demoMoves: ["R", "U'", "R", "U", "R", "U", "R", "U'", "R'", "U'", "R", "R"],
  },
];

interface CubeState {
  stage: LessonStage;
  setStage: (stage: LessonStage) => void;
  
  // Lesson Progression
  currentStepIndex: number;
  nextStep: () => void;
  prevStep: () => void;
  
  // Animation / Move mechanics
  moveQueue: string[];
  isMoving: boolean;
  enqueueMove: (move: string | string[]) => void;
  shiftMove: () => string | undefined;
  setIsMoving: (isMoving: boolean) => void;
  
  // Highlighting
  highlightedPieces: string[];
  setHighlightedPieces: (pieces: string[]) => void;
  
  resetTrigger: number;
  resetCube: () => void;

  // Demo animation speed (rad per frame). Slider range: 0.04 (very slow) – 0.4 (fast).
  animSpeed: number;
  setAnimSpeed: (speed: number) => void;
}

export const useCubeStore = create<CubeState>((set, get) => ({
  stage: "landing",
  setStage: (stage) => set({ stage }),
  
  currentStepIndex: 0,
  nextStep: () => {
    const nextIdx = Math.min(get().currentStepIndex + 1, LESSON_STEPS.length - 1);
    set({ currentStepIndex: nextIdx });
  },
  prevStep: () => {
    const prevIdx = Math.max(get().currentStepIndex - 1, 0);
    set({ currentStepIndex: prevIdx });
  },
  
  moveQueue: [],
  isMoving: false,
  enqueueMove: (move) => set((state) => ({ 
    moveQueue: [...state.moveQueue, ...(Array.isArray(move) ? move : [move])] 
  })),
  shiftMove: () => {
    const { moveQueue } = get();
    if (moveQueue.length === 0) return undefined;
    const [next, ...rest] = moveQueue;
    set({ moveQueue: rest });
    return next;
  },
  setIsMoving: (isMoving) => set({ isMoving }),
  
  highlightedPieces: [],
  setHighlightedPieces: (highlightedPieces) => set({ highlightedPieces }),
  
  resetTrigger: 0,
  resetCube: () => set((state) => ({ 
    moveQueue: [], 
    isMoving: false, 
    stage: "landing", 
    currentStepIndex: 0,
    highlightedPieces: [],
    resetTrigger: state.resetTrigger + 1
  })),

  animSpeed: 0.12,
  setAnimSpeed: (animSpeed) => set({ animSpeed }),
}));
