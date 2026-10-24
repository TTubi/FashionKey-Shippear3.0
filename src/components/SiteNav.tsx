'use client';
import Link from 'next/link';
import { site } from '@/config/site';
import { useCart } from '@/lib/cart';
import { CartIcon } from './ui/Icons';

export function SiteNav() {
  const { count, ready, setOpen } = useCart();
  return <header className="site-nav">
    <Link href="/" className="logo" aria-label={`${site.brand.name} — inicio`}>{site.brand.name.toUpperCase()}<small>{site.brand.slogan}</small></Link>
    <nav className="nav-links" aria-label="Principal">{site.nav.map(l => <Link key={l.href} href={l.href}>{l.label}</Link>)}</nav>
    <div className="nav-actions">
      <span className="demo-pill">MODO DEMO</span>
      <button type="button" className="cart-button" onClick={() => setOpen(true)} aria-label={`Abrir carrito, ${count} productos`}>
        <CartIcon size={18} /><span>Carrito</span>{ready && count > 0 && <span className="cart-count">{count}</span>}
      </button>
    </div>
  </header>;
}

export function SiteFooter() {
  return <footer className="site-footer">
    <div><span className="logo">{site.brand.name.toUpperCase()}<small>{site.brand.slogan}</small></span></div>
    <p>{site.footer}</p>
    <p>{site.disclaimers.concept}</p>
  </footer>;
}

export function DemoBanner() {
  return <div className="demo-banner" role="note">{site.disclaimers.demo}</div>;
}
