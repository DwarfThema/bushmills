import { Float, Select, useGLTF } from "@react-three/drei";
import { useFrame, useGraph } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Group, Material, Mesh } from "three";
import { debounce } from "lodash";
import { lerp } from "three/src/math/MathUtils.js";

export default function ModelScene() {
  const group = useRef();
  const { scene } = useGLTF("/bushmill.glb");

  // Ref for Meshes
  const onsuModel = useMemo(() => scene, [scene]);
  const { nodes } = useGraph(onsuModel);

  const modelScene = nodes.Scene as Group;
  const modelMesh: Mesh[] = [];
  modelScene.traverse((obj) => {
    if (obj instanceof Mesh) {
      modelMesh.push(obj);
    }
  });

  const [hovered, setHovered] = useState(null);
  const [scales, setScales] = useState(modelMesh.map(() => [1, 1, 1]));
  const debouncedHover = useCallback(debounce(setHovered, 30), []);

  //@ts-ignore
  const over = (name) => (e) => {
    e.stopPropagation();
    debouncedHover(name);
  };

  useEffect(() => {
    console.log(hovered);
  }, [hovered]);

  useFrame(() => {
    setScales((prevScales) =>
      prevScales.map((scale, index) => {
        const mesh = modelMesh[index];
        const targetScale = hovered === mesh.name ? [1.5, 1.5, 1.5] : [1, 1, 1];
        return [
          lerp(scale[0], targetScale[0], 0.05),
          lerp(scale[1], targetScale[1], 0.05),
          lerp(scale[2], targetScale[2], 0.05),
        ];
      })
    );
  });

  return (
    <group ref={group as any}>
      {modelMesh.map((mesh, index) => (
        <Select
          key={mesh.name}
          //@ts-ignore
          enabled={hovered === mesh.name}
          onPointerOver={over(mesh.name)}
          onPointerOut={() => debouncedHover(null)}
        >
          <Float
            speed={1}
            rotationIntensity={0.5}
            floatIntensity={0.5}
            floatingRange={[1, 1]}
          >
            <mesh
              geometry={mesh.geometry}
              material={mesh.material as Material}
              receiveShadow
              castShadow
              //@ts-ignore
              scale={scales[index]}
            />
          </Float>
        </Select>
      ))}
    </group>
  );
}

useGLTF.preload("/bushmill.glb");
