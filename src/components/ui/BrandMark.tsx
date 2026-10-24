import { site } from '@/config/site';

// Signo marcario de FashionKey (manual de marca): emblema con la "F" dentro de un cartucho y el logotipo en EB Garamond.
export const EMBLEM_PATH = 'M50 4C66 4 76 14 78 26C90 30 96 40 96 52C92 58 92 72 96 78C96 90 90 100 78 104C76 116 66 126 50 126C34 126 24 116 22 104C10 100 4 90 4 78C8 72 8 58 4 52C4 40 10 30 22 26C24 14 34 4 50 4Z';

export function Emblem({ size = 30, className = '' }: { size?: number; className?: string }) {
  return <svg className={`emblem ${className}`} width={size * 0.77} height={size} viewBox="0 0 100 130" aria-hidden="true">
    <path d={EMBLEM_PATH} fill="currentColor" />
    <text x="50" y="88" textAnchor="middle" fontSize="66" fontFamily="var(--font-serif)" fill="var(--bg)">F</text>
  </svg>;
}

export function BrandMark({ slogan = false }: { slogan?: boolean }) {
  return <span className="brand-mark">
    <Emblem />
    <span className="brand-word">{site.brand.wordmark}</span>
    {slogan && <small>{site.brand.slogan}</small>}
  </span>;
}
