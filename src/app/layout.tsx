import type { Metadata, Viewport } from 'next';
import { CartProvider } from '@/lib/cart';
import { SiteFooter, SiteNav } from '@/components/SiteNav';
import { CartDrawer } from '@/components/shop/CartDrawer';
import { site } from '@/config/site';
import './globals.css';
import '@/components/shop/shop.css';

const title = `${site.brand.name} — ${site.brand.slogan}`;
export const metadata: Metadata = {
  title: { default: title, template: `%s · ${site.brand.name}` },
  description: site.brand.description,
  applicationName: site.brand.name,
  keywords: ['FashionKey', 'autenticación digital', 'anteojos inteligentes', 'seguridad', 'identidad digital', 'Hackatón Shippear'],
  openGraph: { type: 'website', locale: 'es_AR', siteName: site.brand.name, title, description: site.brand.description },
  twitter: { card: 'summary', title, description: site.brand.description }
};
export const viewport: Viewport = { themeColor: '#07080b', colorScheme: 'dark' };

// Estructura común de FashionKey: encabezado, contenido, pie y carrito de demostración.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body><CartProvider><SiteNav />{children}<SiteFooter /><CartDrawer /></CartProvider></body></html>;
}
