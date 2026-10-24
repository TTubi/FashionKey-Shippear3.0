import type { Metadata, Viewport } from 'next';
import { EB_Garamond, Hanken_Grotesk } from 'next/font/google';
import { CartProvider } from '@/lib/cart';
import { SiteFooter, SiteNav } from '@/components/SiteNav';
import { CartDrawer } from '@/components/shop/CartDrawer';
import { site } from '@/config/site';
import './globals.css';
import '@/components/shop/shop.css';

// Tipografías del manual de marca. EB Garamond: títulos y marca. Textos: Amazing Grotesk en el manual; mientras no estén
// sus archivos se usa Hanken Grotesk (grotesca libre de proporciones similares). Para cambiarla: next/font/local con los .woff2.
// Next descarga las fuentes al compilar y las sirve desde el propio sitio.
const display = EB_Garamond({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--font-display', display: 'swap' });
const body = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-body', display: 'swap' });

const title = `${site.brand.name} — ${site.brand.slogan}`;
export const metadata: Metadata = {
  title: { default: title, template: `%s · ${site.brand.name}` },
  description: site.brand.description,
  applicationName: site.brand.name,
  keywords: ['FashionKey', 'autenticación digital', 'anteojos inteligentes', 'seguridad', 'identidad digital', 'Hackatón Shippear'],
  openGraph: { type: 'website', locale: 'es_AR', siteName: site.brand.name, title, description: site.brand.description },
  twitter: { card: 'summary', title, description: site.brand.description }
};
export const viewport: Viewport = { themeColor: '#2A1F2D', colorScheme: 'dark' };

// Estructura común de FashionKey: encabezado, contenido, pie y carrito de demostración.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es" className={`${display.variable} ${body.variable}`}><body><CartProvider><SiteNav />{children}<SiteFooter /><CartDrawer /></CartProvider></body></html>;
}
