'use client';
import Link from 'next/link';
import { site } from '@/config/site';
import { useCart } from '@/lib/cart';
import { CartLines, CartTotals } from './CartLines';

export function CartPage() {
  const { lines, ready, clear } = useCart();
  return <div className="container cart-page">
    <span className="eyebrow">Carrito de demostración</span>
    <h1>Tu carrito</h1>
    {!ready ? <div className="scene-loading">CARGANDO CARRITO</div>
      : lines.length === 0 ? <div className="empty-state"><h2>Tu carrito está vacío</h2><p>Agregá un modelo conceptual para probar el proceso de compra.</p><Link className="btn btn-primary" href="/#productos">Ver productos</Link></div>
      : <div className="cart-layout">
        <div><CartLines /><button type="button" className="link-btn cart-clear" onClick={clear}>Vaciar carrito</button></div>
        <aside className="summary-card" aria-label="Resumen">
          <h2>Resumen</h2>
          <CartTotals />
          <p className="fine-print">Precios referenciales simulados. {site.disclaimers.demo}</p>
          <Link className="btn btn-primary btn-block" href="/checkout">Continuar al checkout</Link>
          <Link className="btn btn-ghost btn-block" href="/#productos">Seguir explorando</Link>
        </aside>
      </div>}
  </div>;
}
