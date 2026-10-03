import { Billboard, PerformanceMonitor, Sparkles } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { SceneBaseProps } from "@/components/three/LazyCanvas";
import { MARK_PATH, MARK_VIEWBOX } from "./brandMark";
import { FlowTube, mat, ReadySignal, Studio, type V3 } from "./kit";

/**
 * Hero: a spine that moves from misaligned (coral "pain" discs) to healthy
 * alignment (leaf-green discs), then a signal travels up the cord and the
 * logo's leaf crown rises on top — «الصحة تاج».
 */

const LEVELS = 24; // L5 (0) … C1 (23)
const HEALTHY = new THREE.Color("#5ace90");
const CORAL = new THREE.Color("#ff5a4e");
const Y = new THREE.Vector3(0, 1, 0);

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

function vertebraGeometry() {
  const profile = [
    [0, -0.13], [0.29, -0.13], [0.35, -0.118], [0.372, -0.085], [0.35, -0.03], [0.342, 0],
    [0.35, 0.03], [0.372, 0.085], [0.35, 0.118], [0.29, 0.13], [0, 0.13],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const body = new THREE.LatheGeometry(profile, 30);
  body.scale(1, 1, 0.82);

  const arch = new THREE.TorusGeometry(0.19, 0.05, 8, 20, Math.PI);
  arch.rotateX(-Math.PI / 2);
  arch.translate(0, 0.02, -0.26);

  const spinous = new THREE.CylinderGeometry(0.028, 0.066, 0.36, 10);
  spinous.rotateX(-(Math.PI / 2 + 0.45));
  spinous.translate(0, -0.058, -0.612);

  const parts: THREE.BufferGeometry[] = [body, arch, spinous];
  for (const s of [-1, 1]) {
    const tp = new THREE.CapsuleGeometry(0.04, 0.22, 4, 10);
    tp.rotateZ(Math.PI / 2);
    tp.rotateY(s * 0.35);
    tp.translate(s * 0.3, 0.02, -0.32);
    parts.push(tp);
  }
  const merged = mergeGeometries(parts)!;
  parts.forEach((p) => p.dispose());
  return merged;
}

type Pose = { pos: THREE.Vector3; quat: THREE.Quaternion; scale: number };

function buildPoses() {
  const curve = new THREE.CatmullRomCurve3(
    [
      [0, -3.0, 0.05],
      [0, -2.3, 0.32],
      [0, -1.5, 0.18],
      [0, -0.7, -0.12],
      [0, 0.1, -0.34],
      [0, 0.9, -0.22],
      [0, 1.6, 0.06],
      [0, 2.3, 0.26],
      [0, 2.95, 0.12],
    ].map((p) => new THREE.Vector3(...(p as V3))),
  );
  const scales = Array.from({ length: LEVELS }, (_, i) => THREE.MathUtils.lerp(1.08, 0.58, Math.pow(i / (LEVELS - 1), 0.9)));
  const steps = scales.map((s) => 0.26 * s + 0.1 * s);
  const total = steps.reduce((a, b) => a + b, 0);

  const aligned: Pose[] = [];
  let acc = steps[0] / 2;
  for (let i = 0; i < LEVELS; i++) {
    const u = 0.03 + (acc / total) * 0.95;
    const pos = curve.getPointAt(u);
    const tangent = curve.getTangentAt(u);
    const quat = new THREE.Quaternion().setFromUnitVectors(Y, tangent);
    aligned.push({ pos, quat, scale: scales[i] });
    acc += (steps[i] + (steps[i + 1] ?? steps[i])) / 2;
  }

  // "Pain" pose: scoliosis-like S curve, twists, compressed lumbar gaps.
  const rand = (i: number) => {
    const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const misaligned: Pose[] = aligned.map((p, i) => {
    const s = i / (LEVELS - 1);
    const lateral = 0.5 * Math.sin(s * Math.PI * 2.1 + 0.5) * (1 - 0.35 * s);
    const pos = p.pos.clone().add(new THREE.Vector3(lateral, -0.18 * (1 - s) * (1 - s), (rand(i) - 0.5) * 0.12));
    const e = new THREE.Euler((rand(i + 3) - 0.5) * 0.3, 0.55 * Math.sin(s * Math.PI * 2.1) + (rand(i + 7) - 0.5) * 0.25, 0.32 * Math.cos(s * Math.PI * 2.1 + 0.4) + (rand(i + 11) - 0.5) * 0.18);
    const quat = p.quat.clone().multiply(new THREE.Quaternion().setFromEuler(e));
    return { pos, quat, scale: p.scale };
  });

  // Nerve cord runs through the vertebral canal, then rises toward the crown.
  const cord: V3[] = aligned.map((p) => {
    const off = new THREE.Vector3(0, 0, -0.36 * p.scale).applyQuaternion(p.quat);
    const v = p.pos.clone().add(off);
    return [v.x, v.y, v.z];
  });
  const top = aligned[LEVELS - 1].pos;
  cord.push([top.x, top.y + 0.35, top.z - 0.05], [top.x, top.y + 0.62, top.z]);

  // Pain weight per disc: lumbar L4–S1 and lower cervical.
  const pain = Array.from({ length: LEVELS - 1 }, (_, i) => Math.max(Math.exp(-Math.pow((i - 0.5) / 1.6, 2)), 0.8 * Math.exp(-Math.pow((i - 18.5) / 1.3, 2)), 0.25));

  return { aligned, misaligned, cord, pain, crownY: top.y + 0.95 };
}

const tmpM = new THREE.Matrix4();
const tmpQ = new THREE.Quaternion();
const tmpV = new THREE.Vector3();
const tmpS = new THREE.Vector3();
const tmpColor = new THREE.Color();

function Spine({ reducedMotion, progress }: { reducedMotion: boolean; progress: { current: number } }) {
  const { aligned, misaligned, cord, pain, crownY } = useMemo(buildPoses, []);
  const vGeo = useMemo(vertebraGeometry, []);
  const dGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.33, 0.33, 0.075, 30);
    g.scale(1, 1, 0.82);
    return g;
  }, []);
  const hGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.45, 0.45, 0.02, 30);
    g.scale(1, 1, 0.82);
    return g;
  }, []);
  const discMat = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false }), []);
  const haloMat = useMemo(
    () => new THREE.MeshBasicMaterial({ toneMapped: false, transparent: true, opacity: 0.28, depthWrite: false, blending: THREE.AdditiveBlending }),
    [],
  );
  useEffect(
    () => () => {
      vGeo.dispose();
      dGeo.dispose();
      hGeo.dispose();
      discMat.dispose();
      haloMat.dispose();
    },
    [vGeo, dGeo, hGeo, discMat, haloMat],
  );

  const vRef = useRef<THREE.InstancedMesh>(null);
  const dRef = useRef<THREE.InstancedMesh>(null);
  const hRef = useRef<THREE.InstancedMesh>(null);
  const crown = useRef<THREE.Group>(null);
  const cordOpacity = useRef(0);
  const start = useRef<number | null>(null);
  const lastE = useRef(-1);
  // Pre-allocated per-level transforms (no allocations inside the frame loop).
  const cur = useMemo(
    () => ({
      pos: Array.from({ length: LEVELS }, () => new THREE.Vector3()),
      quat: Array.from({ length: LEVELS }, () => new THREE.Quaternion()),
    }),
    [],
  );

  useFrame(({ clock }) => {
    if (start.current === null) start.current = clock.elapsedTime;
    const t = clock.elapsedTime - start.current;
    const e = reducedMotion ? 1 : ease(clamp01((t - 0.7) / 2.6));
    progress.current = e;
    const breathe = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 1.4) * 0.012;

    if (e !== lastE.current || !reducedMotion) {
      lastE.current = e;
      const v = vRef.current;
      const d = dRef.current;
      const h = hRef.current;
      if (!v || !d || !h) return;
      for (let i = 0; i < LEVELS; i++) {
        const a = aligned[i];
        const m = misaligned[i];
        const pos = cur.pos[i].copy(m.pos).lerp(a.pos, e);
        pos.y += breathe * (i / LEVELS);
        const quat = cur.quat[i].copy(m.quat).slerp(a.quat, e);
        tmpS.setScalar(a.scale);
        tmpM.compose(pos, quat, tmpS);
        v.setMatrixAt(i, tmpM);
      }
      v.instanceMatrix.needsUpdate = true;

      for (let i = 0; i < LEVELS - 1; i++) {
        tmpV.copy(cur.pos[i]).lerp(cur.pos[i + 1], 0.5);
        tmpQ.copy(cur.quat[i]).slerp(cur.quat[i + 1], 0.5);
        const s = (aligned[i].scale + aligned[i + 1].scale) / 2;
        const squeeze = THREE.MathUtils.lerp(0.55, 1, e);
        tmpS.set(s, s * squeeze, s);
        tmpM.compose(tmpV, tmpQ, tmpS);
        d.setMatrixAt(i, tmpM);
        h.setMatrixAt(i, tmpM);
        const painPulse = (1 - e) * pain[i] * (0.75 + 0.25 * Math.sin(clock.elapsedTime * 5));
        tmpColor.copy(HEALTHY).lerp(CORAL, Math.min(1, painPulse * 1.25));
        d.setColorAt(i, tmpColor);
        h.setColorAt(i, tmpColor);
      }
      d.instanceMatrix.needsUpdate = true;
      h.instanceMatrix.needsUpdate = true;
      if (d.instanceColor) d.instanceColor.needsUpdate = true;
      if (h.instanceColor) h.instanceColor.needsUpdate = true;
    }

    cordOpacity.current = reducedMotion ? 1 : clamp01((t - 2.4) / 1.2);

    const c = crown.current;
    if (c) {
      const k = reducedMotion ? 1 : ease(clamp01((t - 2.9) / 1.3));
      c.scale.setScalar(0.001 + k);
      c.position.y = crownY + (1 - k) * 0.6 + (reducedMotion ? 0 : Math.sin(clock.elapsedTime * 1.2) * 0.05);
    }
  });

  return (
    <group>
      <instancedMesh ref={vRef} args={[vGeo, mat.porcelain, LEVELS]} frustumCulled={false} />
      <instancedMesh ref={dRef} args={[dGeo, discMat, LEVELS - 1]} frustumCulled={false} />
      <instancedMesh ref={hRef} args={[hGeo, haloMat, LEVELS - 1]} frustumCulled={false} />
      <FlowTube points={cord} radius={0.035} color="#8fe3b4" speed={0.45} opacity={0.9} opacityRef={cordOpacity} />
      <group ref={crown} position={[0, crownY, 0.05]} scale={0.001}>
        <LeafCrown reducedMotion={reducedMotion} />
      </group>
      {/* Sacrum */}
      <mesh material={mat.porcelain} position={[0, -3.25, -0.02]} rotation={[0.35, 0, 0]} scale={[1, 1, 0.62]}>
        <cylinderGeometry args={[0.36, 0.12, 0.8, 24]} />
      </mesh>
    </group>
  );
}

/** The logo's leaf crown, extruded from the traced artwork. */
function LeafCrown({ reducedMotion }: { reducedMotion: boolean }) {
  const { geometry, width } = useMemo(() => {
    const [vx, vy, vw, vh] = MARK_VIEWBOX;
    const data = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${MARK_PATH}"/></svg>`);
    const shapes = data.paths.flatMap((path) => path.toShapes());
    const g = new THREE.ExtrudeGeometry(shapes, { depth: 14, bevelEnabled: true, bevelThickness: 3, bevelSize: 1.6, bevelSegments: 3, curveSegments: 7 });
    // SVG space (y down, pixels) → centred scene units (y up)
    const s = 1.35 / vw;
    g.translate(-(vx + vw / 2), -(vy + vh / 2), -7);
    g.scale(s, -s, s);
    g.computeVertexNormals();
    return { geometry: g, width: vw * s };
  }, []);
  const material = useMemo(() => {
    const [vx, vy, vw, vh] = MARK_VIEWBOX;
    // The logo's colour field (navy → green, lifted for the dark hero), mapped through the
    // extrusion's planar UVs (which are in logo pixels).
    const tex = new THREE.TextureLoader().load("/brand/mark-field-3d.jpg");
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.repeat.set(1 / vw, -1 / vh);
    tex.offset.set(-vx / vw, 1 + vy / vh);
    return new THREE.MeshStandardMaterial({
      color: "#ffffff",
      map: tex,
      emissive: "#ffffff",
      emissiveMap: tex,
      emissiveIntensity: 0.3,
      metalness: 0.35,
      roughness: 0.28,
    });
  }, []);
  const glowTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(191,238,211,0.85)");
    g.addColorStop(0.35, "rgba(90,206,144,0.32)");
    g.addColorStop(1, "rgba(90,206,144,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
  useEffect(
    () => () => {
      geometry.dispose();
      material.map?.dispose();
      material.dispose();
      glowTex.dispose();
    },
    [geometry, material, glowTex],
  );
  const sway = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (sway.current && !reducedMotion) sway.current.rotation.y = Math.sin(clock.elapsedTime * 0.9) * 0.42;
  });
  return (
    <Billboard>
      <mesh position={[0, 0.02, -0.25]}>
        <planeGeometry args={[width * 2.1, width * 2.1]} />
        <meshBasicMaterial map={glowTex} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <group ref={sway}>
        <mesh geometry={geometry} material={material} />
      </group>
    </Billboard>
  );
}

function Rig({ reducedMotion, children }: { reducedMotion: boolean; children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { viewport, size } = useThree();
  const mobile = size.width < 768;
  const baseX = mobile ? -viewport.width * 0.34 : -viewport.width * 0.21;
  const baseScale = mobile ? 0.6 : 0.74;

  useFrame(({ pointer, clock }, delta) => {
    const g = group.current;
    if (!g) return;
    const scroll = typeof window !== "undefined" ? Math.min(1, window.scrollY / Math.max(1, window.innerHeight)) : 0;
    const targetY = -1.05 + (reducedMotion ? 0 : pointer.x * 0.35 + Math.sin(clock.elapsedTime * 0.25) * 0.18) + scroll * 1.1;
    const targetX = reducedMotion ? 0.05 : 0.05 - pointer.y * 0.08;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 3, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 3, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, -0.62 + scroll * 0.8, 4, delta);
  });

  return (
    <group position={[baseX, 0, 0]} scale={baseScale}>
      <group ref={group}>{children}</group>
    </group>
  );
}

export default function SpineScene({ active, reducedMotion, onReady }: SceneBaseProps) {
  const [dpr, setDpr] = useState<[number, number]>([1, 1.75]);
  const progress = useRef(0);
  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0.3, 12.5], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden
    >
      <PerformanceMonitor onDecline={() => setDpr([1, 1])} />
      <Studio intensity={0.9} />
      <Rig reducedMotion={reducedMotion}>
        <Spine reducedMotion={reducedMotion} progress={progress} />
      </Rig>
      {!reducedMotion ? <Sparkles count={60} scale={[9, 8, 4]} size={2.2} speed={0.25} opacity={0.5} color="#8fe3b4" /> : null}
      <ReadySignal onReady={onReady} />
    </Canvas>
  );
}
