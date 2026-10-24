import Link from 'next/link';
import type { CSSProperties } from 'react';
import { products } from '@/config/products';
import { site } from '@/config/site';
import { formatPrice } from '@/lib/format';
import { ProductMedia } from '@/components/ProductArt';
import { AddToCartButton } from '@/components/shop/AddToCartButton';
import { PlusIcon } from '@/components/ui/Icons';

// Catálogo de modelos FashionKey con acceso al detalle y a la tienda de demostración.
export function Catalog() {
  return <section id="productos" className="home-section" aria-label="Productos">
    <div className="container">
      <div className="section-head">
        <div><span className="eyebrow">{site.catalog.eyebrow}</span><h2>{site.catalog.title}</h2></div>
        <p>{site.catalog.text}</p>
      </div>
      <div className="catalog-grid">
        {products.map(p => <article key={p.slug} className="product-card" style={{ '--accent': p.color, '--accent-light': p.light } as CSSProperties}>
          <Link href={`/productos/${p.slug}`} aria-label={`Ver ${p.name}`}><ProductMedia product={p} caption="Imagen conceptual" /></Link>
          <div className="product-card-body">
            <span className="badge">{site.statusLabels[p.status]}</span>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <ul className="feature-list">{p.features.map(f => <li key={f}>{f}</li>)}</ul>
            <div className="card-foot">
              <div className="card-price">{formatPrice(p.price, p.currency)}{p.priceIsSimulated && <span className="price-note">{site.disclaimers.price}</span>}</div>
              <div className="card-actions">
                <AddToCartButton slug={p.slug} variant={p.variants[0].id} className="icon-btn" label={`Agregar ${p.name} al carrito`}><PlusIcon size={18} /></AddToCartButton>
                <Link className="btn btn-primary" href={`/productos/${p.slug}`}>Ver producto</Link>
              </div>
            </div>
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
