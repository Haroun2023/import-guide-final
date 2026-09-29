import { RoundedBox } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Cable, Caster, FlowTube, mat, PulseRings, ScreenPanel, screenBase, type ScreenDraw, type V3 } from "../kit";

export const anchors: Record<string, { pos: V3; normal: V3 }> = {
  electrodes: { pos: [-0.12, 0.33, 0.12], normal: [0, 0.75, 0.66] },
  ultrasound: { pos: [0.5, 1.2, 0.2], normal: [0.35, 0.35, 0.87] },
  console: { pos: [-0.08, 1.09, 0.2], normal: [0, 0.48, 0.88] },
};

const PADS: V3[] = [
  [-0.24, 0.285, 0.1],
  [-0.08, 0.285, 0.1],
  [0.08, 0.285, 0.1],
  [0.24, 0.285, 0.1],
];
const LEADS: V3[][] = PADS.map((p, i) => [
  [-0.18 + i * 0.08, 0.93, 0.19],
  [-0.2 + i * 0.1, 0.8, 0.3],
  [p[0] * 1.1, 0.5, 0.26],
  [p[0], 0.33, p[2] + 0.05],
  [p[0], 0.3, p[2]],
]);
const PROBE_POS = new THREE.Vector3(0.44, 1.14, 0.12);
const PROBE_DIR = new THREE.Vector3(0.35, 0.8, 0.45).normalize();
const PROBE_HEAD = PROBE_POS.clone().addScaledVector(PROBE_DIR, 0.13);
const PROBE_CABLE: V3[] = [
  [0.3, 1.0, -0.05],
  [0.42, 0.92, 0.0],
  [0.47, 0.98, 0.06],
  [PROBE_POS.x - PROBE_DIR.x * 0.12, PROBE_POS.y - PROBE_DIR.y * 0.12, PROBE_POS.z - PROBE_DIR.z * 0.12],
];

const drawScreen: ScreenDraw = (ctx, w, h, t) => {
  screenBase(ctx, w, h, "COMBINED THERAPY", "#7fe8d6");
  const rows: [string, string, string][] = [
    ["TENS", "80 Hz", "#7fe8d6"],
    ["IFC", "4 kHz", "#9ad8ff"],
    ["US", "1 MHz · 1.2 W/cm²", "#f5c24a"],
  ];
  rows.forEach(([k, v, c], i) => {
    const y = 88 + i * 46;
    ctx.fillStyle = c;
    ctx.fillRect(24, y - 16, 6, 24);
    ctx.fillStyle = "#9fc3c9";
    ctx.font = "600 17px system-ui, sans-serif";
    ctx.fillText(k, 42, y);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 22px system-ui, sans-serif";
    ctx.fillText(v, 110, y);
  });
  ctx.strokeStyle = "#7fe8d6";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = 24; x < w - 24; x += 2) {
    const y = 262 + Math.sin(x * 0.06 - t * 5) * 18 * Math.sin(x * 0.012 + 0.4);
    if (x === 24) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
};

export function Combo({ animate }: { animate: boolean }) {
  const probeQuat = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), PROBE_DIR), []);
  const rippleRot = useMemo(() => {
    const e = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), PROBE_DIR));
    return [e.x, e.y, e.z] as V3;
  }, []);
  const padMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#2b3a3f", roughness: 0.6 }), []);
  useEffect(() => () => padMat.dispose(), [padMat]);

  return (
    <group>
      {/* Trolley: two shelves on chrome posts */}
      <RoundedBox args={[0.86, 0.05, 0.52]} radius={0.02} smoothness={3} position={[0, 0.86, 0]} material={mat.shell} />
      <RoundedBox args={[0.86, 0.04, 0.52]} radius={0.02} smoothness={3} position={[0, 0.25, 0]} material={mat.shellWarm} />
      {([
        [0.39, 0.21],
        [-0.39, 0.21],
        [0.39, -0.21],
        [-0.39, -0.21],
      ] as [number, number][]).map(([x, z]) => (
        <group key={`${x}${z}`}>
          <mesh material={mat.chrome} position={[x, 0.5, z]}>
            <cylinderGeometry args={[0.018, 0.018, 0.78, 12]} />
          </mesh>
          <Caster position={[x, 0, z]} />
        </group>
      ))}

      {/* Console */}
      <RoundedBox args={[0.64, 0.2, 0.42]} radius={0.05} smoothness={4} position={[0, 0.98, -0.03]} material={mat.shell} />
      <group position={[-0.08, 1.07, 0.16]} rotation={[-0.5, 0, 0]}>
        <ScreenPanel width={0.36} height={0.22} draw={drawScreen} animated={animate} />
      </group>
      <mesh material={mat.gold} position={[0.2, 1.06, 0.17]} rotation={[Math.PI / 2 - 0.5, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.055, 0.04, 32]} />
      </mesh>
      {[0.14, 0.26].map((x) => (
        <mesh key={x} material={mat.teal} position={[x, 0.99, 0.19]}>
          <boxGeometry args={[0.07, 0.025, 0.02]} />
        </mesh>
      ))}

      {/* Ultrasound probe resting in its holder */}
      <mesh material={mat.shellWarm} position={[0.4, 1.0, 0.06]}>
        <cylinderGeometry args={[0.05, 0.04, 0.12, 20, 1, true]} />
      </mesh>
      <group position={PROBE_POS} quaternion={probeQuat}>
        <mesh material={mat.shell}>
          <cylinderGeometry args={[0.032, 0.036, 0.22, 20]} />
        </mesh>
        <mesh material={mat.chrome} position={[0, 0.125, 0]}>
          <cylinderGeometry args={[0.05, 0.04, 0.03, 28]} />
        </mesh>
      </group>
      <Cable points={PROBE_CABLE} radius={0.012} />
      {animate ? <PulseRings position={[PROBE_HEAD.x, PROBE_HEAD.y, PROBE_HEAD.z]} rotation={rippleRot} color="#f5c24a" count={3} speed={0.8} radius={0.05} maxScale={0.6} /> : null}

      {/* Electrode leads and pads */}
      {LEADS.map((pts, i) => (
        <group key={i}>
          <Cable points={pts} radius={0.008} material={mat.cable} />
          {animate ? <FlowTube points={pts} radius={0.012} color={i % 2 ? "#9ad8ff" : "#7fe8d6"} speed={0.6 + i * 0.07} opacity={0.8} /> : null}
          <RoundedBox args={[0.12, 0.012, 0.09]} radius={0.005} smoothness={2} position={PADS[i]} material={padMat} />
          <mesh position={[PADS[i][0], PADS[i][1] + 0.007, PADS[i][2]]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.03, 0.036, 24]} />
            <meshBasicMaterial color={i % 2 ? "#9ad8ff" : "#7fe8d6"} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
