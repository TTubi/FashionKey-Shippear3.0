'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { products } from '@/config/products';
import { site } from '@/config/site';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/format';
import './showcase.css';

const GlassesScene = dynamic(() => import('@/components/three/GlassesScene').then(m => m.GlassesScene), { ssr: false, loading: () => <div className="scene-loading">CARGANDO EXPERIENCIA 3D</div> });

// Hero con el carrusel 3D de modelos (heredado de la demo de latas): flechas, arrastre, teclado y clic para el modo detalle.
export function ProductShowcase() {
  const [selected, setSelected] = useState(0);
  const [detail, setDetail] = useState(false);
  const reduced = !!useReducedMotion();
  const pointer = useRef<number | null>(null);
  const { add } = useCart();
  const product = products[selected];
  const short = product.name.replace(`${site.brand.name} `, '').toUpperCase();
  const change = (direction: number) => setSelected(i => (i + direction + products.length) % products.length);

  return <section className={`sp-stage ${detail ? 'is-detail' : ''}`} style={{ '--accent': product.color, '--accent-light': product.light } as CSSProperties} aria-label="Presentación de modelos conceptuales"
    onKeyDown={e => {
      if ((e.target as HTMLElement).closest('a,button')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); change(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); change(-1); }
      if (e.key === 'Escape') setDetail(false);
    }} tabIndex={0}>
    <div className="sp-grid" aria-hidden="true" />
    <div className="sp-glow" aria-hidden="true" />
    <div className="sp-background-word" aria-hidden="true">{detail ? short : site.hero.backgroundWord}</div>
    <div className="sp-heading">
      <span className="eyebrow">{site.hero.eyebrow}</span>
      <h1>{site.hero.title.map((line, i) => <motion.span key={line} initial={{ opacity: 0, y: reduced ? 0 : 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : 0.1 + i * 0.12, ease: [0.2, 0.8, 0.2, 1] }}>{line}</motion.span>)}</h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : 0.5 }}>{site.hero.subtitle}</motion.p>
      <div className="sp-ctas">
        <a className="btn btn-primary" href={site.hero.primaryCta.href}>{site.hero.primaryCta.label}</a>
        <a className="btn btn-ghost" href={site.hero.secondaryCta.href}>{site.hero.secondaryCta.label}</a>
      </div>
    </div>
    <div className="glasses-canvas"
      onPointerDown={e => { pointer.current = e.clientX; }}
      onPointerUp={e => { if (pointer.current !== null && Math.abs(e.clientX - pointer.current) > 55) change(e.clientX < pointer.current ? 1 : -1); pointer.current = null; }}>
      <GlassesScene selected={selected} detail={detail} reduced={reduced} onSelect={i => { if (i === selected) setDetail(v => !v); else { setSelected(i); setDetail(false); } }} />
    </div>
    <AnimatePresence mode="wait">
      <motion.div key={selected} className="model-copy" initial={{ opacity: 0, y: reduced ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.25 }}>
        <span>0{selected + 1} / 0{products.length} · {site.statusLabels[product.status]}</span>
        <h2>{product.name}</h2>
        <p>{product.tagline}</p>
        <div className="model-price">{formatPrice(product.price, product.currency)}{product.priceIsSimulated && <small className="price-note">{site.disclaimers.price}</small>}</div>
        <div className="model-actions">
          <Link className="btn btn-primary" href={`/productos/${product.slug}`}>Ver producto</Link>
          <button type="button" className="btn btn-ghost" onClick={() => add(product.slug, product.variants[0].id)}>Agregar al carrito</button>
        </div>
      </motion.div>
    </AnimatePresence>
    <div className="model-navigation">
      <button type="button" aria-label="Modelo anterior" onClick={() => change(-1)}>←</button>
      <span aria-live="polite">{product.name.toUpperCase()}</span>
      <button type="button" aria-label="Modelo siguiente" onClick={() => change(1)}>→</button>
    </div>
    <div className="model-picker" role="group" aria-label="Elegir modelo">
      {products.map((p, i) => <button type="button" key={p.slug} aria-pressed={selected === i} className={selected === i ? 'selected' : ''} style={{ '--swatch': p.color } as CSSProperties} onClick={() => setSelected(i)}><i />{p.name}</button>)}
    </div>
    <span className="sp-hint">{site.hero.hint}</span>
    <a className="scroll-indicator" href={site.hero.secondaryCta.href} aria-label="Bajar a productos"><span />SCROLL</a>
    <span className="sp-concept-note">{site.disclaimers.concept}</span>
  </section>;
}
