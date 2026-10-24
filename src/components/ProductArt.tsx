import type { CSSProperties } from 'react';
import type { Product } from '@/config/products';

// Representación conceptual liviana (SVG) de cada tipo de producto. Se usa mientras no haya fotos reales.
// Las coordenadas se redondean para que el HTML del servidor y el del navegador coincidan exactamente.
const round = (n: number) => Math.round(n * 100) / 100;
const dots = (count: number, r: number, cx = 0, cy = 0) => Array.from({ length: count }, (_, i) => {
  const a = (i / count) * Math.PI * 2;
  return { x: round(cx + Math.cos(a) * r), y: round(cy + Math.sin(a) * r) };
});
// Arcos concéntricos que sugieren una huella dentro de un círculo de radio r.
const Print = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => <g fill="none" stroke="#d9dde4" strokeOpacity={0.5} strokeWidth={1.4} strokeLinecap="round">
  {Array.from({ length: Math.floor(r / 6) }, (_, i) => { const rr = 4 + i * 6, s = 0.5 + (i % 3) * 0.6; return <path key={i} d={`M${round(cx + rr * Math.cos(s))} ${round(cy + rr * Math.sin(s) * 1.1)} A${rr} ${round(rr * 1.1)} 0 1 1 ${round(cx + rr * Math.cos(s + 5.2))} ${round(cy + rr * Math.sin(s + 5.2) * 1.1)}`} />; })}
</g>;

function GlassesArt({ product, color }: { product: Extract<Product, { kind: 'glasses' }>; color: string }) {
  const { width, height, radius } = product.frame;
  const w = width * 110, h = height * 110, r = Math.min(radius * 110, w / 2, h / 2), t = 12, gap = 30;
  const cx = w / 2 + t + gap / 2, outer = cx + w / 2 + t;
  return <>
    {[-1, 1].map(s => <g key={s}>
      <rect x={s * cx - w / 2} y={-h / 2} width={w} height={h} rx={r} fill="none" stroke={product.color} strokeOpacity={0.25} strokeWidth={t + 6} />
      <rect x={s * cx - w / 2} y={-h / 2} width={w} height={h} rx={r} fill={product.light} fillOpacity={0.14} stroke={color} strokeWidth={t} />
    </g>)}
    <path d={`M${-gap / 2 - 5} ${-h * 0.2} Q0 ${-h * 0.38} ${gap / 2 + 5} ${-h * 0.2}`} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" />
    <path d={`M${-outer} ${-h * 0.22} l-14 -6 M${outer} ${-h * 0.22} l14 -6`} stroke={color} strokeWidth={6} strokeLinecap="round" />
    <circle cx={outer - 2} cy={-h * 0.22} r={4.5} className="product-art-chip" />
  </>;
}

// Aro de frente (diamante con halo) y, al lado, la traba vista desde atrás con el sensor.
function EarringArt({ product, color }: { product: Product; color: string }) {
  return <>
    <circle cx={-62} cy={0} r={52} fill="none" stroke={product.color} strokeOpacity={0.22} strokeWidth={12} />
    <circle cx={-62} cy={0} r={46} fill="none" stroke={color} strokeWidth={8} />
    {dots(18, 46, -62).map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={3.4} fill="#f4f6ff" />)}
    <circle cx={-62} cy={0} r={30} fill={color} />
    <circle cx={-62} cy={0} r={24} fill="#eef2fb" />
    <path d="M-62 -24 L-48 0 L-62 24 L-76 0 Z M-86 0 H-38" fill="none" stroke="#b9c2d6" strokeWidth={1.4} />
    <circle cx={70} cy={0} r={48} fill={color} />
    <circle cx={70} cy={0} r={40} fill="#26232b" />
    <Print cx={70} cy={0} r={38} />
    <circle cx={70} cy={0} r={40} fill="none" className="product-art-ring" strokeWidth={2} />
  </>;
}

// Colgante con cadena, argolla, halo de piedras y la huella bajo el cristal.
function PendantArt({ product, color }: { product: Product; color: string }) {
  return <>
    <path d="M0 -60 C-30 -80 -70 -95 -140 -100 M0 -60 C30 -80 70 -95 140 -100" fill="none" stroke={color} strokeWidth={3} strokeDasharray="5 3" />
    <rect x={-6} y={-72} width={12} height={22} rx={6} fill={color} />
    <circle cx={0} cy={10} r={64} fill="none" stroke={product.color} strokeOpacity={0.22} strokeWidth={12} />
    <circle cx={0} cy={10} r={58} fill="none" stroke={color} strokeWidth={7} />
    {dots(30, 58, 0, 10).map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={2.6} fill="#f4f6ff" />)}
    <circle cx={0} cy={10} r={48} fill={color} />
    <circle cx={0} cy={10} r={42} fill="#1f1c23" />
    <Print cx={0} cy={10} r={40} />
    <ellipse cx={-14} cy={-6} rx={16} ry={9} fill="#ffffff" fillOpacity={0.08} />
  </>;
}

export function ProductArt({ product, frameColor, caption, className = '' }: { product: Product; frameColor?: string; caption?: string; className?: string }) {
  const color = frameColor ?? product.variants[0].color;
  return <div className={`product-art ${className}`} style={{ '--accent': product.color, '--accent-light': product.light } as CSSProperties}>
    <svg viewBox="-200 -100 400 200" role="img" aria-label={`Representación conceptual de ${product.name}`}>
      {product.kind === 'glasses' ? <GlassesArt product={product} color={color} /> : product.kind === 'earring' ? <EarringArt product={product} color={color} /> : <PendantArt product={product} color={color} />}
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
