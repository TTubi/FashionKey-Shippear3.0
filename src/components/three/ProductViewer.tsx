'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import type { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { Product } from '@/config/products';
import { SceneBoundary } from './SceneBoundary';
import { StudioEnvironment } from './Glasses';
import { ProductModel, viewGoal, type ViewerView } from './ProductModel';

export type { ViewerView };

// Órbita libre (arrastrar), zoom (rueda o pellizco) y vuelos de cámara hacia los encuadres predefinidos de cada producto.
function CameraRig({ view, product, reduced }: { view: { name: ViewerView }; product: Product; reduced: boolean }) {
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
  useEffect(() => { goal.current = viewGoal(product, view.name); }, [view, product]);
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

// Visor del detalle de producto. `alt` es la acción propia de cada modelo: plegar los anteojos o separar la traba de los aros.
export function ProductViewer({ product, color, view, alt, reduced }: { product: Product; color: string; view: { name: ViewerView }; alt: boolean; reduced: boolean }) {
  const start = useMemo(() => viewGoal(product, 'front').pos.toArray(), [product]);
  const jewelry = product.kind !== 'glasses';
  return <div className="viewer-canvas" role="img" aria-label={`Modelo 3D del prototipo ${product.name}. Arrastrá para girarlo y usá la rueda o el pellizco para acercarte.`}>
    <SceneBoundary><Canvas dpr={[1, 2]} camera={{ position: start, fov: 32, near: 0.05, far: 60 }}>
      <StudioEnvironment intensity={jewelry ? 1 : 0.45} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 6]} intensity={2.2} />
      <directionalLight position={[-4, 2, -5]} intensity={1.6} />
      <directionalLight position={[0, -3, 4]} intensity={0.6} />
      <ProductModel product={product} color={color} reduced={reduced} alt={alt} />
      <CameraRig view={view} product={product} reduced={reduced} />
    </Canvas></SceneBoundary>
  </div>;
}
