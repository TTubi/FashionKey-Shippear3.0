import type { Metadata } from 'next';
import { CartProvider } from '@/lib/cart';
import { SiteFooter, SiteNav } from '@/components/SiteNav';
import { CartDrawer } from '@/components/shop/CartDrawer';
import './globals.css';
import '@/components/shop/shop.css';
export const metadata: Metadata = {
  title: { default: 'FashionKey — Moda segura', template: '%s · FashionKey' },
  description: 'Plataforma conceptual de lentes inteligentes con NFC para autenticar operaciones digitales. Productos y compras de demostración.'
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body><CartProvider><SiteNav />{children}<SiteFooter /><CartDrawer /></CartProvider></body></html>;
}
