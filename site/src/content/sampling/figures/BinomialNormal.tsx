import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Bars, Curve, Legend, Plot } from '../../../components/charts/Plot'
import { binomialPmf, normalPdf, round } from '../../../lib/stats'

/** 二項分布 B(n, p) の棒グラフに、同じ平均・分散の正規分布を重ねる図 */
export function BinomialNormal() {
  const [n, setN] = useState(10)
  const [p, setP] = useState(0.2)
  const mu = n * p
  const sd = Math.sqrt(n * p * (1 - p))
  const bars = Array.from({ length: n + 1 }, (_, k) => ({ x: k, y: binomialPmf(k, n, p) }))
  const lo = Math.max(-0.5, Math.floor(mu - 4.5 * sd))
  const hi = Math.min(n + 0.5, Math.ceil(mu + 4.5 * sd))
  const yMax = Math.max(...bars.map((b) => b.y), normalPdf(mu, mu, sd)) * 1.15
  const ok = mu >= 5 && n * (1 - p) >= 5
  return (
    <div>
      <Plot x={[lo, hi]} y={[0, yMax]} height={260} xLabel="成功の回数 k" yLabel="確率">
        <Bars data={bars} width={0.85} color="c1" opacity={0.6} />
        <Curve f={(x) => normalPdf(x, mu, sd)} color="c2" samples={300} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: `二項分布 B(${n}, ${p})` },
          { color: 'c2', label: `正規分布 N(${round(mu, 2)}, ${round(sd * sd, 2)})` },
        ]}
      />
      <p className="figure-readout">
        np = <strong>{round(mu, 2)}</strong>、n(1−p) = <strong>{round(n * (1 - p), 2)}</strong>　→{' '}
        {ok ? 'どちらも5以上：正規分布でよく近似できる' : 'どちらかが5未満：形がゆがみ、近似は粗い'}
      </p>
      <Controls>
        <Slider label="試行回数 n" value={n} min={5} max={100} step={1} onChange={setN} />
        <Slider label="成功確率 p" value={p} min={0.05} max={0.95} step={0.05} onChange={(v) => setP(round(v, 2))} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}
