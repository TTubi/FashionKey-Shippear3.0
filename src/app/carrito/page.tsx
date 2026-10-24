import type { Metadata } from 'next';
import { DemoBanner } from '@/components/SiteNav';
import { CartPage } from '@/components/shop/CartPage';
export const metadata: Metadata = { title: 'Carrito demo' };
export default function Page() { return <main className="page"><DemoBanner /><CartPage /></main>; }
