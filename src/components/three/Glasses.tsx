'use client';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { BufferGeometry, CanvasTexture, ExtrudeGeometry, Group, MathUtils, MeshPhysicalMaterial, MeshStandardMaterial, Path, PMREMGenerator, Shape, ShapeGeometry, SRGBColorSpace, Vector3 } from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { GlassesFrame } from '@/config/products';

// Prototipo FashionKey (ver /Ejemplos): frente de acetato grueso, incrustación dorada junto a la bisagra,
// patillas que bajan detrás de la oreja, sensor de huella con aro dorado en la punta derecha
// y placa dorada en la cara interna de la punta izquierda. Todo es geometría propia, sin archivos externos.
const HARDWARE = '#c9a45c';
// Frente: aro grueso por ojo (más ancho arriba), unidos solo por un puente alto, con hueco nasal abierto debajo.
// Medido sobre Ejemplos/Prototipo_Angulo_2.jpeg corrigiendo la perspectiva: aros ≈ 0,10 del ancho de la lente
// (incluido el borde redondeado de 0,022) y lentes más anchas que altas (alto ≈ 0,74 del ancho).
const RIM = { side: 0.066, top: 0.072, bottom: 0.062, nose: 0.05 };
const BRIDGE = 0.3, BRIDGE_DROP = 0.3, DEPTH = 0.11, WRAP = 0.05, SPLAY = 0.06, CENTER_Z = 1.1;
const CORNER = { top: 0.06, bottomOuter: 0.19, bottomInner: 0.22 };
const FOLD = { right: 1.5, left: 1.38 };
const SENSOR = { u: 2.47, v: -0.47, radius: 0.058 };

// Abertura de cada lente: esquinas superiores más rectas, inferiores más redondeadas y base apenas más angosta.
const lensOutline = <T extends Path>(p: T, w: number, h: number, r: number, cx: number) => {
  const top = h / 2, bottom = -h / 2, inset = w * 0.035, rt = r * 0.7, rb = Math.min(r * 1.8, h / 2.5);
  const L = cx - w / 2, R = cx + w / 2, bl = L + inset, br = R - inset;
  p.moveTo(bl + rb, bottom); p.lineTo(br - rb, bottom); p.quadraticCurveTo(br, bottom, br + inset * 0.4, bottom + rb);
  p.lineTo(R, top - rt); p.quadraticCurveTo(R, top, R - rt, top);
  p.lineTo(L + rt, top); p.quadraticCurveTo(L, top, L, top - rt);
  p.lineTo(bl - inset * 0.4, bottom + rb); p.quadraticCurveTo(bl, bottom, bl + rb, bottom);
  return p;
};
const wrapZ = (x: number) => -WRAP * x * x;

// Curva el frente hacia atrás en los costados (como un marco real) corrigiendo también las normales.
function bend(g: BufferGeometry) {
  const pos = g.attributes.position, nor = g.attributes.normal, n = new Vector3();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    pos.setZ(i, pos.getZ(i) + wrapZ(x));
    if (nor) { n.set(nor.getX(i) + 2 * WRAP * x * nor.getZ(i), nor.getY(i), nor.getZ(i)).normalize(); nor.setXYZ(i, n.x, n.y, n.z); }
  }
  pos.needsUpdate = true;
  if (nor) nor.needsUpdate = true;
  return g;
}

// Medidas derivadas de la forma de cada modelo (frame = abertura de cada lente); también las usa la cámara para encuadrar el sensor.
export function prototypeLayout(frame: GlassesFrame) {
  const { width: w, height: h } = frame;
  const lensX = BRIDGE / 2 + w / 2;
  const X = lensX + w / 2 + RIM.side, Y = h / 2 + RIM.top, bottom = -(h / 2 + RIM.bottom);
  const hingeY = Y - 0.085, pivotX = X - 0.07, pivotZ = -DEPTH / 2 + wrapZ(X);
  const lx = 0.079, lz = -SENSOR.u, c = Math.cos(SPLAY), s = Math.sin(SPLAY);
  const sensor = new Vector3(pivotX + lx * c - lz * s, hingeY + SENSOR.v, pivotZ + lx * s + lz * c + CENTER_Z);
  return { X, Y, bottom, lensX, hingeY, pivotX, pivotZ, sensor, sensorNormal: new Vector3(c, 0, s) };
}

function frontGeometry(frame: GlassesFrame) {
  const { width: w, height: h, radius: r } = frame;
  const { X, Y, bottom: B, lensX } = prototypeLayout(frame);
  const xi = BRIDGE / 2 - RIM.nose; // borde interno de cada aro, junto a la nariz
  const yb = h / 2 - h * BRIDGE_DROP; // parte inferior del puente
  const { top: rt, bottomOuter: ro, bottomInner: ri } = CORNER;
  const s = new Shape();
  s.moveTo(-X + rt, Y);
  s.lineTo(X - rt, Y); s.quadraticCurveTo(X, Y, X, Y - rt);
  s.lineTo(X, B + ro); s.quadraticCurveTo(X, B, X - ro, B);
  s.lineTo(xi + ri, B); s.quadraticCurveTo(xi, B, xi, B + ri);
  s.lineTo(xi, yb - 0.08); s.quadraticCurveTo(xi, yb, 0, yb); // arco del puente
  s.quadraticCurveTo(-xi, yb, -xi, yb - 0.08);
  s.lineTo(-xi, B + ri); s.quadraticCurveTo(-xi, B, -xi - ri, B);
  s.lineTo(-X + ro, B); s.quadraticCurveTo(-X, B, -X, B + ro);
  s.lineTo(-X, Y - rt); s.quadraticCurveTo(-X, Y, -X + rt, Y);
  s.holes.push(lensOutline(new Path(), w, h, r, -lensX), lensOutline(new Path(), w, h, r, lensX));
  const core = DEPTH - 0.06;
  const g = new ExtrudeGeometry(s, { depth: core, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.022, bevelSegments: 6, curveSegments: 36 });
  g.translate(0, 0, -core / 2);
  const lenses = [-1, 1].map(side => bend(new ShapeGeometry(lensOutline(new Shape(), w + 0.02, h + 0.02, r, side * lensX), 36)));
  return { front: bend(g), lenses };
}

// Perfil lateral de la patilla (u = hacia atrás, v = altura): alta junto a la bisagra, ondulada, y con la punta curvada hacia abajo.
function templeGeometry() {
  const s = new Shape();
  s.moveTo(0, 0.075);
  s.lineTo(0.5, 0.072);
  s.quadraticCurveTo(1.4, 0.065, 1.85, 0.055);
  s.quadraticCurveTo(2.3, 0.04, 2.56, -0.33);
  s.quadraticCurveTo(2.68, -0.56, 2.5, -0.63);
  s.quadraticCurveTo(2.36, -0.66, 2.31, -0.45);
  s.quadraticCurveTo(2.2, -0.08, 1.88, -0.045);
  s.lineTo(1.25, -0.03);
  s.quadraticCurveTo(0.8, -0.028, 0.62, -0.07);
  s.quadraticCurveTo(0.45, -0.08, 0, -0.08);
  s.closePath();
  const g = new ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3, curveSegments: 24 });
  g.rotateY(Math.PI / 2); // u → -z, profundidad → x (cara externa en x = 0.07)
  return g;
}

// Textura de huella para los sensores de todos los modelos (anteojos, aros y colgante).
export function fingerprintTexture({ light = '#6a6f77', dark = '#202227', line = 'rgba(225,230,236,.6)' } = {}) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const x = c.getContext('2d')!;
  const bg = x.createRadialGradient(118, 100, 10, 128, 128, 150);
  bg.addColorStop(0, light); bg.addColorStop(1, dark);
  x.fillStyle = bg; x.fillRect(0, 0, 256, 256);
  x.strokeStyle = line; x.lineWidth = 2.4; x.lineCap = 'round';
  for (let i = 0; i < 15; i++) {
    const start = 0.4 + ((i * 1.7) % 2.2);
    x.beginPath();
    x.ellipse(128, 134, 8 + i * 7.2, 11 + i * 7.9, 0.18, start, start + Math.PI * 1.72);
    x.stroke();
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

export function Glasses({ frame, frameColor, accent, lensTint, reduced, folded = false }: { frame: GlassesFrame; frameColor: string; accent: string; lensTint: string; reduced: boolean; folded?: boolean }) {
  const layout = useMemo(() => prototypeLayout(frame), [frame]);
  const { front, lenses } = useMemo(() => frontGeometry(frame), [frame]);
  const temple = useMemo(() => templeGeometry(), []);
  const print = useMemo(() => fingerprintTexture(), []);
  const acetate = useMemo(() => new MeshPhysicalMaterial({ roughness: 0.62, metalness: 0, clearcoat: 0.18, clearcoatRoughness: 0.55 }), []);
  const gold = useMemo(() => new MeshStandardMaterial({ color: HARDWARE, metalness: 1, roughness: 0.28 }), []);
  const glass = useMemo(() => new MeshPhysicalMaterial({ transparent: true, opacity: 0.16, roughness: 0.04, metalness: 0, clearcoat: 1, depthWrite: false }), []);
  const sensorMat = useMemo(() => new MeshPhysicalMaterial({ map: print, emissiveMap: print, emissive: '#ffffff', emissiveIntensity: 0, roughness: 0.12, metalness: 0.1, clearcoat: 1 }), [print]);
  const right = useRef<Group>(null), left = useRef<Group>(null);

  useEffect(() => { acetate.color.set(frameColor); }, [acetate, frameColor]);
  useEffect(() => { glass.color.set(lensTint); }, [glass, lensTint]);
  useEffect(() => { sensorMat.emissive.set(accent); }, [sensorMat, accent]);
  useEffect(() => () => { front.dispose(); lenses.forEach(l => l.dispose()); }, [front, lenses]);
  useEffect(() => () => { temple.dispose(); print.dispose(); acetate.dispose(); gold.dispose(); glass.dispose(); sensorMat.dispose(); }, [temple, print, acetate, gold, glass, sensorMat]);

  useFrame(({ clock }, delta) => {
    const k = reduced ? 1 : 1 - Math.exp(-delta * 3.5);
    if (right.current) right.current.rotation.y = MathUtils.lerp(right.current.rotation.y, folded ? FOLD.right : -SPLAY, k);
    if (left.current) left.current.rotation.y = MathUtils.lerp(left.current.rotation.y, folded ? FOLD.left : -SPLAY, k);
    sensorMat.emissiveIntensity = reduced ? 0.15 : 0.08 + (Math.sin(clock.elapsedTime * 2.4) + 1) * 0.12;
  });

  return <group position={[0, 0, CENTER_Z]}>
    <mesh geometry={front} material={acetate} />
    {lenses.map((l, i) => <mesh key={i} geometry={l} material={glass} />)}
    {[-1, 1].map(side => <mesh key={side} position={[side * (layout.X - 0.13), layout.hingeY, -DEPTH / 2 - 0.02 + wrapZ(layout.X - 0.13)]} material={gold}><boxGeometry args={[0.1, 0.05, 0.035]} /></mesh>)}
    {[1, -1].map(side => <group key={side} position={[side * layout.pivotX, layout.hingeY, layout.pivotZ]} scale={[side, 1, 1]}>
      <group ref={side === 1 ? right : left} rotation={[0, -SPLAY, 0]}>
        <mesh geometry={temple} material={acetate} />
        <mesh position={[0.072, -0.003, -0.34]} material={gold}><boxGeometry args={[0.008, 0.14, 0.028]} /></mesh>
        {side === 1 ? <group position={[0.072, SENSOR.v, -SENSOR.u]}>
          <mesh rotation={[0, Math.PI / 2, 0]} material={gold}><torusGeometry args={[SENSOR.radius + 0.006, 0.009, 14, 48]} /></mesh>
          <mesh rotation={[0, 0, -Math.PI / 2]} position={[0.002, 0, 0]} material={sensorMat}><cylinderGeometry args={[SENSOR.radius, SENSOR.radius, 0.008, 48]} /></mesh>
        </group>
          : <mesh position={[-0.024, 0.005, -2.0]} rotation={[Math.PI / 2 + 0.08, 0, 0]} material={gold}><capsuleGeometry args={[0.02, 0.2, 6, 16]} /></mesh>}
      </group>
    </group>)}
  </group>;
}

// Mapa de entorno procedural para que el acetato y el metal tengan reflejos sin cargar archivos externos.
export function StudioEnvironment({ intensity = 0.55 }: { intensity?: number }) {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = intensity;
    return () => { scene.environment = null; env.dispose(); pmrem.dispose(); };
  }, [gl, scene, intensity]);
  return null;
}
