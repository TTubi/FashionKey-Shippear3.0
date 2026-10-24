'use client';
import Link from 'next/link';
import { site } from '@/config/site';
import { useCart } from '@/lib/cart';
import { CartIcon } from './ui/Icons';
import { BrandMark } from './ui/BrandMark';

// Encabezado fijo de FashionKey: marca con slogan, navegación a las secciones, llamada a la acción y carrito demo.
export function SiteNav() {
  const { count, ready, setOpen } = useCart();
  return <header className="site-nav">
    <Link href="/" className="logo" aria-label={`${site.brand.name}: ${site.brand.slogan}. Ir al inicio`}><BrandMark slogan /></Link>
    <nav className="nav-links" aria-label="Principal">{site.nav.map(l => <Link key={l.href} href={l.href}>{l.label}</Link>)}</nav>
    <div className="nav-actions">
      <Link className="btn btn-primary nav-cta" href={site.navCta.href}>{site.navCta.label}</Link>
      <button type="button" className="cart-button" onClick={() => setOpen(true)} aria-label={`Abrir carrito demo, ${count} productos`}>
        <CartIcon size={18} /><span>Carrito</span>{ready && count > 0 && <span className="cart-count">{count}</span>}
      </button>
    </div>
  </header>;
}

// Pie de página: marca, slogan, navegación secundaria y aclaraciones del proyecto.
export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-brand">
      <span className="logo"><BrandMark /></span>
      <p className="footer-slogan">“{site.brand.slogan}”</p>
      <p>{site.brand.event}.</p>
    </div>
    <nav className="footer-nav" aria-label="Secundaria">
      {site.nav.map(l => <Link key={l.href} href={l.href}>{l.label}</Link>)}
      <Link href="/carrito">Carrito demo</Link>
    </nav>
    <div className="footer-notes">
      <p>{site.disclaimers.concept}</p>
      <p>{site.footer}</p>
    </div>
  </footer>;
}

export function DemoBanner() {
  return <div className="demo-banner" role="note">{site.disclaimers.demo}</div>;
}
