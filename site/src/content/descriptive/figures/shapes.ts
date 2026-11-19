import { normalPdf } from '../../../lib/stats'

// 分布の形の見本。乱数ではなく密度の式から棒の高さを決めるので、いつも同じ形になる。

export type Shape = 'symmetric' | 'right' | 'left' | 'uniform' | 'bimodal'

export const SHAPE_LABEL: Record<Shape, string> = {
  symmetric: '左右対称・単峰（ベル型）',
  right: '右に裾が長い',
  left: '左に裾が長い',
  uniform: '一様（平ら）',
  bimodal: '二峰（山が2つ）',
}

const rightSkew = (x: number) => (x <= 0 ? 0 : x ** 1.5 * Math.exp(-x / 1.2))

/** 横軸 0〜10 の上の密度（高さの比だけが意味をもつ） */
export function shapeDensity(shape: Shape): (x: number) => number {
  switch (shape) {
    case 'symmetric':
      return (x) => normalPdf(x, 5, 1.4)
    case 'right':
      return rightSkew
    case 'left':
      return (x) => rightSkew(10 - x)
    case 'uniform':
      return (x) => (x >= 1 && x <= 9 ? 0.125 : 0)
    case 'bimodal':
      return (x) => 0.5 * normalPdf(x, 3, 0.9) + 0.5 * normalPdf(x, 7, 0.9)
  }
}

/** 細かい格子の上で数値的に平均・中央値・最頻値を求める */
export function shapeCenters(shape: Shape): { mean: number; median: number; mode: number } {
  const f = shapeDensity(shape)
  const step = 0.005
  const xs: number[] = []
  for (let x = step / 2; x < 10; x += step) xs.push(x)
  const ws = xs.map(f)
  const total = ws.reduce((a, b) => a + b, 0)
  const mean = xs.reduce((a, x, i) => a + x * ws[i], 0) / total
  let acc = 0
  let median = xs[0]
  for (let i = 0; i < xs.length; i++) {
    acc += ws[i]
    if (acc >= total / 2) {
      median = xs[i]
      break
    }
  }
  let mode = xs[0]
  ws.forEach((w, i) => {
    if (w > f(mode)) mode = xs[i]
  })
  return { mean, median, mode }
}
