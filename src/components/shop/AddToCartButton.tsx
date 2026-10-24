'use client';
import type { ReactNode } from 'react';
import { useCart } from '@/lib/cart';

export function AddToCartButton({ slug, variant, qty = 1, className = 'btn btn-ghost', label, children }: { slug: string; variant: string; qty?: number; className?: string; label?: string; children?: ReactNode }) {
  const { add } = useCart();
  return <button type="button" className={className} aria-label={label} onClick={() => add(slug, variant, qty)}>{children ?? 'Agregar al carrito'}</button>;
}
