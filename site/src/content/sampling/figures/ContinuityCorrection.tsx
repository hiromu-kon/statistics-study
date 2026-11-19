import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Area, Bars, Curve, Legend, Plot } from '../../../components/charts/Plot'
import { binomialPmf, normalCdf, normalPdf, round } from '../../../lib/stats'
import { Marker } from './parts'

const N = 20
const P = 0.5

/**
 * 連続修正の図。棒は幅1なので「k 以下」の棒は k + 0.5 まで広がっている。
 * 正規分布の面積も k + 0.5 まで塗ると、二項分布の確率に近くなる。
 */
export function ContinuityCorrection() {
  const [k, setK] = useState(7)
  const mu = N * P
  const sd = Math.sqrt(N * P * (1 - P))
  const bars = Array.from({ length: N + 1 }, (_, i) => ({ x: i, y: binomialPmf(i, N, P) }))
  let exact = 0
  for (let i = 0; i <= k; i++) exact += binomialPmf(i, N, P)
  const without = normalCdf(k, mu, sd)
  const withCc = normalCdf(k + 0.5, mu, sd)
  return (
    <div>
      <Plot x={[2.5, 17.5]} y={[0, 0.2]} height={260} xLabel="表の回数" xTicks={[3, 5, 7, 9, 11, 13, 15, 17]} hideY>
        <Bars data={bars} width={1} color="muted" opacity={0.35} highlight={(x) => x <= k} highlightColor="c1" />
        <Area f={(x) => normalPdf(x, mu, sd)} from={0} to={k + 0.5} color="c2" opacity={0.3} />
        <Curve f={(x) => normalPdf(x, mu, sd)} color="c2" />
        <Marker x={k} color="muted" label={`${k}`} labelY={0.185} anchor="end" />
        <Marker x={k + 0.5} color="c2" label={`${k}+0.5`} labelY={0.17} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: `二項分布 B(${N}, ${P}) の「${k}回以下」の棒` },
          { color: 'c2', label: `正規分布 N(${mu}, ${N * P * (1 - P)}) で ${k}+0.5 まで塗った面積` },
        ]}
      />
      <p className="figure-readout">
        正確な確率 P(X ≦ {k}) = <strong>{round(exact, 4)}</strong>　｜　連続修正なし（{k} まで）≒ {round(without, 4)}　｜
        連続修正あり（{k}+0.5 まで）≒ <strong>{round(withCc, 4)}</strong>
      </p>
      <Controls>
        <Slider label="k（何回以下か）" value={k} min={4} max={15} step={1} onChange={setK} />
      </Controls>
    </div>
  )
}
