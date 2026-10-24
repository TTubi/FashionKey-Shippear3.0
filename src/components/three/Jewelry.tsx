'use client';
import { useFrame } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { DoubleSide, Group, InstancedMesh, LatheGeometry, MathUtils, Matrix4, MeshPhysicalMaterial, MeshStandardMaterial, Object3D, QuadraticBezierCurve3, Quaternion, Vector2, Vector3 } from 'three';
import { fingerprintTexture } from './Glasses';

// Prototipos de joyería FashionKey (ver Ejemplos/Pendiente.png y Ejemplos/Colgante_FashionKey.png), modelados con geometría propia.
// Aros: diamante central con halo de piedras, poste y traba con el sensor de huella en la cara trasera (detrás del lóbulo).
// Colgante: bisel dorado, halo de piedras, sensor de huella bajo un cristal ahumado, argolla y cadena.

// Talla brillante simplificada: corona plana arriba (+z) y pabellón en punta. Facetada con flatShading.
function gemGeometry(segments: number) {
  const g = new LatheGeometry([new Vector2(0, -0.62), new Vector2(1, 0), new Vector2(0.92, 0.12), new Vector2(0.56, 0.3), new Vector2(0, 0.3)], segments);
  g.rotateX(Math.PI / 2);
  return g;
}

function useJewelryMaterials(metal: string, accent: string, reduced: boolean, print: ReturnType<typeof fingerprintTexture>) {
  const gold = useMemo(() => new MeshStandardMaterial({ metalness: 1, roughness: 0.18 }), []);
  const diamond = useMemo(() => new MeshPhysicalMaterial({ color: '#f7f9ff', metalness: 0.85, roughness: 0.02, clearcoat: 1, clearcoatRoughness: 0, flatShading: true, envMapIntensity: 2.6, iridescence: 0.35, iridescenceIOR: 1.8 }), []);
  const pave = useMemo(() => new MeshStandardMaterial({ color: '#f4f6ff', metalness: 0.9, roughness: 0.04, flatShading: true, envMapIntensity: 2 }), []);
  const sensor = useMemo(() => new MeshPhysicalMaterial({ map: print, emissiveMap: print, emissive: '#ffffff', emissiveIntensity: 0, roughness: 0.15, metalness: 0.2, clearcoat: 1 }), [print]);
  useEffect(() => { gold.color.set(metal); }, [gold, metal]);
  useEffect(() => { sensor.emissive.set(accent); }, [sensor, accent]);
  useEffect(() => () => { gold.dispose(); diamond.dispose(); pave.dispose(); sensor.dispose(); print.dispose(); }, [gold, diamond, pave, sensor, print]);
  useFrame(({ clock }) => { sensor.emissiveIntensity = reduced ? 0.12 : 0.06 + (Math.sin(clock.elapsedTime * 2.4) + 1) * 0.09; });
  return { gold, diamond, pave, sensor };
}

// Piedras pequeñas repartidas en un anillo (pavé), con una sola malla instanciada.
function PaveRing({ count, radius, size, z, geometry, material }: { count: number; radius: number; size: number; z: number; geometry: LatheGeometry; material: MeshStandardMaterial }) {
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = new Matrix4(), q = new Quaternion(), s = new Vector3(size, size, size);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      m.compose(new Vector3(Math.cos(a) * radius, Math.sin(a) * radius, z), q, s);
      ref.current!.setMatrixAt(i, m);
    }
    ref.current!.instanceMatrix.needsUpdate = true;
  }, [count, radius, size, z]);
  return <instancedMesh ref={ref} args={[geometry, material, count]} />;
}

// ── Aros ───────────────────────────────────────────────────────────────
const EAR = { center: 0.75, back: -1.05, backSeparated: -2.05, backThickness: 0.2, sensorRadius: 0.6 };
export function earringLayout() {
  return { sensor: new Vector3(0, 0, EAR.center + EAR.back - EAR.backThickness / 2), sensorNormal: new Vector3(0, 0, -1) };
}

export function Earring({ metal, accent, reduced, separated = false }: { metal: string; accent: string; reduced: boolean; separated?: boolean }) {
  const print = useMemo(() => fingerprintTexture(), []);
  const { gold, diamond, pave, sensor } = useJewelryMaterials(metal, accent, reduced, print);
  const gem = useMemo(() => gemGeometry(24), []);
  const stone = useMemo(() => gemGeometry(8), []);
  const back = useRef<Group>(null);
  useEffect(() => () => { gem.dispose(); stone.dispose(); }, [gem, stone]);
  useFrame((_, delta) => {
    if (!back.current) return;
    const k = reduced ? 1 : 1 - Math.exp(-delta * 4);
    back.current.position.z = MathUtils.lerp(back.current.position.z, separated ? EAR.backSeparated : EAR.back, k);
  });
  return <group position={[0, 0, EAR.center]}>
    {/* Cabeza: base del halo, piedras, bisel y diamante central */}
    <mesh material={gold} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.02]}><cylinderGeometry args={[0.66, 0.6, 0.18, 64]} /></mesh>
    <PaveRing count={22} radius={0.565} size={0.062} z={0.08} geometry={stone} material={pave} />
    <mesh material={gold} position={[0, 0, 0.1]}><torusGeometry args={[0.46, 0.055, 18, 64]} /></mesh>
    <mesh material={gold} position={[0, 0, 0.1]}><torusGeometry args={[0.655, 0.03, 12, 64]} /></mesh>
    <mesh geometry={gem} material={diamond} scale={0.42} position={[0, 0, 0.11]} />
    {/* Poste */}
    <mesh material={gold} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.585]}><cylinderGeometry args={[0.034, 0.034, 1.03, 16]} /></mesh>
    <mesh material={gold} position={[0, 0, -1.1]}><sphereGeometry args={[0.042, 16, 12]} /></mesh>
    {/* Traba: cara delantera dorada con el orificio; cara trasera con el sensor de huella */}
    <group ref={back} position={[0, 0, EAR.back]}>
      <mesh material={gold} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.72, 0.72, EAR.backThickness, 64]} /></mesh>
      <mesh position={[0, 0, EAR.backThickness / 2 + 0.002]}><ringGeometry args={[0.04, 0.085, 32]} /><meshStandardMaterial color="#5a4630" metalness={0.6} roughness={0.5} /></mesh>
      <mesh material={gold} position={[0, 0, EAR.backThickness / 2]}><torusGeometry args={[0.085, 0.018, 10, 32]} /></mesh>
      <mesh material={sensor} position={[0, 0, -EAR.backThickness / 2 - 0.002]} rotation={[0, Math.PI, 0]}><circleGeometry args={[EAR.sensorRadius, 64]} /></mesh>
      <mesh material={gold} position={[0, 0, -EAR.backThickness / 2]}><torusGeometry args={[EAR.sensorRadius + 0.02, 0.03, 12, 64]} /></mesh>
    </group>
  </group>;
}

// ── Colgante ───────────────────────────────────────────────────────────
const PEN = { radius: 1, domeHeight: 0.28, offsetY: -0.25 };
export function pendantLayout() {
  return { sensor: new Vector3(0, PEN.offsetY, PEN.domeHeight), sensorNormal: new Vector3(0, 0, 1) };
}

// Cadena: eslabones instanciados a lo largo de dos curvas que suben desde la argolla, alternando 90° como una cadena rolo.
function Chain({ material }: { material: MeshStandardMaterial }) {
  const ref = useRef<InstancedMesh>(null);
  const PER_SIDE = 90;
  useLayoutEffect(() => {
    const dummy = new Object3D(), up = new Vector3(0, 1, 0), twist = new Quaternion();
    let i = 0;
    for (const side of [-1, 1]) {
      const curve = new QuadraticBezierCurve3(new Vector3(0, PEN.radius + 0.78, -0.02), new Vector3(side * 0.7, 3.2, -0.25), new Vector3(side * 1.7, 5.6, -0.7));
      for (let n = 0; n < PER_SIDE; n++) {
        const t = n / (PER_SIDE - 1);
        dummy.position.copy(curve.getPoint(t));
        dummy.quaternion.setFromUnitVectors(up, curve.getTangent(t).normalize());
        if (n % 2) dummy.quaternion.multiply(twist.setFromAxisAngle(up, Math.PI / 2));
        dummy.scale.set(1, 1.45, 1);
        dummy.updateMatrix();
        ref.current!.setMatrixAt(i++, dummy.matrix);
      }
    }
    ref.current!.instanceMatrix.needsUpdate = true;
  }, []);
  return <instancedMesh ref={ref} args={[undefined, material, PER_SIDE * 2]}><torusGeometry args={[0.032, 0.0085, 8, 16]} /></instancedMesh>;
}

export function Pendant({ metal, accent, reduced }: { metal: string; accent: string; reduced: boolean }) {
  const print = useMemo(() => fingerprintTexture({ light: '#3a383f', dark: '#0f0e12', line: 'rgba(205,210,220,.22)' }), []);
  const { gold, pave, sensor } = useJewelryMaterials(metal, accent, reduced, print);
  const stone = useMemo(() => gemGeometry(8), []);
  const dome = useMemo(() => new MeshPhysicalMaterial({ color: '#1b1a1f', transparent: true, opacity: 0.62, roughness: 0.02, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.02, side: DoubleSide, depthWrite: false }), []);
  useEffect(() => () => { stone.dispose(); dome.dispose(); }, [stone, dome]);
  // Casquete esférico que forma el cristal abombado sobre la huella.
  const a = PEN.radius - 0.08, h = PEN.domeHeight, sphereR = (a * a + h * h) / (2 * h), theta = Math.asin(a / sphereR);
  return <group position={[0, PEN.offsetY, 0]}>
    <mesh material={gold} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.06]}><cylinderGeometry args={[PEN.radius + 0.2, PEN.radius + 0.16, 0.14, 72]} /></mesh>
    <PaveRing count={60} radius={PEN.radius + 0.1} size={0.044} z={0.02} geometry={stone} material={pave} />
    <mesh material={gold} position={[0, 0, 0.03]}><torusGeometry args={[PEN.radius + 0.205, 0.028, 12, 72]} /></mesh>
    <mesh material={gold} position={[0, 0, 0.04]}><torusGeometry args={[PEN.radius - 0.03, 0.07, 20, 72]} /></mesh>
    <mesh material={sensor} position={[0, 0, 0.015]}><circleGeometry args={[a, 72]} /></mesh>
    <mesh material={dome} position={[0, 0, h - sphereR + 0.015]} rotation={[Math.PI / 2, 0, 0]}><sphereGeometry args={[sphereR, 72, 24, 0, Math.PI * 2, 0, theta]} /></mesh>
    {/* Argolla y unión con el bisel */}
    <mesh material={gold} position={[0, PEN.radius + 0.25, -0.02]}><cylinderGeometry args={[0.07, 0.085, 0.16, 20]} /></mesh>
    <mesh material={gold} position={[0, PEN.radius + 0.5, -0.02]} rotation={[0, Math.PI / 2, 0]} scale={[1, 1.7, 1]}><torusGeometry args={[0.13, 0.05, 16, 40]} /></mesh>
    <Chain material={gold} />
  </group>;
}
