'use client';
import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { getProduct, type Product, type Variant } from '@/config/products';

// Carrito de demostración: vive en memoria y en localStorage del navegador. No se envía a ningún servidor.
export type CartItem = { slug: string; variant: string; qty: number };
export type CartLine = CartItem & { product: Product; variantInfo: Variant; total: number };
export const MAX_QTY = 10;
const STORAGE_KEY = 'fashionkey-demo-cart';

type Action =
  | { type: 'load'; items: CartItem[] }
  | { type: 'add'; item: CartItem }
  | { type: 'setQty'; slug: string; variant: string; qty: number }
  | { type: 'remove'; slug: string; variant: string }
  | { type: 'clear' };

const same = (a: { slug: string; variant: string }, b: { slug: string; variant: string }) => a.slug === b.slug && a.variant === b.variant;
const clampQty = (n: number) => Math.max(1, Math.min(MAX_QTY, Math.round(n)));

function reducer(items: CartItem[], a: Action): CartItem[] {
  switch (a.type) {
    case 'load': return a.items;
    case 'add': {
      if (!items.some(x => same(x, a.item))) return [...items, { ...a.item, qty: clampQty(a.item.qty) }];
      return items.map(x => same(x, a.item) ? { ...x, qty: clampQty(x.qty + a.item.qty) } : x);
    }
    case 'setQty': return items.map(x => same(x, a) ? { ...x, qty: clampQty(a.qty) } : x);
    case 'remove': return items.filter(x => !same(x, a));
    case 'clear': return [];
  }
}

const isItem = (x: unknown): x is CartItem => {
  const i = x as CartItem;
  return !!i && typeof i.slug === 'string' && typeof i.variant === 'string' && typeof i.qty === 'number' && !!getProduct(i.slug);
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  currency: string;
  ready: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (slug: string, variant: string, qty?: number) => void;
  setQty: (slug: string, variant: string, qty: number) => void;
  remove: (slug: string, variant: string) => void;
  clear: () => void;
};
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      if (Array.isArray(parsed)) dispatch({ type: 'load', items: parsed.filter(isItem) });
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => {
    const lines = items.flatMap(i => {
      const product = getProduct(i.slug);
      if (!product) return [];
      const variantInfo = product.variants.find(v => v.id === i.variant) ?? product.variants[0];
      return [{ ...i, product, variantInfo, total: (product.price ?? 0) * i.qty }];
    });
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.total, 0),
      currency: lines[0]?.product.currency ?? 'USD',
      ready,
      open,
      setOpen,
      add: (slug, variant, qty = 1) => { dispatch({ type: 'add', item: { slug, variant, qty } }); setOpen(true); },
      setQty: (slug, variant, qty) => dispatch({ type: 'setQty', slug, variant, qty }),
      remove: (slug, variant) => dispatch({ type: 'remove', slug, variant }),
      clear: () => dispatch({ type: 'clear' })
    };
  }, [items, ready, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
}
