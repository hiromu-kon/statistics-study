import { useMemo, useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Legend, Plot, Points, Segment } from '../../../components/charts/Plot'
import { correlation, round } from '../../../lib/stats'
import { correlatedData, uncorrelatedPair } from './data'

/** 相関係数 r をスライダーで変えると、散布図の形がどう変わるかを見る図（60人ぶん、乱数は固定） */
export function CorrelationSlider() {
  const [r, setR] = useState(0.5)
  const { xs, ys } = useMemo(() => correlatedData(60, 7, r), [r])
  return (
    <div>
      <Plot x={[15, 85]} y={[15, 85]} height={340} xLabel="x" yLabel="y">
        <Points data={xs.map((x, i) => ({ x, y: ys[i] }))} r={5} />
      </Plot>
      <p className="figure-readout">
        この散布図の相関係数 r = <strong>{round(correlation(xs, ys), 2)}</strong>
      </p>
      <Controls>
        <Slider label="相関係数 r" value={r} min={-1} max={1} step={0.1} onChange={setR} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}

/**
 * 「y を x で予測する直線」と「x を y で予測する直線」を重ねる図。
 * r = ±1 のときだけ2本が重なり、|r| が小さいほど開く。
 */
export function TwoRegressionLines() {
  const [r, setR] = useState(0.6)
  const base = useMemo(() => uncorrelatedPair(60, 7), [])
  const k = Math.sqrt(Math.max(0, 1 - r * r))
  const xs = base.z1.map((v) => 50 + 10 * v)
  const ys = base.z1.map((v, i) => 50 + 10 * (r * v + k * base.z2[i]))
  return (
    <div>
      <Plot x={[15, 85]} y={[15, 85]} height={340} xLabel="x" yLabel="y">
        <Points data={xs.map((x, i) => ({ x, y: ys[i] }))} r={4} color="muted" opacity={0.6} />
        <Segment x1={10} y1={50 + r * (10 - 50)} x2={90} y2={50 + r * (90 - 50)} color="c1" width={3} />
        <Segment x1={50 + r * (10 - 50)} y1={10} x2={50 + r * (90 - 50)} y2={90} color="c2" width={3} dashed />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: 'y を x に回帰（y の予測用）' },
          { color: 'c2', label: 'x を y に回帰（x の予測用）' },
        ]}
      />
      <Controls>
        <Slider label="相関係数 r" value={r} min={0.1} max={1} step={0.1} onChange={setR} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}
