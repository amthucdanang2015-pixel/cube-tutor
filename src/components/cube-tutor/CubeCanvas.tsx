"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { RubiksCube } from "./RubiksCube";
import { useCubeStore } from "@/store/cubeStore";

export function CubeCanvas() {
  const resetTrigger = useCubeStore((s) => s.resetTrigger);

  return (
    <div className="relative h-full w-full">
      <Canvas camera={{ position: [4.6, 4.2, 5], fov: 42 }} dpr={[1, 1.65]} shadows>
        <ambientLight intensity={0.75} />
        <directionalLight position={[8, 9, 6]} intensity={1.6} castShadow />
        <Environment preset="city" />

        <Suspense fallback={null}>
          <RubiksCube key={resetTrigger} />
        </Suspense>

        <ContactShadows position={[0, -2, 0]} opacity={0.35} scale={8} blur={2.4} far={4} />

        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={3}
          maxDistance={8}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
