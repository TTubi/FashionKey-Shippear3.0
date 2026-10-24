export function formatPrice(amount: number | null, currency: string) {
  if (amount === null) return 'A definir';
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}
