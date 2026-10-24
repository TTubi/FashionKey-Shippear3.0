'use client';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/format';
import { ProductMedia } from '@/components/ProductArt';
import { QuantityStepper } from './QuantityStepper';

export function CartLines() {
  const { lines, setQty, remove } = useCart();
  return <ul className="cart-lines">
    {lines.map(l => <li key={`${l.slug}-${l.variant}`} className="cart-line">
      <Link href={`/productos/${l.slug}`} aria-label={`Ver ${l.product.name}`}><ProductMedia product={l.product} frameColor={l.variantInfo.color} /></Link>
      <div>
        <h3>{l.product.name}</h3>
        <div className="cart-line-meta" style={{ '--swatch': l.variantInfo.color } as CSSProperties}><i />{l.variantInfo.name} · {formatPrice(l.product.price, l.product.currency)}</div>
        <QuantityStepper small value={l.qty} label={l.product.name} onChange={q => setQty(l.slug, l.variant, q)} />
      </div>
      <div className="cart-line-side">
        <strong>{formatPrice(l.total, l.product.currency)}</strong>
        <button type="button" className="link-btn" onClick={() => remove(l.slug, l.variant)}>Quitar</button>
      </div>
    </li>)}
  </ul>;
}

export function CartTotals() {
  const { subtotal, currency } = useCart();
  return <>
    <div className="totals-row"><span>Subtotal</span><strong>{formatPrice(subtotal, currency)}</strong></div>
    <div className="totals-row"><span>Envío</span><strong>Sin costo (demo)</strong></div>
    <div className="totals-row total"><span>Total</span><strong>{formatPrice(subtotal, currency)}</strong></div>
  </>;
}
