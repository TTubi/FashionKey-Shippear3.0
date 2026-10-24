import type { Metadata } from 'next';
import { DemoBanner } from '@/components/SiteNav';
import { Checkout } from '@/components/checkout/Checkout';
export const metadata: Metadata = { title: 'Checkout demo' };
export default function Page() { return <main className="page"><DemoBanner /><Checkout /></main>; }
