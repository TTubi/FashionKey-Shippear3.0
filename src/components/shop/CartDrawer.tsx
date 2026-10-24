'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { site } from '@/config/site';
import { useCart } from '@/lib/cart';
import { CloseIcon } from '@/components/ui/Icons';
import { CartLines, CartTotals } from './CartLines';

export function CartDrawer() {
  const { open, setOpen, lines, count } = useCart();
  const panel = useRef<HTMLElement>(null);
  const reduced = !!useReducedMotion();
  const pathname = usePathname();

  useEffect(() => { setOpen(false); }, [pathname, setOpen]);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; previous?.focus?.(); };
  }, [open, setOpen]);

  return <AnimatePresence>
    {open && <>
      <motion.div key="backdrop" className="drawer-backdrop" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.25 }} />
      <motion.aside key="drawer" ref={panel} className="drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" tabIndex={-1}
        initial={{ x: reduced ? 0 : '100%' }} animate={{ x: 0 }} exit={{ x: reduced ? 0 : '100%' }} transition={{ type: 'tween', duration: reduced ? 0 : 0.38, ease: [0.2, 0.8, 0.2, 1] }}>
        <div className="drawer-head">
          <h2 id="cart-title">Carrito demo {count > 0 && <span className="price-note">· {count} {count === 1 ? 'producto' : 'productos'}</span>}</h2>
          <button type="button" className="icon-btn" aria-label="Cerrar carrito" onClick={() => setOpen(false)}><CloseIcon size={18} /></button>
        </div>
        <div className="drawer-body">
          {lines.length ? <CartLines /> : <div className="empty-state"><h2>Tu carrito está vacío</h2><p>Agregá un modelo conceptual para probar la compra.</p><Link className="btn btn-ghost" href="/#productos" onClick={() => setOpen(false)}>Ver productos</Link></div>}
        </div>
        {lines.length > 0 && <div className="drawer-foot">
          <CartTotals />
          <p className="fine-print">{site.disclaimers.demo}</p>
          <div className="drawer-actions"><Link className="btn btn-ghost" href="/carrito">Ver carrito</Link><Link className="btn btn-primary" href="/checkout">Ir al checkout</Link></div>
        </div>}
      </motion.aside>
    </>}
  </AnimatePresence>;
}
