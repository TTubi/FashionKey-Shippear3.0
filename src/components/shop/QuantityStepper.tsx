import { MAX_QTY } from '@/lib/cart';

export function QuantityStepper({ value, onChange, label, small = false }: { value: number; onChange: (n: number) => void; label: string; small?: boolean }) {
  return <div className={`stepper ${small ? 'stepper-sm' : ''}`} role="group" aria-label={`Cantidad de ${label}`}>
    <button type="button" aria-label="Restar uno" disabled={value <= 1} onClick={() => onChange(value - 1)}>−</button>
    <output aria-live="polite">{value}</output>
    <button type="button" aria-label="Sumar uno" disabled={value >= MAX_QTY} onClick={() => onChange(value + 1)}>+</button>
  </div>;
}
