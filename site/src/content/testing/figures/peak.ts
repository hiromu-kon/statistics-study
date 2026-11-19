/** 曲線の最大値（y 軸の上限を決めるため） */
export function peakOf(f: (x: number) => number, from: number, to: number): number {
  let m = 0
  for (let i = 0; i <= 400; i++) {
    const v = f(from + ((to - from) * i) / 400)
    if (Number.isFinite(v) && v > m) m = v
  }
  return m
}
