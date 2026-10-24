'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState, type CSSProperties } from 'react';
import { useReducedMotion } from 'motion/react';
import { comparison, faq, products, type Product } from '@/config/products';
import { site } from '@/config/site';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/format';
import { ProductArt, ProductMedia } from '@/components/ProductArt';
import { QuantityStepper } from '@/components/shop/QuantityStepper';
import { featureIcons } from '@/components/ui/Icons';
import type { ViewerView } from '@/components/three/GlassesViewer';

const GlassesViewer = dynamic(() => import('@/components/three/GlassesViewer').then(m => m.GlassesViewer), { ssr: false, loading: () => <div className="scene-loading">CARGANDO MODELO 3D</div> });
const VIEWS: { label: string; name: ViewerView }[] = [{ label: 'Frente', name: 'front' }, { label: '3/4', name: 'threeQuarter' }, { label: 'Lateral', name: 'side' }, { label: 'Chip de huella', name: 'chip' }];

export function ProductDetail({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [qty, setQty] = useState(1);
  const [view, setView] = useState<{ name: ViewerView }>({ name: 'front' });
  const [folded, setFolded] = useState(false);
  const [light, setLight] = useState(false);
  const showView = (name: ViewerView) => { setView({ name }); if (name === 'chip') setFolded(false); };
  const [shot, setShot] = useState(0);
  const reduced = !!useReducedMotion();
  const { add } = useCart();
  const variant = product.variants.find(v => v.id === variantId) ?? product.variants[0];
  // Galería adaptable: usa las fotos configuradas o, si no hay, una representación conceptual por cada variante.
  const shots = product.images.length ? product.images.map((img, i) => ({ key: img.src, label: img.alt, index: i, color: undefined as string | undefined })) : product.variants.map((v, i) => ({ key: v.id, label: `Imagen conceptual · ${v.name}`, index: i, color: v.color }));
  const current = shots[Math.min(shot, shots.length - 1)];

  return <div className="container product-page" style={{ '--accent': product.color, '--accent-light': product.light } as CSSProperties}>
    <nav className="breadcrumb" aria-label="Ruta"><Link href="/">Inicio</Link><span>/</span><Link href="/#productos">Productos</Link><span>/</span><span aria-current="page">{product.name}</span></nav>

    <div className="product-hero">
      <div className={`viewer ${light ? 'is-light' : ''}`}>
        <span className="badge viewer-label">Prototipo 3D conceptual</span>
        <button type="button" className="viewer-bg" aria-pressed={light} onClick={() => setLight(l => !l)}>{light ? 'Fondo oscuro' : 'Fondo blanco'}</button>
        <GlassesViewer product={product} frameColor={variant.color} view={view} folded={folded} reduced={reduced} />
        {(view.name === 'chip' || folded) && <aside className="chip-note" aria-live="polite">
          <strong>{site.chip.title}</strong>
          <p>{folded ? site.chip.folded : site.chip.text}</p>
        </aside>}
        <div className="viewer-angles" role="group" aria-label="Encuadre del modelo">
          {VIEWS.map(v => <button type="button" key={v.name} aria-pressed={view.name === v.name} onClick={() => showView(v.name)}>{v.label}</button>)}
          <button type="button" className="viewer-fold" aria-pressed={folded} onClick={() => { setFolded(f => !f); if (view.name === 'chip') setView({ name: 'threeQuarter' }); }}>{folded ? 'Desplegar' : 'Plegar lentes'}</button>
        </div>
        <span className="viewer-hint">ARRASTRÁ PARA GIRAR · RUEDA O PELLIZCO PARA ZOOM</span>
      </div>

      <div className="product-info">
        <span className="badge">{site.statusLabels[product.status]}</span>
        <h1>{product.name}</h1>
        <p className="tagline">{product.tagline}</p>
        <p className="desc">{product.description}</p>
        <div className="price-block"><strong>{formatPrice(product.price, product.currency)}</strong>{product.priceIsSimulated && <span className="price-note">{site.disclaimers.price}</span>}</div>
        <div>
          <span className="option-label">Terminación · {variant.name}</span>
          <div className="swatches" role="group" aria-label="Elegir terminación">
            {product.variants.map(v => <button type="button" key={v.id} aria-pressed={v.id === variantId} style={{ '--swatch': v.color } as CSSProperties} onClick={() => setVariantId(v.id)}><i />{v.name}</button>)}
          </div>
        </div>
        <div className="buy-row">
          <QuantityStepper value={qty} label={product.name} onChange={setQty} />
          <button type="button" className="btn btn-primary" onClick={() => add(product.slug, variant.id, qty)}>Agregar al carrito demo</button>
        </div>
        <p className="fine-print">{site.disclaimers.demo}</p>
      </div>
    </div>

    <section className="product-section" aria-labelledby="gallery-title">
      <span className="eyebrow">Galería</span><h2 id="gallery-title">Imágenes del modelo</h2>
      <div className="gallery">
        <div className="gallery-main"><ProductMedia product={product} index={current.index} frameColor={current.color} caption={current.label} /></div>
        <div className="gallery-thumbs" role="group" aria-label="Elegir imagen">
          {shots.map((s, i) => <button type="button" key={s.key} aria-label={s.label} aria-pressed={i === shot} onClick={() => setShot(i)}><ProductMedia product={product} index={s.index} frameColor={s.color} /></button>)}
        </div>
      </div>
    </section>

    <section className="product-section" aria-labelledby="features-title">
      <span className="eyebrow">Características</span><h2 id="features-title">Lo que propone {product.name}</h2>
      <ul className="feature-list feature-list-lg">{product.features.map(f => <li key={f}>{f}</li>)}</ul>
    </section>

    <section className="product-section" aria-labelledby="tech-title">
      <span className="eyebrow">Tecnología conceptual</span><h2 id="tech-title">Cómo funcionaría</h2>
      <div className="info-grid">{site.technologyBrief.map(t => { const Icon = featureIcons[t.icon as keyof typeof featureIcons]; return <article key={t.title} className="info-card"><Icon size={26} /><h3>{t.title}</h3><p>{t.text}</p></article>; })}</div>
    </section>

    <section className="product-section" aria-labelledby="compare-title">
      <span className="eyebrow">Comparación</span><h2 id="compare-title">Elegí tu modelo</h2>
      <div className="compare-wrap"><table className="compare">
        <thead><tr><th scope="col"><span className="visually-hidden">Característica</span></th>{products.map(p => <th scope="col" key={p.slug} className={p.slug === product.slug ? 'is-current' : ''}><Link href={`/productos/${p.slug}`}>{p.name}</Link></th>)}</tr></thead>
        <tbody>
          {comparison.map(row => <tr key={row.label}><th scope="row">{row.label}</th>{products.map(p => <td key={p.slug} className={p.slug === product.slug ? 'is-current' : ''}>{row.values[p.slug] ?? '—'}</td>)}</tr>)}
          <tr><th scope="row">Precio referencial</th>{products.map(p => <td key={p.slug} className={p.slug === product.slug ? 'is-current' : ''}>{formatPrice(p.price, p.currency)}</td>)}</tr>
          <tr><th scope="row">Estado</th>{products.map(p => <td key={p.slug} className={p.slug === product.slug ? 'is-current' : ''}>{site.statusLabels[p.status]}</td>)}</tr>
        </tbody>
      </table></div>
    </section>

    <section className="product-section" aria-labelledby="faq-title">
      <span className="eyebrow">Preguntas frecuentes</span><h2 id="faq-title">Antes de seguir</h2>
      <div className="faq">{faq.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>
    </section>

    <section className="product-section" aria-labelledby="others-title">
      <span className="eyebrow">Otros modelos</span><h2 id="others-title">Seguí explorando</h2>
      <div className="other-models">{products.filter(p => p.slug !== product.slug).map(p => <Link key={p.slug} href={`/productos/${p.slug}`}><ProductArt product={p} /><div><strong>{p.name}</strong><span>{p.tagline}</span></div></Link>)}</div>
    </section>
  </div>;
}
