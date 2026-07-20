"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { useCubeStore } from "@/store/cubeStore";

// Standard Rubik's cube colors (R L U D F B)
const COLORS = {
  right: "#b71234",   // Red
  left: "#ff5800",    // Orange
  up: "#ffffff",      // White
  down: "#ffd500",    // Yellow
  front: "#009b48",   // Green
  back: "#0046ad",    // Blue
  core: "#222222",    // Black/Dark Grey for inner plastic
};

// Types for our logical cubie tracking
interface LogicalCubie {
  id: string;
  originalPos: [number, number, number];
  currentPos: THREE.Vector3;
  meshRef: React.RefObject<THREE.Mesh | null>;
}

function Cubie({ cubie }: { cubie: LogicalCubie }) {
  const [ox, oy, oz] = cubie.originalPos;
  
  const materials = useMemo(() => {
    return [
      new THREE.MeshStandardMaterial({ color: ox === 1 ? COLORS.right : COLORS.core, roughness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: ox === -1 ? COLORS.left : COLORS.core, roughness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: oy === 1 ? COLORS.up : COLORS.core, roughness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: oy === -1 ? COLORS.down : COLORS.core, roughness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: oz === 1 ? COLORS.front : COLORS.core, roughness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: oz === -1 ? COLORS.back : COLORS.core, roughness: 0.2 }),
    ];
  }, [ox, oy, oz]);

  return (
    <mesh ref={cubie.meshRef} position={cubie.currentPos}>
      {/* <boxGeometry args={[0.95, 0.95, 0.95]} /> */}
      {materials.map((mat, i) => (
        <primitive key={i} object={mat} attach={`material-${i}`} />
      ))}
      {/* <RoundedBox args={[0.96, 0.96, 0.96]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color={COLORS.core} roughness={0.7} />
      </RoundedBox> */}
    </mesh>
  );
}


export function RubiksCube() {
  const groupRef = useRef<THREE.Group>(null);
  const pivotRef = useRef<THREE.Group>(new THREE.Group());
  
  const { shiftMove, setIsMoving, stage, animSpeed } = useCubeStore();

  // Initialize the 27 logical cubies
  const logicalCubies = useRef<LogicalCubie[]>([]);
  if (logicalCubies.current.length === 0) {
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          logicalCubies.current.push({
            id: `${x}-${y}-${z}`,
            originalPos: [x, y, z],
            currentPos: new THREE.Vector3(x, y, z),
            meshRef: { current: null as THREE.Mesh | null },
          });
        }
      }
    }
  }

  // Animation state
  const currentMove = useRef<{
    axis: 'x' | 'y' | 'z';
    val: number;
    targetAngle: number;
    currentAngle: number;
    cubiesToRotate: LogicalCubie[];
  } | null>(null);

  useEffect(() => {
    // Add the invisible pivot to the main group
    if (groupRef.current && pivotRef.current) {
      groupRef.current.add(pivotRef.current);
    }
  }, []);

  useFrame((state, delta) => {
    // 1. Idle rotation on landing page — fixed gentle spin
    if (stage === "landing" && groupRef.current && !currentMove.current) {
      groupRef.current.rotation.y += delta * 0.2;
      groupRef.current.rotation.x += delta * 0.1;
    } else if (stage !== "landing" && groupRef.current) {
      // Lerp to a fixed angled view while a lesson/solve is active
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0.3, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, -0.4, 0.05);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.05);
    }

    // 2. Handle face-rotation moves
    if (currentMove.current) {
      const move = currentMove.current;
      const step = Math.sign(move.targetAngle) * animSpeed;
      move.currentAngle += step;

      // Check if finished
      if (Math.abs(move.currentAngle) >= Math.abs(move.targetAngle)) {
        move.currentAngle = move.targetAngle;
        pivotRef.current.rotation[move.axis] = move.currentAngle;
        
        // Finalize: Apply rotation to meshes, unparent from pivot
        pivotRef.current.updateMatrixWorld();
        
        move.cubiesToRotate.forEach(c => {
          if (c.meshRef.current && groupRef.current) {
            // Get world position of the mesh while it's in the pivot
            const worldPos = new THREE.Vector3();
            const worldQuat = new THREE.Quaternion();
            const worldScale = new THREE.Vector3();
            c.meshRef.current.matrixWorld.decompose(worldPos, worldQuat, worldScale);
            
            // Re-parent to the main group
            groupRef.current.add(c.meshRef.current);
            
            // Convert world transform back to group-local transform
            const invGroupMatrix = new THREE.Matrix4().copy(groupRef.current.matrixWorld).invert();
            c.meshRef.current.matrix.copy(c.meshRef.current.matrixWorld).premultiply(invGroupMatrix);
            c.meshRef.current.matrix.decompose(c.meshRef.current.position, c.meshRef.current.quaternion, c.meshRef.current.scale);
            
            // Update logical position (round to nearest integer)
            c.currentPos.copy(c.meshRef.current.position).round();
          }
        });
        
        // Reset pivot
        pivotRef.current.rotation.set(0, 0, 0);
        currentMove.current = null;
        setIsMoving(false);
      } else {
        pivotRef.current.rotation[move.axis] = move.currentAngle;
      }
    } else {
      // Check for new move
      const nextMove = shiftMove();
      if (nextMove) {
        setIsMoving(true);
        parseAndExecuteMove(nextMove);
      }
    }
  });

  function parseAndExecuteMove(moveStr: string) {
    const face = moveStr[0];
    const isPrime = moveStr.includes("'");
    
    let axis: 'x' | 'y' | 'z' = 'x';
    let val = 0;
    let targetAngle = (Math.PI / 2) * (isPrime ? 1 : -1);

    switch (face) {
      case 'R': axis = 'x'; val = 1; break;
      case 'L': axis = 'x'; val = -1; targetAngle *= -1; break;
      case 'U': axis = 'y'; val = 1; break;
      case 'D': axis = 'y'; val = -1; targetAngle *= -1; break;
      case 'F': axis = 'z'; val = 1; break;
      case 'B': axis = 'z'; val = -1; targetAngle *= -1; break;
    }

    // Find affected cubies based on their current rounded position
    const affected = logicalCubies.current.filter(c => Math.abs(c.currentPos[axis] - val) < 0.1);
    
    // Parent them to the pivot
    affected.forEach(c => {
      if (c.meshRef.current && pivotRef.current) {
        pivotRef.current.add(c.meshRef.current);
      }
    });

    currentMove.current = {
      axis,
      val,
      targetAngle,
      currentAngle: 0,
      cubiesToRotate: affected
    };
  }

  return (
    <group ref={groupRef}>
      {logicalCubies.current.map((cubie) => (
        <Cubie 
          key={cubie.id} 
          cubie={cubie} 
        />
      ))}
    </group>
  );
}
