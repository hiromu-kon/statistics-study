import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Area, Bars, Curve, Legend, Plot, VLine } from '../../../components/charts/Plot'
import { binomialCdf, binomialPmf, normalCdf, normalPdf, round } from '../../../lib/stats'
import { Toggle } from './parts'

/**
 * 二項分布の正確な検定（右片側、α = 5%）。
 * 棄却域 {X ≧ c} の c を「P(X ≧ c) ≦ 0.05 となる最小の c」で決めると、本当の有意水準（サイズ）は 0.05 より小さくなる。
 */
export function ExactBinomialDemo() {
  const [n, setN] = useState(15)
  const [p0, setP0] = useState(0.2)
  const upper = (c: number) => (c <= 0 ? 1 : 1 - binomialCdf(c - 1, n, p0))
  let c = 0
  while (upper(c) > 0.05) c++
  const size = upper(c)
  const data = Array.from({ length: n + 1 }, (_, k) => ({ x: k, y: binomialPmf(k, n, p0) }))
  const yMax = Math.max(...data.map((d) => d.y)) * 1.2
  return (
    <div>
      <Plot x={[-0.5, n + 0.5]} y={[0, yMax]} xLabel="成功の回数 X" yLabel="H0 のもとでの確率">
        <Bars data={data} width={0.8} color="c1" highlight={(k) => k >= c} highlightColor="c5" />
        <VLine x={c - 0.5} color="c5" label={`c = ${c}`} />
      </Plot>
      <p className="figure-readout">
        P(X ≧ {c}) = <strong>{round(size, 4)}</strong> ≦ 0.05 だが、1つ手前の P(X ≧ {c - 1}) = {round(upper(c - 1), 4)} は 0.05 を超える。
        <br />
        ちょうど 5% の棄却域は作れず、本当の有意水準は {round(size, 4)} になる
      </p>
      <Toggle
        label="H0 の p0"
        options={[
          { value: 0.2, label: '0.2' },
          { value: 0.5, label: '0.5' },
        ]}
        value={p0}
        onChange={setP0}
      />
      <Controls>
        <Slider label="試行回数 n" value={n} min={5} max={40} step={1} onChange={setN} />
      </Controls>
    </div>
  )
}

const CN = 20
const MU = CN * 0.5
const SD = Math.sqrt(CN * 0.25)

/**
 * 連続修正（0.5 の補正）の意味。棒 k は「k − 0.5 から k + 0.5 までの幅」を持つので、
 * 正規曲線で P(X ≧ k) を近似するときは k − 0.5 から右の面積を使うと正確に近づく。
 */
export function ContinuityDemo() {
  const [k, setK] = useState(14)
  const exact = 1 - binomialCdf(k - 1, CN, 0.5)
  const raw = 1 - normalCdf(k, MU, SD)
  const corrected = 1 - normalCdf(k - 0.5, MU, SD)
  const data = Array.from({ length: CN + 1 }, (_, x) => ({ x, y: binomialPmf(x, CN, 0.5) }))
  const f = (x: number) => normalPdf(x, MU, SD)
  return (
    <div>
      <Plot x={[2.5, 17.5]} y={[0, 0.2]} xTicks={[3, 5, 7, 9, 11, 13, 15, 17]} xLabel="公平なコインを20回投げたときの表の回数" yLabel="確率">
        <Bars data={data} width={1} color="c1" opacity={0.45} highlight={(x) => x >= k} highlightColor="c5" />
        <Area f={f} from={k - 0.5} to={Infinity} color="c3" opacity={0.35} />
        <Curve f={f} color="ink" />
        <VLine x={k} color="muted" label={`${k}`} />
        <VLine x={k - 0.5} color="c3" label={`${k - 0.5}`} />
      </Plot>
      <Legend
        items={[
          { color: 'c5', label: `正確な P(X ≧ ${k}) = ${round(exact, 4)}` },
          { color: 'muted', label: `補正なしの正規近似 = ${round(raw, 4)}` },
          { color: 'c3', label: `0.5 補正した正規近似 = ${round(corrected, 4)}` },
        ]}
      />
      <p className="figure-readout">赤い棒の幅の左端は {k - 0.5}。そこから右の曲線の下の面積（緑）が、赤い棒の面積の合計に近い</p>
      <Controls>
        <Slider label="k" value={k} min={11} max={17} step={1} onChange={setK} />
      </Controls>
    </div>
  )
}
