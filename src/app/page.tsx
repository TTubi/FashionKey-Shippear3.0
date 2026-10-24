import { ProductShowcase } from '@/components/home/ProductShowcase';
import { Catalog } from '@/components/home/Catalog';
import { Differentials, FinalCta, HowItWorks, Problem, Solution, UseCases } from '@/components/home/Sections';

// Landing de FashionKey: hero con el prototipo 3D, problema, solución, cómo funciona, productos, diferenciales, casos de uso y cierre.
export default function Page() {
  return <main>
    <ProductShowcase />
    <Problem />
    <Solution />
    <HowItWorks />
    <Catalog />
    <Differentials />
    <UseCases />
    <FinalCta />
  </main>;
}
