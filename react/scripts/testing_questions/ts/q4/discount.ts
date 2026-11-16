// discount.ts — types are perfect, the logic is wrong
export function applyDiscount(price: number, pct: number): number {
  return price * pct   // should be price * (1 - pct)
}
