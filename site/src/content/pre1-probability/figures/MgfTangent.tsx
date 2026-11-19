import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Curve, Legend, Plot, Points, VLine } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import { Choice } from './parts'

type Dist = 'poisson' | 'exp' | 'normal'

const RANGE: Record<Dist, { label: string; min: number; max: number; step: number; name: string }> = {
  poisson: { label: 'ポアソン分布', name: 'λ', min: 0.5, max: 3, step: 0.5 },
  exp: { label: '指数分布', name: '平均 θ', min: 0.2, max: 0.8, step: 0.1 },
  normal: { label: '正規分布 N(μ, 1)', name: 'μ', min: -1, max: 2, step: 0.5 },
}

/** 積率母関数 M(t) と、t = 0 での1階・2階微分（= E[X], E[X²]） */
function mgf(dist: Dist, a: number): { M: (t: number) => number; m1: number; m2: number } {
  if (dist === 'poisson') return { M: (t) => Math.exp(a * (Math.exp(t) - 1)), m1: a, m2: a + a * a }
  if (dist === 'exp') return { M: (t) => (t < 1 / a ? 1 / (1 - a * t) : NaN), m1: a, m2: 2 * a * a }
  return { M: (t) => Math.exp(a * t + t * t / 2), m1: a, m2: 1 + a * a }
}

/**
 * 積率母関数 M(t) = E[e^{tX}] のグラフと、t = 0 での接線。
 * どの分布でも M(0) = 1 を通り、t = 0 での傾きが平均 E[X] になる。
 */
export function MgfTangent() {
  const [dist, setDist] = useState<Dist>('poisson')
  const [vals, setVals] = useState<Record<Dist, number>>({ poisson: 1.5, exp: 0.5, normal: 1 })
  const a = vals[dist]
  const r = RANGE[dist]
  const { M, m1, m2 } = mgf(dist, a)
  const tMin = -1
  const tMax = 1
  return (
    <div>
      <Controls>
        <Choice<Dist>
          options={(Object.keys(RANGE) as Dist[]).map((d) => ({ value: d, label: RANGE[d].label }))}
          value={dist}
          onChange={setDist}
        />
      </Controls>
      <Plot x={[tMin, tMax]} y={[0, 4]} height={260} xLabel="t" yLabel="M(t)" yTicks={[0, 1, 2, 3, 4]}>
        <VLine x={0} color="muted" />
        <Curve f={(t) => 1 + m1 * t} color="c2" dashed />
        <Curve f={M} color="c1" samples={300} />
        <Points data={[{ x: 0, y: 1 }]} color="ink" r={5} opacity={1} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: '積率母関数 M(t)' },
          { color: 'c2', label: `t = 0 での接線（傾き = E[X] = ${round(m1, 2)}）` },
        ]}
      />
      <p className="figure-readout">
        M(0) = <strong>1</strong>、M′(0) = E[X] = <strong>{round(m1, 3)}</strong>、M″(0) = E[X²] = <strong>{round(m2, 3)}</strong>　→　分散 = E[X²] − E[X]² ={' '}
        <strong>{round(m2 - m1 * m1, 3)}</strong>
      </p>
      <Controls>
        <Slider
          label={r.name}
          value={a}
          min={r.min}
          max={r.max}
          step={r.step}
          onChange={(v) => setVals({ ...vals, [dist]: round(v, 2) })}
          format={(v) => v.toFixed(1)}
        />
      </Controls>
      {dist === 'exp' && <p className="small muted">指数分布の M(t) は t &lt; 1/θ でしか値をもたない（その先は積分が発散する）。</p>}
    </div>
  )
}
