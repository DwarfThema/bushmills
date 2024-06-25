"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  BakeShadows,
  ContactShadows,
  Environment,
  OrbitControls,
  Sky,
  SoftShadows,
} from "@react-three/drei";
import { ACESFilmicToneMapping } from "three";
import { Suspense, useEffect, useRef, useState } from "react";
import ModelScene from "./_components/scene";
import {
  EffectComposer,
  Outline,
  Selection,
} from "@react-three/postprocessing";
import { easing } from "maath";

export default function Home() {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-between bg-[url('/background.png')] ">
      <Canvas
        shadows
        eventPrefix="client"
        onCreated={({ gl }) => {
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.9;
        }}
      >
        <Environment preset="apartment" />

        <Suspense fallback={null}>
          <Selection>
            <Effects />
            <ModelScene />
          </Selection>
        </Suspense>
        <OrbitControls />
      </Canvas>
    </main>
  );
}

function Effects() {
  const { size } = useThree();
  return (
    <EffectComposer stencilBuffer autoClear={false} multisampling={4}>
      <Outline
        //@ts-ignore
        visibleEdgeColor="white"
        //@ts-ignore
        hiddenEdgeColor="white"
        blur
        width={size.width * 1.25}
        edgeStrength={10}
      />
    </EffectComposer>
  );
}
