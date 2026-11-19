import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Area, Curve, Label, Legend, Plot, Points, Segment } from '../../../components/charts/Plot'
import { normalCdf, normalPdf, normalQuantile, round } from '../../../lib/stats'
import { Toggle } from './parts'

type Region = 'right' | 'two' | 'center' | 'left'

const zR = normalQuantile(0.95)
const zT = normalQuantile(0.975)
// 中央の幅は「H0 のもとで確率 0.05」になるように決める
const zC = normalQuantile(0.525)

const REGIONS: Record<Region, { label: string; parts: [number, number][] }> = {
  right: { label: '右端 X > 1.645', parts: [[zR, Infinity]] },
  two: { label: '両端 |X| > 1.96', parts: [[-Infinity, -zT], [zT, Infinity]] },
  center: { label: '真ん中 |X| < 0.063', parts: [[-zC, zC]] },
  left: { label: '左端 X < −1.645', parts: [[-Infinity, -zR]] },
}

const THETA1 = 2

// normalCdf は ±Infinity を受け取ると NaN を返すので、端は 0 と 1 にする
const cdf = (x: number, mu: number) => (x === Infinity ? 1 : x === -Infinity ? 0 : normalCdf(x, mu, 1))

/**
 * どれも α = 0.05 の棄却域なのに、検出力はまったく違う。
 * X ~ N(θ, 1)、H0: θ = 0、H1: θ = 2。尤度比 f1/f0 が大きいところ（右端）を選ぶのが最強力になる。
 */
export function NpRegionDemo() {
  const [region, setRegion] = useState<Region>('right')
  const f0 = (x: number) => normalPdf(x, 0, 1)
  const f1 = (x: number) => normalPdf(x, THETA1, 1)
  const prob = (mu: number) =>
    REGIONS[region].parts.reduce((s, [a, b]) => s + cdf(b, mu) - cdf(a, mu), 0)
  return (
    <div>
      <Plot x={[-3.5, 5]} y={[0, 0.48]} hideY xTicks={[-3, -2, -1, 0, 1, 2, 3, 4, 5]} xLabel="観測値 X">
        {REGIONS[region].parts.map(([a, b], i) => (
          <g key={i}>
            <Area f={f1} from={a} to={b} color="c3" opacity={0.4} />
            <Area f={f0} from={a} to={b} color="c5" opacity={0.6} />
          </g>
        ))}
        <Curve f={f0} color="ink" />
        <Curve f={f1} color="c1" dashed />
        <Label x={0} y={0.4} dy={-6}>
          H0: θ = 0
        </Label>
        <Label x={THETA1} y={0.4} dy={-6} color="c1">
          H1: θ = 2
        </Label>
      </Plot>
      <Legend
        items={[
          { color: 'c5', label: `α（H0 の山の塗った面積）= ${round(prob(0), 3)}` },
          { color: 'c3', label: `検出力（H1 の山の塗った面積）= ${round(prob(THETA1), 3)}` },
        ]}
      />
      <Toggle
        label="棄却域"
        options={(Object.keys(REGIONS) as Region[]).map((k) => ({ value: k, label: REGIONS[k].label }))}
        value={region}
        onChange={setRegion}
      />
    </div>
  )
}

const N = 100
const P0 = 0.5

/**
 * 二項分布（n = 100）の対数尤度 ℓ(p) の上で、3つの検定が「どこを測っているか」を描く。
 * 尤度比：山の高さの差（縦）、ワルド：山頂と p0 の距離（横）、スコア：p0 での接線の傾き。
 */
export function LikelihoodTriad() {
  const [x, setX] = useState(60)
  const ph = x / N
  const ll = (p: number) => x * Math.log(p) + (N - x) * Math.log(1 - p)
  const top = ll(ph)
  const rel = (p: number) => ll(p) - top
  const l0 = rel(P0)
  const slope = (x - N * P0) / (P0 * (1 - P0))
  const lr = -2 * l0
  const wald = (ph - P0) ** 2 / ((ph * (1 - ph)) / N)
  const score = (x - N * P0) ** 2 / (N * P0 * (1 - P0))
  const half = 0.06
  return (
    <div>
      <Plot x={[0.3, 0.85]} y={[-10, 1.5]} yTicks={[-10, -8, -6, -4, -2, 0]} xTicks={[0.3, 0.4, 0.5, 0.6, 0.7, 0.8]} xLabel="成功の確率 p" yLabel="ℓ(p) − ℓ(p̂)">
        <Curve f={rel} color="ink" />
        <Segment x1={P0 - half} y1={l0 - slope * half} x2={P0 + half} y2={l0 + slope * half} color="c3" width={2.5} />
        <Segment x1={P0} y1={l0} x2={P0} y2={0} color="c5" width={3} />
        <Segment x1={P0} y1={0.6} x2={ph} y2={0.6} color="c2" width={3} />
        <Points
          data={[
            { x: ph, y: 0, color: 'c1' },
            { x: P0, y: l0, color: 'c5' },
          ]}
          r={5}
          opacity={1}
        />
        <Label x={ph} y={0} dy={-10} color="c1" anchor="start">
          {' 山頂 p̂'}
        </Label>
        <Label x={P0} y={l0} dy={18} color="c5" anchor="middle">
          p0 = 0.5
        </Label>
      </Plot>
      <Legend
        items={[
          { color: 'c5', label: `尤度比：高さの差 × 2 = ${round(lr, 3)}` },
          { color: 'c2', label: `ワルド：横の距離² × 山頂の曲がり = ${round(wald, 3)}` },
          { color: 'c3', label: `スコア：p0 での傾き² ÷ 情報量 = ${round(score, 3)}` },
        ]}
      />
      <p className="figure-readout">
        3つとも H0 のもとで近似的に自由度1の χ² 分布。5% の境目は 3.84 → {lr > 3.84 ? '尤度比は棄却' : '尤度比は棄却できない'}、
        {wald > 3.84 ? 'ワルドは棄却' : 'ワルドは棄却できない'}、{score > 3.84 ? 'スコアは棄却' : 'スコアは棄却できない'}
      </p>
      <Controls>
        <Slider label="100回中の成功回数 x" value={x} min={45} max={70} step={1} onChange={setX} format={(v) => `${v}回`} />
      </Controls>
    </div>
  )
}
