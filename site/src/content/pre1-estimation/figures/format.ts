const SUPERSCRIPT: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }

/**
 * 尤度のような小さい数を、有効数字 digits 桁で表示する。
 * 9.766e-4 のような計算機の書き方は読者になじみがないので、小数か「× 10⁻⁷」の形にする。
 */
export function formatSmall(x: number, digits = 3): string {
  if (x === 0 || !Number.isFinite(x)) return String(x)
  const exp = Math.floor(Math.log10(Math.abs(x)))
  if (exp >= -5) return x.toFixed(Math.max(0, digits - 1 - exp))
  const mantissa = (x / 10 ** exp).toFixed(digits - 1)
  return `${mantissa} × 10${String(exp).replace(/./g, (c) => SUPERSCRIPT[c])}`
}
