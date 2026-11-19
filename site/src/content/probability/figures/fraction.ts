export function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b)
}

/** 18, 36 → "18/36 = 1/2"。約分できないときは "5/36" だけ */
export function fractionText(n: number, d: number): string {
  if (n === 0) return `0/${d} = 0`
  const g = gcd(n, d)
  if (g === 1) return `${n}/${d}`
  if (g === d) return `${n}/${d} = ${n / d}`
  return `${n}/${d} = ${n / g}/${d / g}`
}

/** 0.0833 → "8.3%" */
export function percent(p: number, digits = 1): string {
  return `${(p * 100).toFixed(digits)}%`
}
