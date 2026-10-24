'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Group, MathUtils } from 'three';
import { products } from '@/config/products';
import { SceneBoundary } from './SceneBoundary';
import { Glasses, StudioEnvironment } from './Glasses';

function CarouselItem({ index, selected, detail, onSelect, reduced }: { index: number; selected: number; detail: boolean; onSelect: (i: number) => void; reduced: boolean }) {
  const ref = useRef<Group>(null);
  const product = products[index];
  // Cada modelo se ubica según su distancia circular al seleccionado y se interpola hacia esa pose.
  useFrame(({ clock, pointer }, delta) => {
    const g = ref.current;
    if (!g) return;
    const n = products.length;
    let offset = (index - selected + n) % n;
    if (offset > n / 2) offset -= n;
    const active = offset === 0;
    const t = clock.elapsedTime;
    const k = reduced ? 1 : 1 - Math.exp(-delta * 6);
    g.position.x = MathUtils.lerp(g.position.x, active && detail ? 0 : offset * 3.3, k);
    g.position.z = MathUtils.lerp(g.position.z, active ? (detail ? 1 : 0.4) : -2.8, k);
    g.position.y = reduced ? 0 : Math.sin(t * 1.1 + index) * 0.06;
    g.rotation.y = MathUtils.lerp(g.rotation.y, active ? (detail ? (reduced ? -0.6 : -pointer.x * 1.5 - 0.3) : (reduced ? 0 : Math.sin(t * 0.4) * 0.25)) : -offset * 0.75, k);
    g.rotation.x = MathUtils.lerp(g.rotation.x, active ? (detail && !reduced ? -pointer.y * 0.35 : 0.08) : 0.14, k);
    g.rotation.z = MathUtils.lerp(g.rotation.z, active ? 0 : offset * 0.06, k);
    g.scale.setScalar(MathUtils.lerp(g.scale.x, active ? (detail ? 1.15 : 1) : 0.5, k));
    g.visible = !detail || active;
  });
  return <group ref={ref} onClick={e => { e.stopPropagation(); onSelect(index); }}>
    <Glasses frame={product.frame} frameColor={product.variants[0].color} accent={product.color} lensTint={product.light} reduced={reduced} />
  </group>;
}

export function GlassesScene({ selected, detail, onSelect, reduced }: { selected: number; detail: boolean; onSelect: (i: number) => void; reduced: boolean }) {
  const product = products[selected];
  return <SceneBoundary><Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.5, 8], fov: 30 }}>
    <StudioEnvironment />
    <ambientLight intensity={0.6} />
    <directionalLight position={[3, 5, 6]} intensity={2.5} />
    <pointLight position={[-4, 1, 4]} intensity={40} color={product.light} />
    <pointLight position={[4, -1, -3]} intensity={70} color={product.color} />
    {products.map((p, i) => <CarouselItem key={p.slug} index={i} selected={selected} detail={detail} onSelect={onSelect} reduced={reduced} />)}
  </Canvas></SceneBoundary>;
}
