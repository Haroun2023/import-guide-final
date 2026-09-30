import { Environment, Lightformer } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* Materials — clinical whites + the logo's green and navy             */
/* ------------------------------------------------------------------ */

export const mat = {
  shell: new THREE.MeshPhysicalMaterial({ color: "#f3f6f6", roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.16 }),
  porcelain: new THREE.MeshPhysicalMaterial({ color: "#ebf0ef", roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.4, sheen: 0.4, sheenColor: new THREE.Color("#effaf4") }),
  /** anodised leaf-green trim (replaces the old gold accents) */
  accent: new THREE.MeshStandardMaterial({ color: "#4cc387", roughness: 0.28, metalness: 0.85 }),
};

/* ------------------------------------------------------------------ */
/* Studio lighting — procedural environment, no HDR download            */
/* ------------------------------------------------------------------ */

export function Studio({ intensity = 1 }: { intensity?: number }) {
  return (
    <>
      <ambientLight intensity={0.35 * intensity} />
      <directionalLight position={[3.5, 6, 5]} intensity={1.7 * intensity} />
      <directionalLight position={[-5, 2.5, -3]} intensity={0.7 * intensity} color="#a9d6f0" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.4} position={[0, 5, 3]} scale={[10, 2.5, 1]} />
        <Lightformer form="rect" intensity={1.3} position={[-6, 1.5, 1]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} color="#d4f7e4" />
        <Lightformer form="rect" intensity={1.1} position={[6, 1.5, -1]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} color="#fff1dc" />
        <Lightformer form="ring" intensity={1.6} position={[0, 2, -6]} scale={4} />
        <Lightformer form="rect" intensity={0.6} position={[0, -3, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} color="#0c8456" />
      </Environment>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                     */
/* ------------------------------------------------------------------ */

export type V3 = [number, number, number];

/** Tube with an animated light pulse travelling along it (nerve signal / energy). */
export function FlowTube({
  points,
  radius = 0.02,
  color = "#5ace90",
  speed = 0.5,
  opacity = 1,
  reverse = false,
  opacityRef,
}: {
  points: V3[];
  radius?: number;
  color?: string;
  speed?: number;
  opacity?: number;
  reverse?: boolean;
  /** optional live opacity multiplier (0–1), read every frame */
  opacityRef?: { current: number };
}) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    return new THREE.TubeGeometry(curve, 96, radius, 8, false);
  }, [points, radius]);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(color) },
          uOpacity: { value: opacity },
          uDir: { value: reverse ? -1 : 1 },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uOpacity;
          uniform float uDir;
          varying vec2 vUv;
          void main() {
            float x = uDir > 0.0 ? vUv.x : 1.0 - vUv.x;
            float head = fract(uTime);
            float d = x - head;
            float pulse = exp(-pow(d * 9.0, 2.0)) + 0.6 * exp(-pow((d + 0.5) * 9.0, 2.0));
            float base = 0.18;
            gl_FragColor = vec4(uColor * (base + pulse * 1.6), (base + pulse) * uOpacity);
          }`,
      }),
    [color, opacity, reverse],
  );
  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );
  useFrame((_, delta) => {
    material.uniforms.uTime.value += delta * speed;
    if (opacityRef) material.uniforms.uOpacity.value = opacity * opacityRef.current;
  });
  return <mesh geometry={geometry} material={material} />;
}

/* ------------------------------------------------------------------ */
/* Hotspots — 3D anchors projected onto DOM buttons that live in the     */
/* main React tree (see components/three/HotspotOverlay.tsx). No extra   */
/* React roots, no foreign nodes inside R3F's container.                 */
/* ------------------------------------------------------------------ */

export type HotspotDomMap = { current: Record<string, HTMLElement | null> };
type AnchorEntry = { obj: THREE.Object3D; normal: THREE.Vector3 };
export type AnchorRegistry = Map<string, AnchorEntry>;

export function useAnchorRegistry(): AnchorRegistry {
  return useMemo(() => new Map(), []);
}

export function HotspotAnchor({ id, position, normal = [0, 0, 1], registry }: { id: string; position: V3; normal?: V3; registry: AnchorRegistry }) {
  const ref = useRef<THREE.Group>(null);
  const [nx, ny, nz] = normal;
  useEffect(() => {
    const obj = ref.current;
    if (!obj) return;
    registry.set(id, { obj, normal: new THREE.Vector3(nx, ny, nz) });
    return () => {
      if (registry.get(id)?.obj === obj) registry.delete(id);
    };
  }, [id, registry, nx, ny, nz]);
  return <group ref={ref} position={position} />;
}

const tmpN = new THREE.Vector3();
const tmpP = new THREE.Vector3();
const tmpC = new THREE.Vector3();

/** Every frame: place each DOM hotspot over its anchor; hide it when facing away. */
export function HotspotProjector({ registry, dom }: { registry: AnchorRegistry; dom: HotspotDomMap }) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  useFrame(() => {
    for (const [id, el] of Object.entries(dom.current)) {
      if (!el) continue;
      const a = registry.get(id);
      if (!a) {
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
        continue;
      }
      a.obj.getWorldPosition(tmpP);
      tmpN.copy(a.normal).transformDirection(a.obj.matrixWorld);
      tmpC.copy(camera.position).sub(tmpP).normalize();
      const facing = tmpN.dot(tmpC) > 0.05;
      tmpP.project(camera);
      const x = (tmpP.x * 0.5 + 0.5) * size.width;
      const y = (-tmpP.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${facing ? 1 : 0.6})`;
      el.style.opacity = facing ? "1" : "0";
      el.style.pointerEvents = facing ? "auto" : "none";
    }
  });
  return null;
}

/** Calls onReady once the first frame has rendered (used to fade out posters). */
export function ReadySignal({ onReady }: { onReady: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    requestAnimationFrame(() => onReady());
  });
  return null;
}
