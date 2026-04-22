"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, useProgress } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";

function Torus({
  mouseX,
  mouseY,
}: {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const mx = mouseX.get();
    const my = mouseY.get();

    mesh.rotation.x += (my * 0.5 - mesh.rotation.x) * 0.04;
    mesh.rotation.y += (mx * 0.5 - mesh.rotation.y) * 0.04;
    mesh.position.x += (mx * 0.25 - mesh.position.x) * 0.04;
    mesh.position.y += (-my * 0.25 - mesh.position.y) * 0.04;
  });

  return (
    <Float speed={1.1} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={0.85} data-cursor="3d">
        <torusKnotGeometry args={[1, 0.22, 220, 28]} />
        <meshStandardMaterial
          color="#2a6fd8"
          metalness={0.9}
          roughness={0.15}
          emissive="#00D4F5"
          emissiveIntensity={0.35}
          transparent
          opacity={0.55}
        />
      </mesh>
    </Float>
  );
}

function LoaderOverlay() {
  const { progress, active } = useProgress();
  // Only visible while drei is actively loading something. When the scene has
  // no async assets (our case), `active` stays false and we render nothing.
  if (!active) return null;
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="font-sans uppercase text-[#666]"
        style={{
          fontSize: "clamp(0.55rem, 0.9vw, 0.65rem)",
          letterSpacing: "0.35em",
        }}
      >
        {Math.round(progress)}
        <span className="text-[#333]">%</span>
      </div>
    </div>
  );
}

export function HeroTorus({
  mouseX,
  mouseY,
}: {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <LoaderOverlay />
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        frameloop="always"
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 5, 4]} intensity={1.4} color="#cfe0ff" />
          <pointLight position={[-5, -5, -3]} intensity={1.1} color="#3a7bd5" />
          <pointLight position={[3, -2, 4]} intensity={0.9} color="#00E5FF" />
          <Torus mouseX={mouseX} mouseY={mouseY} />
        </Suspense>
      </Canvas>
    </div>
  );
}
