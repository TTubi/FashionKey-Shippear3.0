'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { Product } from '@/config/products';
import { SceneBoundary } from './SceneBoundary';
import { Glasses, prototypeLayout, StudioEnvironment } from './Glasses';

export type ViewerView = 'front' | 'threeQuarter' | 'side' | 'chip';

function viewGoal(view: ViewerView, frame: Product['frame']) {
  const { sensor, sensorNormal } = prototypeLayout(frame);
  switch (view) {
    case 'front': return { pos: new Vector3(0, 0.2, 6.3), target: new Vector3(0, -0.05, 0) };
    case 'threeQuarter': return { pos: new Vector3(4.5, 1.4, 4.8), target: new Vector3(0, -0.15, -0.2) };
    case 'side': return { pos: new Vector3(6.2, 0.45, -0.1), target: new Vector3(0, -0.15, -0.1) };
    case 'chip': return { pos: sensor.clone().addScaledVector(sensorNormal, 0.62).add(new Vector3(0, 0.12, 0.28)), target: sensor.clone() };
  }
}

// Órbita libre (arrastrar), zoom (rueda o pellizco) y vuelos de cámara hacia los encuadres predefinidos.
function CameraRig({ view, frame, reduced }: { view: { name: ViewerView }; frame: Product['frame']; reduced: boolean }) {
  const { camera, gl } = useThree();
  const controls = useRef<OrbitControls | null>(null);
  const goal = useRef<{ pos: Vector3; target: Vector3 } | null>(null);
  useEffect(() => {
    const c = new OrbitControls(camera, gl.domElement);
    c.enableDamping = true;
    c.dampingFactor = 0.08;
    c.enablePan = false;
    c.minDistance = 0.3;
    c.maxDistance = 9;
    c.zoomSpeed = 0.8;
    const cancel = () => { goal.current = null; };
    c.addEventListener('start', cancel);
    controls.current = c;
    return () => { c.removeEventListener('start', cancel); c.dispose(); controls.current = null; };
  }, [camera, gl]);
  useEffect(() => { goal.current = viewGoal(view.name, frame); }, [view, frame]);
  useFrame((_, delta) => {
    const c = controls.current;
    if (!c) return;
    const g = goal.current;
    if (g) {
      const k = reduced ? 1 : 1 - Math.exp(-delta * 3.2);
      camera.position.lerp(g.pos, k);
      c.target.lerp(g.target, k);
      if (camera.position.distanceTo(g.pos) < 0.002 && c.target.distanceTo(g.target) < 0.002) goal.current = null;
    }
    c.update();
  });
  return null;
}

export function GlassesViewer({ product, frameColor, view, folded, reduced }: { product: Product; frameColor: string; view: { name: ViewerView }; folded: boolean; reduced: boolean }) {
  const start = useMemo(() => viewGoal('front', product.frame).pos.toArray(), [product.frame]);
  return <div className="viewer-canvas" role="img" aria-label={`Modelo 3D del prototipo ${product.name}. Arrastrá para girarlo y usá la rueda o el pellizco para acercarte.`}>
    <SceneBoundary><Canvas dpr={[1, 2]} camera={{ position: start, fov: 32, near: 0.05, far: 60 }}>
      <StudioEnvironment intensity={0.45} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 6]} intensity={2.2} />
      <directionalLight position={[-4, 2, -5]} intensity={1.6} />
      <directionalLight position={[0, -3, 4]} intensity={0.6} />
      <Glasses frame={product.frame} frameColor={frameColor} accent={product.color} lensTint={product.light} reduced={reduced} folded={folded} />
      <CameraRig view={view} frame={product.frame} reduced={reduced} />
    </Canvas></SceneBoundary>
  </div>;
}
