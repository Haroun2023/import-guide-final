import { Billboard, ContactShadows, PerformanceMonitor, PresentationControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { SceneBaseProps } from "@/components/three/LazyCanvas";
import { bodyAreas, type BodyAreaId } from "@/config/body";
import { HotspotAnchor, HotspotProjector, mat, ReadySignal, Studio, useAnchorRegistry, type AnchorRegistry, type HotspotDomMap, type V3 } from "./kit";

export type BodySceneProps = SceneBaseProps & {
  selected: BodyAreaId | null;
  view: "front" | "back";
  spin: number;
  /** DOM hotspot buttons (rendered by the section) positioned from this scene */
  hotspotDom: HotspotDomMap;
};

/** Hotspot anchors on the mannequin (local space, feet at y = 0). */
export const AREA_ANCHORS: Record<BodyAreaId, { pos: V3; normal: V3 }> = {
  neck: { pos: [0, 2.72, -0.085], normal: [0, 0.1, -1] },
  shoulder: { pos: [0.39, 2.6, 0.06], normal: [0.55, 0.35, 0.75] },
  upperBack: { pos: [0, 2.38, -0.21], normal: [0, 0, -1] },
  lowerBack: { pos: [0, 1.92, -0.165], normal: [0, 0, -1] },
  elbow: { pos: [0.47, 2.06, 0.06], normal: [0.45, 0, 0.9] },
  wrist: { pos: [-0.525, 1.62, 0.085], normal: [0, 0, 1] },
  hip: { pos: [-0.2, 1.62, 0.13], normal: [-0.3, 0, 0.95] },
  knee: { pos: [0.167, 0.86, 0.085], normal: [0, 0, 1] },
  ankle: { pos: [-0.16, 0.14, 0.07], normal: [0, 0, 1] },
};

type LimbSpec = { from: V3; to: V3; r0: number; r1: number };

function Limb({ from, to, r0, r1 }: LimbSpec) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = new THREE.Vector3().subVectors(a, b);
    return {
      position: new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5),
      quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize()),
      length: dir.length(),
    };
  }, [from, to]);
  return (
    <mesh position={position} quaternion={quaternion} material={mat.porcelain}>
      <cylinderGeometry args={[r0, r1, length, 24]} />
    </mesh>
  );
}

function Joint({ at, r, scale }: { at: V3; r: number; scale?: V3 }) {
  return (
    <mesh position={at} scale={scale} material={mat.porcelain}>
      <sphereGeometry args={[r, 28, 20]} />
    </mesh>
  );
}

function Mannequin() {
  const spineDots = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      [
        [0, 2.68, -0.1],
        [0, 2.5, -0.19],
        [0, 2.3, -0.206],
        [0, 2.1, -0.172],
        [0, 1.9, -0.152],
        [0, 1.74, -0.18],
      ].map((p) => new THREE.Vector3(...(p as V3))),
    );
    return Array.from({ length: 16 }, (_, i) => curve.getPointAt(i / 15));
  }, []);

  return (
    <group>
      {/* Legs */}
      {[1, -1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.16, 0.045, 0.06]} material={mat.porcelain}>
            <boxGeometry args={[0.13, 0.08, 0.3]} />
          </mesh>
          <Joint at={[s * 0.16, 0.13, 0]} r={0.056} />
          <Limb from={[s * 0.167, 0.84, 0]} to={[s * 0.16, 0.15, 0]} r0={0.074} r1={0.055} />
          <Joint at={[s * 0.167, 0.86, 0.01]} r={0.08} />
          <Limb from={[s * 0.158, 1.58, 0]} to={[s * 0.167, 0.9, 0]} r0={0.108} r1={0.078} />
          <Joint at={[s * 0.155, 1.6, 0]} r={0.1} />
        </group>
      ))}
      {/* Torso */}
      <Joint at={[0, 1.7, 0]} r={1} scale={[0.3, 0.19, 0.19]} />
      <Joint at={[0, 1.98, 0]} r={1} scale={[0.25, 0.27, 0.165]} />
      <Joint at={[0, 2.37, 0]} r={1} scale={[0.33, 0.34, 0.2]} />
      {/* Arms */}
      {[1, -1].map((s) => (
        <group key={s}>
          <Joint at={[s * 0.37, 2.57, 0]} r={0.092} />
          <Limb from={[s * 0.37, 2.55, 0]} to={[s * 0.46, 2.08, 0.01]} r0={0.07} r1={0.058} />
          <Joint at={[s * 0.46, 2.06, 0.01]} r={0.06} />
          <Limb from={[s * 0.46, 2.05, 0.01]} to={[s * 0.52, 1.64, 0.04]} r0={0.056} r1={0.044} />
          <Joint at={[s * 0.52, 1.62, 0.04]} r={0.044} />
          <mesh position={[s * 0.535, 1.5, 0.05]} rotation={[0, 0, s * 0.12]} scale={[1, 1, 0.55]} material={mat.porcelain}>
            <capsuleGeometry args={[0.046, 0.1, 6, 14]} />
          </mesh>
        </group>
      ))}
      {/* Neck + head */}
      <Limb from={[0, 2.83, 0]} to={[0, 2.64, 0]} r0={0.07} r1={0.08} />
      <Joint at={[0, 2.99, 0.01]} r={1} scale={[0.172, 0.21, 0.185]} />
      {/* Brand detail: a line of leaf-green "vertebrae" down the back */}
      {spineDots.map((p, i) => (
        <mesh key={i} position={p} material={mat.accent}>
          <sphereGeometry args={[0.02, 12, 10]} />
        </mesh>
      ))}
    </group>
  );
}

function PainGlow({ area }: { area: BodyAreaId }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(255,120,100,1)");
    g.addColorStop(0.3, "rgba(238,93,82,0.55)");
    g.addColorStop(1, "rgba(238,93,82,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  useEffect(() => () => tex.dispose(), [tex]);
  const glow = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    glow.current?.scale.setScalar(0.42 + Math.sin(t * 4) * 0.05);
    const k = (t * 0.8) % 1;
    ring.current?.scale.setScalar(0.1 + k * 0.4);
    if (ringMat.current) ringMat.current.opacity = (1 - k) * 0.8;
  });
  const { pos, normal } = AREA_ANCHORS[area];
  const inset: V3 = [pos[0] - normal[0] * 0.04, pos[1] - normal[1] * 0.04, pos[2] - normal[2] * 0.04];
  return (
    <group position={inset}>
      <Billboard>
        <mesh ref={glow}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
        <mesh ref={ring}>
          <ringGeometry args={[0.9, 1, 48]} />
          <meshBasicMaterial ref={ringMat} color="#ff7a6e" transparent depthWrite={false} toneMapped={false} />
        </mesh>
      </Billboard>
    </group>
  );
}

/** Horizontal "scan" ring: sweeps the body while idle, locks onto the selected area. */
function ScanRing({ targetY, reducedMotion }: { targetY: number | null; reducedMotion: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(({ clock }, delta) => {
    const m = ref.current;
    if (!m) return;
    const idleY = 1.6 + Math.sin(clock.elapsedTime * 0.7) * 1.45;
    const y = targetY ?? (reducedMotion ? 1.6 : idleY);
    m.position.y = THREE.MathUtils.damp(m.position.y, y, 5, delta);
    const r = targetY === null ? 0.62 : 0.5;
    m.scale.setScalar(THREE.MathUtils.damp(m.scale.x, r, 5, delta));
    if (matRef.current) matRef.current.opacity = targetY === null ? 0.55 : 0.85;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 1.6, 0]}>
      <ringGeometry args={[0.96, 1, 96]} />
      <meshBasicMaterial ref={matRef} color="#34b273" transparent depthWrite={false} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  );
}

function Body({ selected, view, spin, reducedMotion, registry }: Omit<BodySceneProps, "active" | "onReady" | "hotspotDom"> & { registry: AnchorRegistry }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }, delta) => {
    const g = group.current;
    if (!g) return;
    const base = (view === "back" ? Math.PI : 0) + spin;
    const idle = selected || reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.45) * 0.42;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, base + idle, 3.2, delta);
  });

  return (
    <group ref={group}>
      <Mannequin />
      {bodyAreas.map((a) => (
        <HotspotAnchor key={a.id} id={a.id} position={AREA_ANCHORS[a.id].pos} normal={AREA_ANCHORS[a.id].normal} registry={registry} />
      ))}
      {selected ? <PainGlow area={selected} /> : null}
      <ScanRing targetY={selected ? AREA_ANCHORS[selected].pos[1] : null} reducedMotion={reducedMotion} />
    </group>
  );
}

export default function BodyScene({ active, reducedMotion, onReady, hotspotDom, ...rest }: BodySceneProps) {
  const [dpr, setDpr] = useState<[number, number]>([1, 1.75]);
  const registry = useAnchorRegistry();
  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 1.75, 7.4], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ camera }) => camera.lookAt(0, 1.55, 0)}
    >
      <PerformanceMonitor onDecline={() => setDpr([1, 1])} />
      <Studio intensity={1.05} />
      <PresentationControls global={false} cursor snap polar={[-0.12, 0.12]} azimuth={[-Math.PI / 1.5, Math.PI / 1.5]} speed={1.4}>
        <Body {...rest} reducedMotion={reducedMotion} registry={registry} />
        {/* Stage */}
        <mesh position={[0, -0.03, 0]} material={mat.shell}>
          <cylinderGeometry args={[0.95, 1, 0.06, 64]} />
        </mesh>
        <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 0.94, 96]} />
          <meshBasicMaterial color="#34b273" toneMapped={false} />
        </mesh>
      </PresentationControls>
      <ContactShadows position={[0, -0.06, 0]} opacity={0.35} scale={4} blur={2.4} far={3.5} resolution={256} frames={1} />
      <HotspotProjector registry={registry} dom={hotspotDom} />
      <ReadySignal onReady={onReady} />
    </Canvas>
  );
}
