import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Bars, Plot } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'

/** 多項式（係数の配列。i 番目が s^i の係数）のかけ算 */
function multiply(a: number[], b: number[]): number[] {
  const out = Array.from({ length: a.length + b.length - 1 }, () => 0)
  a.forEach((x, i) => b.forEach((y, j) => (out[i + j] += x * y)))
  return out
}

// サイコロ1個の確率母関数 G(s) = (s + s² + … + s⁶)/6 の係数
const DIE = [0, 1, 1, 1, 1, 1, 1].map((c) => c / 6)

/**
 * サイコロ n 個の目の和の分布を、確率母関数の n 乗（多項式のかけ算）で求める図。
 * G(s)^n を展開したときの s^k の係数が、和が k になる確率。
 */
export function DiceSumPgf() {
  const [n, setN] = useState(2)
  let coef = [1]
  for (let i = 0; i < n; i++) coef = multiply(coef, DIE)
  const bars = coef.map((p, k) => ({ x: k, y: p })).filter((b) => b.y > 0)
  const yMax = Math.max(...bars.map((b) => b.y)) * 1.25
  const total = 6 ** n
  const best = Math.max(...bars.map((b) => b.y))
  const tops = bars.filter((b) => b.y > best - 1e-12).map((b) => b.x)
  return (
    <div>
      <Plot x={[n - 0.7, 6 * n + 0.7]} y={[0, yMax]} height={240} xLabel="目の和 k" yLabel="確率">
        <Bars data={bars} width={0.75} color="c1" labels={n <= 2 ? (y) => `${round(y * total, 0)}/${total}` : undefined} />
      </Plot>
      <p className="figure-readout">
        G(s)<sup>{n}</sup> を展開した s<sup>k</sup> の係数 = 和が k になる確率。いちばん大きいのは k = {tops.join('、')}（確率 {round(best, 4)}）
      </p>
      <Controls>
        <Slider label="サイコロの数 n" value={n} min={1} max={5} step={1} onChange={setN} />
      </Controls>
    </div>
  )
}
