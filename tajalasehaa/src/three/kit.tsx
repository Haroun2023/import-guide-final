import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* Materials — "clinical luxury": glossy ivory shells, teal, crown gold */
/* ------------------------------------------------------------------ */

export const mat = {
  shell: new THREE.MeshPhysicalMaterial({ color: "#f4f0e8", roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.16 }),
  shellWarm: new THREE.MeshPhysicalMaterial({ color: "#e7dfd1", roughness: 0.38, clearcoat: 0.5, clearcoatRoughness: 0.25 }),
  porcelain: new THREE.MeshPhysicalMaterial({ color: "#efe8dd", roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.4, sheen: 0.4, sheenColor: new THREE.Color("#fff4e0") }),
  teal: new THREE.MeshStandardMaterial({ color: "#0e7471", roughness: 0.32, metalness: 0.25 }),
  tealDeep: new THREE.MeshStandardMaterial({ color: "#0a4a4b", roughness: 0.4, metalness: 0.2 }),
  gold: new THREE.MeshStandardMaterial({ color: "#caa24c", roughness: 0.26, metalness: 1 }),
  chrome: new THREE.MeshStandardMaterial({ color: "#e3e9ea", roughness: 0.14, metalness: 1 }),
  steel: new THREE.MeshStandardMaterial({ color: "#9aa7ab", roughness: 0.35, metalness: 0.9 }),
  rubber: new THREE.MeshStandardMaterial({ color: "#1c2428", roughness: 0.82 }),
  cable: new THREE.MeshStandardMaterial({ color: "#2a3438", roughness: 0.55 }),
  cableLight: new THREE.MeshStandardMaterial({ color: "#d9d4ca", roughness: 0.5 }),
  glassDark: new THREE.MeshPhysicalMaterial({ color: "#0b1b22", roughness: 0.06, metalness: 0.2, clearcoat: 1 }),
  bubble: new THREE.MeshPhysicalMaterial({
    color: "#eaf6ff",
    roughness: 0.18,
    transparent: true,
    opacity: 0.32,
    side: THREE.DoubleSide,
    depthWrite: false,
    clearcoat: 1,
  }),
};

export const glowMaterial = (color: string, opacity = 1) =>
  new THREE.MeshBasicMaterial({ color, toneMapped: false, transparent: opacity < 1, opacity });

/* ------------------------------------------------------------------ */
/* Studio lighting — procedural environment, no HDR download            */
/* ------------------------------------------------------------------ */

export function Studio({ intensity = 1 }: { intensity?: number }) {
  return (
    <>
      <ambientLight intensity={0.35 * intensity} />
      <directionalLight position={[3.5, 6, 5]} intensity={1.7 * intensity} />
      <directionalLight position={[-5, 2.5, -3]} intensity={0.7 * intensity} color="#9ee6ff" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.4} position={[0, 5, 3]} scale={[10, 2.5, 1]} />
        <Lightformer form="rect" intensity={1.3} position={[-6, 1.5, 1]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} color="#c9f5ec" />
        <Lightformer form="rect" intensity={1.1} position={[6, 1.5, -1]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} color="#ffe7b8" />
        <Lightformer form="ring" intensity={1.6} position={[0, 2, -6]} scale={4} />
        <Lightformer form="rect" intensity={0.6} position={[0, -3, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} color="#0e7471" />
      </Environment>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                     */
/* ------------------------------------------------------------------ */

export type V3 = [number, number, number];

export function Cable({ points, radius = 0.018, material = mat.cable, segments = 64 }: { points: V3[]; radius?: number; material?: THREE.Material; segments?: number }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    return new THREE.TubeGeometry(curve, segments, radius, 8, false);
  }, [points, radius, segments]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} material={material} />;
}

/** Tube with an animated light pulse travelling along it (nerve signal / energy). */
export function FlowTube({
  points,
  radius = 0.02,
  color = "#45d6bf",
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

/** Concentric rings expanding from a point — shockwaves, ultrasound, EMS pulses. */
export function PulseRings({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color = "#45d6bf",
  count = 3,
  speed = 0.9,
  maxScale = 1,
  radius = 0.12,
}: {
  position?: V3;
  rotation?: V3;
  color?: string;
  count?: number;
  speed?: number;
  maxScale?: number;
  radius?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const geometry = useMemo(() => new THREE.TorusGeometry(radius, radius * 0.06, 8, 48), [radius]);
  const materials = useMemo(
    () => Array.from({ length: count }, () => new THREE.MeshBasicMaterial({ color, transparent: true, toneMapped: false, depthWrite: false, blending: THREE.AdditiveBlending })),
    [color, count],
  );
  useEffect(
    () => () => {
      geometry.dispose();
      materials.forEach((m) => m.dispose());
    },
    [geometry, materials],
  );
  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    g.children.forEach((child, i) => {
      const t = (clock.elapsedTime * speed + i / count) % 1;
      const s = 0.3 + t * 2.4 * maxScale;
      child.scale.setScalar(s);
      materials[i].opacity = (1 - t) * 0.9;
    });
  });
  return (
    <group ref={group} position={position} rotation={rotation}>
      {materials.map((m, i) => (
        <mesh key={i} geometry={geometry} material={m} />
      ))}
    </group>
  );
}

export function Caster({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <mesh material={mat.steel} position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.08, 10]} />
      </mesh>
      <mesh material={mat.rubber} rotation={[0, 0, Math.PI / 2]} position={[0, 0.035, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.03, 18]} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Device screens — UI drawn on a canvas texture                        */
/* ------------------------------------------------------------------ */

export type ScreenDraw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;

export function useScreenTexture(draw: ScreenDraw, animated = false, size: [number, number] = [512, 320]) {
  const { canvas, texture } = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = size[0];
    c.height = size[1];
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return { canvas: c, texture: tex };
  }, [size]);
  useEffect(() => {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      draw(ctx, canvas.width, canvas.height, 0);
      texture.needsUpdate = true;
    }
    return () => texture.dispose();
    // draw is expected to be a stable module-level function
  }, [canvas, texture, draw]);
  const last = useRef(0);
  useFrame(({ clock }) => {
    if (!animated) return;
    if (clock.elapsedTime - last.current < 1 / 15) return; // 15 fps is plenty for a screen
    last.current = clock.elapsedTime;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    draw(ctx, canvas.width, canvas.height, clock.elapsedTime);
    texture.needsUpdate = true;
  });
  return texture;
}

export function ScreenPanel({
  width,
  height,
  draw,
  animated = false,
  bezel = 0.03,
  depth = 0.04,
  frameMaterial = mat.glassDark,
}: {
  width: number;
  height: number;
  draw: ScreenDraw;
  animated?: boolean;
  bezel?: number;
  depth?: number;
  frameMaterial?: THREE.Material;
}) {
  const texture = useScreenTexture(draw, animated);
  return (
    <group>
      <RoundedBox args={[width, height, depth]} radius={Math.min(0.03, depth / 2)} smoothness={3} material={frameMaterial} />
      <mesh position={[0, 0, depth / 2 + 0.001]}>
        <planeGeometry args={[width - bezel * 2, height - bezel * 2]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Shared screen chrome: dark gradient background + header bar. */
export function screenBase(ctx: CanvasRenderingContext2D, w: number, h: number, title: string, accent = "#45d6bf") {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#0b2a30");
  g.addColorStop(1, "#061a1f");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fillRect(0, 0, w, 44);
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(24, 22, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e8f6f3";
  ctx.font = "600 20px system-ui, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText(title, 42, 23);
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
