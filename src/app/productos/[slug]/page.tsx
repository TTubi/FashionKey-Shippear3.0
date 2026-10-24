import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProduct, products } from '@/config/products';
import { ProductDetail } from '@/components/product/ProductDetail';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return products.map(p => ({ slug: p.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).slug);
  return product ? { title: product.name, description: product.description } : {};
}
export default async function Page({ params }: Props) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  return <main className="page"><ProductDetail product={product} /></main>;
}
