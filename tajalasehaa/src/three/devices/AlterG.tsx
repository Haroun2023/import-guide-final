import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Cable, glowMaterial, mat, ScreenPanel, screenBase, type ScreenDraw, type V3 } from "../kit";

export const anchors: Record<string, { pos: V3; normal: V3 }> = {
  chamber: { pos: [-0.55, 0.88, 0.31], normal: [-0.34, 0.45, 0.83] },
  console: { pos: [0.93, 1.36, 0.0], normal: [-1, 0.25, 0.15] },
  belt: { pos: [-0.2, 0.3, 0.27], normal: [0, 0.6, 0.8] },
};

const HANDRAIL_L: V3[] = [
  [0.92, 1.12, -0.36],
  [0.7, 1.13, -0.4],
  [0.55, 1.12, -0.42],
];
const HANDRAIL_R: V3[] = HANDRAIL_L.map(([x, y, z]) => [x, y, -z]);

const drawConsole: ScreenDraw = (ctx, w, h, t) => {
  screenBase(ctx, w, h, "ANTI-GRAVITY · DAP", "#9ad8ff");
  const pct = 60 + Math.round(Math.sin(t * 0.6) * 2);
  const cx = 130;
  const cy = 190;
  ctx.lineWidth = 16;
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.beginPath();
  ctx.arc(cx, cy, 82, Math.PI * 0.75, Math.PI * 2.25);
  ctx.stroke();
  ctx.strokeStyle = "#9ad8ff";
  ctx.beginPath();
  ctx.arc(cx, cy, 82, Math.PI * 0.75, Math.PI * 0.75 + Math.PI * 1.5 * (pct / 100));
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 52px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${pct}%`, cx, cy + 4);
  ctx.font = "500 16px system-ui, sans-serif";
  ctx.fillStyle = "#a2bdcd";
  ctx.fillText("BODY WEIGHT", cx, cy + 44);
  ctx.textAlign = "left";
  const rows: [string, string][] = [
    ["SPEED", "3.2 km/h"],
    ["TIME", `${12 + Math.floor(t / 60) % 10}:${String(Math.floor(t) % 60).padStart(2, "0")}`],
    ["INCLINE", "2.0 %"],
  ];
  rows.forEach(([k, v], i) => {
    const y = 96 + i * 70;
    ctx.fillStyle = "#a2bdcd";
    ctx.font = "500 16px system-ui, sans-serif";
    ctx.fillText(k, 270, y);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 30px system-ui, sans-serif";
    ctx.fillText(v, 270, y + 32);
  });
};

function Belt() {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 32;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#132735";
    ctx.fillRect(0, 0, 256, 32);
    ctx.fillStyle = "#1f3a4c";
    for (let x = 0; x < 256; x += 16) ctx.fillRect(x, 0, 3, 32);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 1);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  useFrame((_, delta) => {
    texture.offset.x -= delta * 0.35;
  });
  return (
    <mesh position={[-0.08, 0.286, 0]}>
      <boxGeometry args={[1.62, 0.012, 0.54]} />
      <meshStandardMaterial map={texture} roughness={0.9} />
    </mesh>
  );
}

export function AlterG({ animate }: { animate: boolean }) {
  const bubble = useRef<THREE.Group>(null);
  const edgeGlow = useMemo(() => glowMaterial("#9ad8ff"), []);
  useEffect(() => () => edgeGlow.dispose(), [edgeGlow]);
  useFrame(({ clock }) => {
    if (!animate || !bubble.current) return;
    const s = 1 + Math.sin(clock.elapsedTime * 1.3) * 0.012;
    bubble.current.scale.set(s, s, s);
  });

  // Ellipsoid cross-section at x offset a (for the seams on the chamber).
  const seam = (a: number) => Math.sqrt(1 - (a / 0.95) ** 2);

  return (
    <group position={[0, 0, 0]}>
      {/* Deck */}
      <RoundedBox args={[2.1, 0.26, 0.84]} radius={0.07} smoothness={4} position={[0, 0.15, 0]} material={mat.shell} />
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, 0.19, s * 0.423]} material={edgeGlow}>
          <boxGeometry args={[1.86, 0.018, 0.006]} />
        </mesh>
      ))}
      <mesh position={[0, 0.03, 0]} material={mat.rubber}>
        <boxGeometry args={[2.0, 0.05, 0.76]} />
      </mesh>
      <Belt />

      {/* Pressurised chamber */}
      <group ref={bubble} position={[-0.1, 0.28, 0]}>
        <mesh material={mat.bubble} scale={[0.95, 0.95, 0.5]}>
          <sphereGeometry args={[1, 56, 28, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        {/* seams */}
        <mesh material={mat.cableLight} scale={[0.95, 0.95, 1]}>
          <torusGeometry args={[1, 0.006, 6, 64, Math.PI]} />
        </mesh>
        {[-0.45, 0.35].map((a) => (
          <mesh key={a} material={mat.cableLight} position={[a, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={[0.5 * seam(a), 0.95 * seam(a), 1]}>
            <torusGeometry args={[1, 0.008, 6, 48, Math.PI]} />
          </mesh>
        ))}
        {/* zip ring at the base of the chamber */}
        <mesh material={mat.navy} rotation={[Math.PI / 2, 0, 0]} scale={[0.95, 0.5, 1]}>
          <torusGeometry args={[1, 0.012, 6, 96]} />
        </mesh>
      </group>

      {/* Cockpit: the waist opening + height-adjustable frame */}
      <group position={[0.08, 1.19, 0]}>
        <mesh material={mat.brand} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.27, 0.038, 14, 48]} />
        </mesh>
        <mesh material={mat.rubber} position={[0, -0.06, 0]}>
          <cylinderGeometry args={[0.26, 0.3, 0.12, 40, 1, true]} />
        </mesh>
        {[-1, 1].map((s) => (
          <group key={s}>
            <mesh material={mat.chrome} position={[0, 0, s * 0.43]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.022, 0.022, 0.3, 12]} />
            </mesh>
            <mesh material={mat.chrome} position={[0, -0.47, s * 0.58]}>
              <cylinderGeometry args={[0.03, 0.03, 1.02, 14]} />
            </mesh>
            <mesh material={mat.shell} position={[0, 0, s * 0.58]}>
              <sphereGeometry args={[0.045, 16, 12]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Console */}
      <RoundedBox args={[0.14, 1.02, 0.34]} radius={0.05} smoothness={3} position={[1.0, 0.76, 0]} material={mat.shell} />
      <group position={[0.95, 1.36, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <group rotation={[-0.35, 0, 0]}>
          <ScreenPanel width={0.56} height={0.36} draw={drawConsole} animated={animate} />
        </group>
      </group>
      <Cable points={HANDRAIL_L} radius={0.022} material={mat.rubber} />
      <Cable points={HANDRAIL_R} radius={0.022} material={mat.rubber} />
    </group>
  );
}
