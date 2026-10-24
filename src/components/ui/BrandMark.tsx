import { site } from '@/config/site';

// Logo final de FashionKey (Ejemplos/final.png): emblema con la "F" integrado al logotipo.
// public/brand/fashionkey-logo.png es la versión blanca con fondo transparente (850 × 240).
const LOGO = { src: '/brand/fashionkey-logo.png', width: 850, height: 240 };

export function BrandMark({ slogan = false }: { slogan?: boolean }) {
  return <span className="brand-mark">
    <img className="brand-logo" src={LOGO.src} width={LOGO.width} height={LOGO.height} alt={site.brand.wordmark} />
    {slogan && <small>{site.brand.slogan}</small>}
  </span>;
}
