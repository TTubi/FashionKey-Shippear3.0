'use client';
import { Vector3 } from 'three';
import type { Product } from '@/config/products';
import { Glasses, prototypeLayout } from './Glasses';
import { Earring, Pendant, earringLayout, pendantLayout } from './Jewelry';

// Dibuja el modelo 3D que corresponde a cada producto (anteojos, aros o colgante) y define sus encuadres de cámara.
export type ViewerView = 'front' | 'threeQuarter' | 'side' | 'chip';
type Goal = { pos: Vector3; target: Vector3 };

// Escala relativa en el carrusel del hero, para que todos los modelos se vean de un tamaño parecido.
export const carouselScale: Record<Product['kind'], number> = { glasses: 1, earring: 1.5, pendant: 0.95 };

export function ProductModel({ product, color, reduced, alt = false }: { product: Product; color: string; reduced: boolean; alt?: boolean }) {
  switch (product.kind) {
    case 'glasses': return <Glasses frame={product.frame} frameColor={color} accent={product.color} lensTint={product.light} reduced={reduced} folded={alt} />;
    case 'earring': return <Earring metal={color} accent={product.color} reduced={reduced} separated={alt} />;
    case 'pendant': return <Pendant metal={color} accent={product.color} reduced={reduced} />;
  }
}

const v = (x: number, y: number, z: number) => new Vector3(x, y, z);

export function viewGoal(product: Product, view: ViewerView): Goal {
  if (product.kind === 'glasses') {
    const { sensor, sensorNormal } = prototypeLayout(product.frame);
    switch (view) {
      case 'front': return { pos: v(0, 0.2, 6.3), target: v(0, -0.05, 0) };
      case 'threeQuarter': return { pos: v(4.5, 1.4, 4.8), target: v(0, -0.15, -0.2) };
      case 'side': return { pos: v(6.2, 0.45, -0.1), target: v(0, -0.15, -0.1) };
      case 'chip': return { pos: sensor.clone().addScaledVector(sensorNormal, 0.62).add(v(0, 0.12, 0.28)), target: sensor.clone() };
    }
  }
  if (product.kind === 'earring') {
    const { sensor, sensorNormal } = earringLayout();
    switch (view) {
      case 'front': return { pos: v(0, 0.15, 4.4), target: v(0, 0, 0.2) };
      case 'threeQuarter': return { pos: v(3, 1, 3.1), target: v(0, 0, 0) };
      case 'side': return { pos: v(4.6, 0.3, -0.1), target: v(0, 0, -0.1) };
      case 'chip': return { pos: sensor.clone().addScaledVector(sensorNormal, 1.9).add(v(0.35, 0.25, 0)), target: sensor.clone() };
    }
  }
  const { sensor, sensorNormal } = pendantLayout();
  switch (view) {
    case 'front': return { pos: v(0, 0.9, 8.6), target: v(0, 0.45, 0) };
    case 'threeQuarter': return { pos: v(4.8, 2, 6), target: v(0, 0.3, 0) };
    case 'side': return { pos: v(7.6, 0.8, 0), target: v(0, 0.3, 0) };
    case 'chip': return { pos: sensor.clone().addScaledVector(sensorNormal, 3.3).add(v(0.3, 0.35, 0)), target: sensor.clone() };
  }
}
