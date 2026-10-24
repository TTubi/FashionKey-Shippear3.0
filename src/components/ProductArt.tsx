import type { CSSProperties } from 'react';
import type { Product } from '@/config/products';

// Representación conceptual liviana (SVG) generada desde la forma del producto. Se usa mientras no haya fotos reales.
export function ProductArt({ product, frameColor, caption, className = '' }: { product: Product; frameColor?: string; caption?: string; className?: string }) {
  const { width, height, radius } = product.frame;
  const w = width * 110, h = height * 110, r = Math.min(radius * 110, w / 2, h / 2), t = 9, gap = 30;
  const cx = w / 2 + t + gap / 2, outer = cx + w / 2 + t;
  const color = frameColor ?? product.variants[0].color;
  return <div className={`product-art ${className}`} style={{ '--accent': product.color, '--accent-light': product.light } as CSSProperties}>
    <svg viewBox="-200 -100 400 200" role="img" aria-label={`Representación conceptual de ${product.name}`}>
      {[-1, 1].map(s => <g key={s}>
        <rect x={s * cx - w / 2} y={-h / 2} width={w} height={h} rx={r} fill="none" stroke={product.color} strokeOpacity={0.25} strokeWidth={t + 6} />
        <rect x={s * cx - w / 2} y={-h / 2} width={w} height={h} rx={r} fill={product.light} fillOpacity={0.14} stroke={color} strokeWidth={t} />
      </g>)}
      <path d={`M${-gap / 2 - 5} ${-h * 0.2} Q0 ${-h * 0.38} ${gap / 2 + 5} ${-h * 0.2}`} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" />
      <path d={`M${-outer} ${-h * 0.22} l-14 -6 M${outer} ${-h * 0.22} l14 -6`} stroke={color} strokeWidth={6} strokeLinecap="round" />
      <circle cx={outer - 2} cy={-h * 0.22} r={4.5} className="product-art-chip" />
    </svg>
    {caption && <span className="product-art-caption">{caption}</span>}
  </div>;
}

// Muestra la foto configurada en products.ts o, si no hay, la representación conceptual.
export function ProductMedia({ product, index = 0, frameColor, caption }: { product: Product; index?: number; frameColor?: string; caption?: string }) {
  const image = product.images[index];
  if (image) return <div className="product-art"><img src={image.src} alt={image.alt} loading="lazy" /></div>;
  return <ProductArt product={product} frameColor={frameColor} caption={caption} />;
}
