import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Bars, Curve, Legend, Plot } from '../../../components/charts/Plot'
import { binomialPmf, normalPdf, round } from '../../../lib/stats'
import { Marker } from './parts'

/**
 * 標本比率 p̂ = X/n の分布。横軸を「回数」ではなく「割合」にすると、
 * n を大きくするほど p のまわりに細く集まる様子が見える。
 */
export function ProportionSpread() {
  const [n, setN] = useState(20)
  const [p, setP] = useState(0.3)
  const sd = Math.sqrt((p * (1 - p)) / n)
  // 確率を棒の幅 1/n で割って、面積が確率になる高さ（密度）にそろえる
  const bars = Array.from({ length: n + 1 }, (_, k) => ({ x: k / n, y: binomialPmf(k, n, p) * n }))
  const yMax = Math.max(normalPdf(p, p, sd), ...bars.map((b) => b.y)) * 1.15
  return (
    <div>
      <Plot x={[0, 1]} y={[0, yMax]} height={240} hideY xLabel="標本比率 p̂" xTicks={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}>
        <Bars data={bars} width={(1 / n) * 0.85} color="c1" opacity={0.6} />
        <Curve f={(x) => normalPdf(x, p, sd)} color="c2" samples={400} />
        <Marker x={p} color="c5" label="p" />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: `n = ${n} のときの p̂ の分布` },
          { color: 'c2', label: '正規分布 N(p, p(1−p)/n)' },
        ]}
      />
      <p className="figure-readout">
        E(p̂) = p = <strong>{p.toFixed(2)}</strong>　標準偏差 √(p(1−p)/n) = <strong>{round(sd, 4)}</strong>
      </p>
      <Controls>
        <Slider label="調べる人数 n" value={n} min={10} max={400} step={10} onChange={setN} />
        <Slider label="本当の割合 p" value={p} min={0.1} max={0.9} step={0.05} onChange={(v) => setP(round(v, 2))} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}
