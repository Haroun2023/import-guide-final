import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Cable, FlowTube, mat, PulseRings, ScreenPanel, screenBase, type ScreenDraw, type V3 } from "../kit";

/** The model is shifted left so torso + unit are centred on the stage. */
const OFFSET_X = -0.25;

export const anchors: Record<string, { pos: V3; normal: V3 }> = {
  pads: { pos: [0.09 + OFFSET_X, 1.21, 0.165], normal: [0.25, 0, 1] },
  unit: { pos: [0.7 + OFFSET_X, 0.96, 0.16], normal: [0, 0.2, 1] },
  channels: { pos: [0.9 + OFFSET_X, 0.77, 0.16], normal: [0.2, -0.1, 1] },
};

type Pad = { pos: V3; rot: V3 };
const PADS: Pad[] = [
  { pos: [0.085, 1.22, 0.153], rot: [0.06, 0.22, 0] },
  { pos: [-0.085, 1.22, 0.153], rot: [0.06, -0.22, 0] },
  { pos: [0.142, 0.8, 0.107], rot: [0.06, 0, 0] },
  { pos: [-0.142, 0.8, 0.107], rot: [0.06, 0, 0] },
];
const SOCKETS: V3[] = [0.66, 0.74, 0.82, 0.9].map((x) => [x, 0.77, 0.155]);
const LEADS: V3[][] = PADS.map((p, i) => {
  const s = SOCKETS[i];
  return [
    [s[0], s[1], s[2] + 0.02],
    [s[0] - 0.05, s[1] - 0.15, s[2] + 0.12],
    [(s[0] + p.pos[0]) / 2, Math.min(s[1], p.pos[1]) - 0.22, 0.34],
    [p.pos[0] + 0.03, p.pos[1] - 0.08, p.pos[2] + 0.08],
    [p.pos[0], p.pos[1] - 0.04, p.pos[2] + 0.012],
  ];
});
const CH_COLORS = ["#f5c24a", "#f5c24a", "#7fe8d6", "#7fe8d6"];

const drawScreen: ScreenDraw = (ctx, w, h, t) => {
  screenBase(ctx, w, h, "EMS · 4 CHANNELS", "#f5c24a");
  const bw = 70;
  for (let i = 0; i < 4; i++) {
    const x = 34 + i * (bw + 26);
    const level = Math.pow(Math.max(0, Math.sin(t * 2 - i * 0.8)), 2);
    const bh = 30 + level * 120;
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(x, 70, bw, 150);
    ctx.fillStyle = CH_COLORS[i];
    ctx.fillRect(x, 220 - bh, bw, bh);
    ctx.fillStyle = "#cfe3e6";
    ctx.font = "600 16px system-ui, sans-serif";
    ctx.fillText(`CH${i + 1}`, x + 16, 246);
  }
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 20px system-ui, sans-serif";
  ctx.fillText("85 Hz · 350 µs · ON 4s / OFF 8s", 34, 292);
};

const TORSO_PROFILE: [number, number][] = [
  [0, 0.9], [0.25, 0.9], [0.29, 0.95], [0.31, 1.03], [0.285, 1.14], [0.24, 1.25], [0.232, 1.33],
  [0.252, 1.44], [0.292, 1.56], [0.312, 1.66], [0.302, 1.74], [0.255, 1.82], [0.14, 1.88],
  [0.075, 1.9], [0.075, 2.0], [0, 2.0],
];

export function EMS({ animate }: { animate: boolean }) {
  const torso = useMemo(() => new THREE.LatheGeometry(TORSO_PROFILE.map(([x, y]) => new THREE.Vector2(x, y)), 48), []);
  useEffect(() => () => torso.dispose(), [torso]);
  const padMats = useMemo(
    () => PADS.map((_, i) => new THREE.MeshStandardMaterial({ color: "#26363b", roughness: 0.55, emissive: new THREE.Color(CH_COLORS[i]), emissiveIntensity: 0.2 })),
    [],
  );
  useEffect(() => () => padMats.forEach((m) => m.dispose()), [padMats]);
  useFrame(({ clock }) => {
    padMats.forEach((m, i) => {
      m.emissiveIntensity = animate ? 0.15 + Math.pow(Math.max(0, Math.sin(clock.elapsedTime * 2 - i * 0.8)), 2) * 1.6 : 0.5;
    });
  });

  return (
    <group position={[OFFSET_X, 0, 0]}>
      {/* Stand */}
      <mesh material={mat.shellWarm} position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.28, 0.3, 0.04, 48]} />
      </mesh>
      <mesh material={mat.gold} position={[0, 0.042, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.006, 6, 64]} />
      </mesh>
      <mesh material={mat.chrome} position={[0, 0.33, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.58, 14]} />
      </mesh>

      {/* Torso form: a lathed dress-form silhouette (neck → shoulders → waist → hips) */}
      <mesh material={mat.porcelain} geometry={torso} scale={[1, 1, 0.62]} />
      <mesh material={mat.gold} position={[0, 2.005, 0]}>
        <cylinderGeometry args={[0.078, 0.078, 0.018, 28]} />
      </mesh>
      {[1, -1].map((s) => (
        <mesh key={s} material={mat.porcelain} position={[s * 0.142, 0.78, 0]}>
          <cylinderGeometry args={[0.112, 0.09, 0.36, 32]} />
        </mesh>
      ))}

      {/* Electrode pads */}
      {PADS.map((p, i) => (
        <group key={i} position={p.pos} rotation={p.rot}>
          <RoundedBox args={[0.1, 0.14, 0.012]} radius={0.005} smoothness={2} material={padMats[i]} />
        </group>
      ))}
      {animate ? <PulseRings position={[0, 1.2, 0.17]} color="#f5c24a" count={2} speed={0.5} radius={0.1} maxScale={0.7} /> : null}

      {/* Control unit on a pedestal */}
      <mesh material={mat.shell} position={[0.78, 0.36, 0]}>
        <cylinderGeometry args={[0.13, 0.17, 0.72, 32]} />
      </mesh>
      <RoundedBox args={[0.44, 0.28, 0.3]} radius={0.05} smoothness={4} position={[0.78, 0.86, 0]} material={mat.shell} />
      <group position={[0.74, 0.92, 0.152]} rotation={[-0.12, 0, 0]}>
        <ScreenPanel width={0.26} height={0.14} draw={drawScreen} animated={animate} depth={0.02} />
      </group>
      {SOCKETS.map((s, i) => (
        <group key={i} position={s}>
          <mesh material={mat.rubber} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.02, 16]} />
          </mesh>
          <mesh position={[0, 0, 0.011]}>
            <ringGeometry args={[0.02, 0.026, 20]} />
            <meshBasicMaterial color={CH_COLORS[i]} toneMapped={false} />
          </mesh>
        </group>
      ))}
      {LEADS.map((pts, i) => (
        <group key={i}>
          <Cable points={pts} radius={0.007} material={mat.cableLight} />
          {animate ? <FlowTube points={pts} radius={0.011} color={CH_COLORS[i]} speed={0.55 + i * 0.05} opacity={0.75} /> : null}
        </group>
      ))}
    </group>
  );
}
