import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Cable, Caster, glowMaterial, mat, PulseRings, ScreenPanel, screenBase, type ScreenDraw, type V3 } from "../kit";

const DIR = new THREE.Vector3(-0.35, -0.72, 0.6).normalize();
const APPLICATOR_POS = new THREE.Vector3(0.62, 0.95, 0.5);
const tip = APPLICATOR_POS.clone().addScaledVector(DIR, 0.25);
const rear = APPLICATOR_POS.clone().addScaledVector(DIR, -0.34);

export const anchors: Record<string, { pos: V3; normal: V3 }> = {
  applicator: { pos: [tip.x, tip.y, tip.z], normal: [-0.1, 0.3, 1] },
  screen: { pos: [0, 1.5, 0.06], normal: [0, 0.43, 0.9] },
  generator: { pos: [-0.22, 1.1, 0.275], normal: [0, 0, 1] },
};

const CABLE: V3[] = [
  [0.37, 1.05, -0.12],
  [0.48, 0.8, -0.05],
  [0.56, 0.58, 0.12],
  [0.66, 0.6, 0.3],
  [rear.x, rear.y - 0.02, rear.z],
  [rear.x - DIR.x * 0.04, rear.y - DIR.y * 0.04, rear.z - DIR.z * 0.04],
];

const drawScreen: ScreenDraw = (ctx, w, h, t) => {
  screenBase(ctx, w, h, "RADIAL SHOCKWAVE · ESWT");
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 58px system-ui, sans-serif";
  ctx.fillText("2.0", 26, 112);
  ctx.font = "500 22px system-ui, sans-serif";
  ctx.fillStyle = "#a2bdcd";
  ctx.fillText("bar", 118, 112);
  const shots = 1500 + (Math.floor(t * 12) % 500);
  const rows: [string, string][] = [
    ["FREQ", "12 Hz"],
    ["SHOTS", `${shots.toLocaleString("en-US")} / 2,000`],
  ];
  rows.forEach(([k, v], i) => {
    ctx.fillStyle = "#a2bdcd";
    ctx.font = "500 15px system-ui, sans-serif";
    ctx.fillText(k, 300, 78 + i * 52);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 24px system-ui, sans-serif";
    ctx.fillText(v, 300, 102 + i * 52);
  });
  // pulse train
  ctx.strokeStyle = "#5ace90";
  ctx.lineWidth = 3;
  ctx.beginPath();
  const base = 250;
  for (let x = 20; x < w - 20; x += 2) {
    const phase = (x * 0.05 - t * 8) % 6.283;
    const spike = Math.exp(-Math.pow(((phase + 6.283) % 6.283) - 0.4, 2) * 40) * 55;
    const y = base - spike + Math.sin(x * 0.3) * 1.5;
    if (x === 20) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.fillStyle = "rgba(69,214,191,0.12)";
  ctx.fillRect(20, base + 8, w - 40, 2);
};

function Applicator({ animate }: { animate: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const quat = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), DIR), []);
  const tipGlow = useMemo(() => glowMaterial("#8fe3b4"), []);
  useEffect(() => () => tipGlow.dispose(), [tipGlow]);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const kick = animate ? Math.max(0, Math.sin(clock.elapsedTime * 12 * Math.PI)) * 0.006 : 0;
    ref.current.position.copy(APPLICATOR_POS).addScaledVector(DIR, -kick);
  });
  return (
    <group ref={ref} position={APPLICATOR_POS} quaternion={quat}>
      <mesh material={mat.rubber} position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.042, 0.048, 0.18, 20]} />
      </mesh>
      <mesh material={mat.shell} position={[0, -0.03, 0]}>
        <cylinderGeometry args={[0.06, 0.056, 0.28, 24]} />
      </mesh>
      <mesh material={mat.brand} position={[0, 0.09, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.059, 0.008, 8, 32]} />
      </mesh>
      <mesh material={mat.accent} position={[0.052, -0.06, 0]}>
        <boxGeometry args={[0.02, 0.05, 0.03]} />
      </mesh>
      <mesh material={mat.chrome} position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.042, 0.058, 0.06, 24]} />
      </mesh>
      <mesh material={mat.chrome} position={[0, 0.185, 0]}>
        <cylinderGeometry args={[0.04, 0.042, 0.04, 24]} />
      </mesh>
      <mesh material={tipGlow} position={[0, 0.21, 0]}>
        <sphereGeometry args={[0.034, 20, 14]} />
      </mesh>
    </group>
  );
}

export function Shockwave({ animate }: { animate: boolean }) {
  const ringRotation = useMemo(() => {
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), DIR);
    const e = new THREE.Euler().setFromQuaternion(q);
    return [e.x, e.y, e.z] as V3;
  }, []);
  const ringPos: V3 = [tip.x + DIR.x * 0.02, tip.y + DIR.y * 0.02, tip.z + DIR.z * 0.02];

  return (
    <group>
      {/* Trolley */}
      <RoundedBox args={[0.64, 0.06, 0.52]} radius={0.025} smoothness={3} position={[0, 0.12, 0]} material={mat.shellWarm} />
      {([
        [0.27, 0, 0.21],
        [-0.27, 0, 0.21],
        [0.27, 0, -0.21],
        [-0.27, 0, -0.21],
      ] as V3[]).map((p, i) => (
        <Caster key={i} position={p} />
      ))}
      <RoundedBox args={[0.17, 0.84, 0.2]} radius={0.05} smoothness={3} position={[0, 0.56, -0.08]} material={mat.shell} />
      <mesh material={mat.brand} position={[0, 0.56, 0.022]}>
        <boxGeometry args={[0.03, 0.66, 0.01]} />
      </mesh>

      {/* Generator unit */}
      <RoundedBox args={[0.74, 0.34, 0.54]} radius={0.06} smoothness={4} position={[0, 1.14, 0]} material={mat.shell} />
      <RoundedBox args={[0.746, 0.06, 0.546]} radius={0.02} smoothness={2} position={[0, 1.02, 0]} material={mat.brand} />
      {[-0.12, -0.06, 0, 0.06, 0.12].map((x) => (
        <mesh key={x} material={mat.navy} position={[x - 0.1, 1.16, 0.272]}>
          <boxGeometry args={[0.03, 0.12, 0.004]} />
        </mesh>
      ))}

      {/* Touchscreen */}
      <group position={[0, 1.47, 0.02]} rotation={[-0.45, 0, 0]}>
        <ScreenPanel width={0.58} height={0.36} draw={drawScreen} animated={animate} />
      </group>

      {/* Handpiece holder */}
      <mesh material={mat.shellWarm} position={[0.42, 1.12, 0.14]}>
        <cylinderGeometry args={[0.055, 0.045, 0.14, 24, 1, true]} />
      </mesh>
      <mesh material={mat.accent} position={[0.42, 1.19, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.055, 0.008, 8, 32]} />
      </mesh>

      <Applicator animate={animate} />
      <Cable points={CABLE} radius={0.016} />
      {animate ? <PulseRings position={ringPos} rotation={ringRotation} color="#5ace90" count={3} speed={1.1} radius={0.07} maxScale={0.9} /> : null}
    </group>
  );
}
