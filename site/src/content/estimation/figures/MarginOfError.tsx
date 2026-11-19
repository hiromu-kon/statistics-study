import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Curve, Plot, Points } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import { Marker } from '../../sampling/figures/parts'

/**
 * 世論調査の「誤差」（95% 信頼区間の幅の半分）1.96√(p(1−p)/n) が、支持率 p と人数 n でどう変わるかの図。
 * p = 0.5 のときにいちばん大きくなる。
 */
export function MarginOfError() {
  const [n, setN] = useState(1000)
  const moe = (p: number) => 1.96 * Math.sqrt((p * (1 - p)) / n)
  return (
    <div>
      <Plot
        x={[0, 1]}
        y={[0, 0.1]}
        height={250}
        xLabel="支持率 p̂"
        yLabel="誤差（±）"
        xTicks={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
        yTicks={[0, 0.02, 0.04, 0.06, 0.08, 0.1]}
        yTickFormat={(v) => `${Math.round(v * 100)}pt`}
      >
        <Curve f={moe} color="c1" samples={300} />
        <Marker x={0.5} color="c5" label={`p̂ = 0.5 で最大 ±${round(moe(0.5) * 100, 1)}pt`} />
        <Points data={[{ x: 0.5, y: moe(0.5) }]} color="c5" r={6} opacity={1} />
      </Plot>
      <p className="figure-readout">
        n = {n} 人のとき、支持率 10% なら ±{round(moe(0.1) * 100, 1)} ポイント、50% なら ±<strong>{round(moe(0.5) * 100, 1)}</strong> ポイント
      </p>
      <Controls>
        <Slider label="調べる人数 n" value={n} min={100} max={3000} step={100} onChange={setN} format={(v) => `${v}人`} />
      </Controls>
    </div>
  )
}
