import { ContactShadows, PerformanceMonitor, PresentationControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type ComponentType, type ReactNode } from "react";
import * as THREE from "three";
import type { SceneBaseProps } from "@/components/three/LazyCanvas";
import { deviceById, type DeviceId } from "@/config/devices";
import { HotspotAnchor, HotspotProjector, ReadySignal, Studio, useAnchorRegistry, type AnchorRegistry, type HotspotDomMap, type V3 } from "./kit";
import { AlterG, anchors as alterAnchors } from "./devices/AlterG";
import { Combo, anchors as comboAnchors } from "./devices/Combo";
import { EMS, anchors as emsAnchors } from "./devices/EMS";
import { Shockwave, anchors as shockAnchors } from "./devices/Shockwave";

export type DeviceSceneProps = SceneBaseProps & {
  device: DeviceId;
  selected: string | null;
  spin: number;
  paused: boolean;
  /** DOM hotspot buttons (rendered by the section) positioned from this scene */
  hotspotDom: HotspotDomMap;
};

type Entry = { Model: ComponentType<{ animate: boolean }>; anchors: Record<string, { pos: V3; normal: V3 }>; scale: number };

const REGISTRY: Record<DeviceId, Entry> = {
  antigravity: { Model: AlterG, anchors: alterAnchors, scale: 1.3 },
  shockwave: { Model: Shockwave, anchors: shockAnchors, scale: 1.62 },
  combo: { Model: Combo, anchors: comboAnchors, scale: 1.95 },
  ems: { Model: EMS, anchors: emsAnchors, scale: 1.34 },
};

const easeOutBack = (t: number) => {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/** Scales a device in (with a spin) or out when switching. */
function Slot({ entering, children, onGone }: { entering: boolean; children: ReactNode; onGone?: () => void }) {
  const ref = useRef<THREE.Group>(null);
  const start = useRef<number | null>(null);
  const phase = useRef(entering);
  const gone = useRef(false);
  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    if (phase.current !== entering) {
      phase.current = entering;
      start.current = null;
      gone.current = false;
    }
    if (start.current === null) start.current = clock.elapsedTime;
    const t = clock.elapsedTime - start.current;
    if (entering) {
      const k = easeOutBack(clamp01((t - 0.15) / 0.75));
      g.scale.setScalar(Math.max(0.001, k));
      g.rotation.y = (1 - clamp01((t - 0.15) / 0.75)) * -1.4;
    } else {
      const k = clamp01(t / 0.3);
      g.scale.setScalar(Math.max(0.001, Math.min(g.scale.x, 1 - k * k)));
      if (k >= 1 && !gone.current) {
        gone.current = true;
        onGone?.();
      }
    }
  });
  return (
    <group ref={ref} scale={0.001}>
      {children}
    </group>
  );
}

function Turntable({ device, selected, spin, paused, reducedMotion, registry }: Omit<DeviceSceneProps, "active" | "onReady" | "hotspotDom"> & { registry: AnchorRegistry }) {
  const table = useRef<THREE.Group>(null);
  // Base heading chosen by the visitor (rotate buttons / hotspots); idle sway plays around it.
  const target = useRef(0.35);
  const lastSpin = useRef(spin);
  const [shown, setShown] = useState<{ id: DeviceId; entering: boolean }[]>([{ id: device, entering: true }]);

  useEffect(() => {
    setShown((cur) => {
      if (cur.some((s) => s.id === device && s.entering)) return cur;
      return [...cur.filter((s) => s.id !== device).map((s) => ({ ...s, entering: false })), { id: device, entering: true }];
    });
  }, [device]);

  useEffect(() => {
    target.current += spin - lastSpin.current;
    lastSpin.current = spin;
  }, [spin]);

  // Turn the selected hotspot toward the camera.
  useEffect(() => {
    if (!selected || !table.current) return;
    const a = REGISTRY[device].anchors[selected];
    if (!a) return;
    const desired = -Math.atan2(a.normal[0], a.normal[2]);
    const current = table.current.rotation.y;
    target.current = current + wrap(desired - current);
  }, [selected, device]);

  useFrame(({ clock }, delta) => {
    const t = table.current;
    if (!t) return;
    // Gentle front-facing sway keeps the hotspots readable (a full 360° spin hides them half the time).
    const sway = !selected && !paused && !reducedMotion ? Math.sin(clock.elapsedTime * 0.35) * 0.55 : 0;
    t.rotation.y = THREE.MathUtils.damp(t.rotation.y, target.current + sway, 3, delta);
  });

  const entry = REGISTRY[device];
  const cfg = deviceById(device);
  const animate = !reducedMotion && !paused;

  return (
    <group ref={table}>
      {shown.map((s) => {
        const { Model, scale } = REGISTRY[s.id];
        return (
          <Slot key={s.id} entering={s.entering} onGone={() => setShown((cur) => cur.filter((x) => x.id !== s.id || x.entering))}>
            <group scale={scale}>
              <Model animate={animate} />
              {s.entering
                ? cfg.hotspots.map((h) => {
                    const a = entry.anchors[h.id];
                    return a ? <HotspotAnchor key={h.id} id={h.id} position={a.pos} normal={a.normal} registry={registry} /> : null;
                  })
                : null}
            </group>
          </Slot>
        );
      })}
      {/* Re-rendered briefly after each switch (then frozen) — cheap on phones. */}
      <ContactShadows key={device} position={[0, 0.005, 0]} opacity={0.55} scale={4.2} blur={2.2} far={2.5} resolution={256} frames={40} color="#000000" />
    </group>
  );
}

function Stage() {
  const platform = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: "#0c2c31", roughness: 0.28, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.2 }),
    [],
  );
  useEffect(() => () => platform.dispose(), [platform]);
  return (
    <group>
      <mesh material={platform} position={[0, -0.07, 0]}>
        <cylinderGeometry args={[1.75, 1.82, 0.14, 96]} />
      </mesh>
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.68, 1.73, 128]} />
        <meshBasicMaterial color="#45d6bf" toneMapped={false} />
      </mesh>
      {[0.7, 1.15].map((r) => (
        <mesh key={r} position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r, r + 0.008, 128]} />
          <meshBasicMaterial color="#45d6bf" transparent opacity={0.22} toneMapped={false} />
        </mesh>
      ))}
      {/* soft volumetric light cone */}
      <mesh position={[0, 2.1, 0]}>
        <cylinderGeometry args={[0.25, 1.75, 4.2, 64, 1, true]} />
        <meshBasicMaterial color="#9ad8ff" transparent opacity={0.035} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function DeviceScene({ active, reducedMotion, onReady, hotspotDom, ...rest }: DeviceSceneProps) {
  const [dpr, setDpr] = useState<[number, number]>([1, 1.75]);
  const registry = useAnchorRegistry();
  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 1.75, 5.7], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ camera }) => camera.lookAt(0, 0.74, 0)}
    >
      <PerformanceMonitor onDecline={() => setDpr([1, 1])} />
      <Studio intensity={1.15} />
      <PresentationControls global={false} cursor snap polar={[-0.08, 0.18]} azimuth={[-Math.PI / 2, Math.PI / 2]} speed={1.3}>
        <Stage />
        <Turntable {...rest} reducedMotion={reducedMotion} registry={registry} />
      </PresentationControls>
      <HotspotProjector registry={registry} dom={hotspotDom} />
      <ReadySignal onReady={onReady} />
    </Canvas>
  );
}
