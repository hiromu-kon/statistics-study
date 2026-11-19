import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Area, Curve, Legend, Plot } from '../../../components/charts/Plot'
import { normalPdf, round } from '../../../lib/stats'
import { Marker } from './parts'

/**
 * 母集団の分布（点線）と、標本平均の分布（実線）を重ねる図。
 * n を大きくすると、標本平均の分布が μ のまわりに細く集まっていく。
 */
export function SampleMeanWidth({
  mu = 160,
  sigma = 8,
  maxN = 36,
  initialN = 4,
  xLabel = '身長（cm）',
}: {
  mu?: number
  sigma?: number
  maxN?: number
  initialN?: number
  xLabel?: string
}) {
  const [n, setN] = useState(initialN)
  const se = sigma / Math.sqrt(n)
  const peak = normalPdf(mu, mu, sigma / Math.sqrt(maxN))
  const ticks = [-3, -2, -1, 0, 1, 2, 3].map((k) => mu + k * sigma)
  return (
    <div>
      <Plot x={[mu - 3.5 * sigma, mu + 3.5 * sigma]} y={[0, peak * 1.12]} hideY xTicks={ticks} xLabel={xLabel}>
        <Curve f={(x) => normalPdf(x, mu, sigma)} color="muted" dashed />
        <Area f={(x) => normalPdf(x, mu, se)} from={mu - se} to={mu + se} color="c1" opacity={0.25} />
        <Curve f={(x) => normalPdf(x, mu, se)} color="c1" samples={400} />
        <Marker x={mu} color="c5" label="μ" />
      </Plot>
      <Legend
        items={[
          { color: 'muted', label: '母集団（1人ぶんの値）の分布' },
          { color: 'c1', label: `標本平均（${n}人の平均）の分布` },
        ]}
      />
      <p className="figure-readout">
        標準誤差 σ/√n = {sigma}/√{n} ≒ <strong>{round(se, 2)}</strong>　（塗った部分が μ ± 標準誤差）
      </p>
      <Controls>
        <Slider label="標本の大きさ n" value={n} min={1} max={maxN} step={1} onChange={setN} />
      </Controls>
    </div>
  )
}
