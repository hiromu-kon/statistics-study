import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Area, Curve, Plot } from '../../../components/charts/Plot'
import { exponentialPdf, normalCdf, normalPdf, round } from '../../../lib/stats'
import { Choice, Marker } from './parts'

type Dist = 'normal' | 'exp'

/** |X − μ| ≥ kσ となる確率（実際の値） */
function tailProb(dist: Dist, k: number): number {
  if (dist === 'normal') return 2 * (1 - normalCdf(k))
  // 平均1・標準偏差1の指数分布。左側は 0 より小さくならないので k < 1 のときだけ
  const right = Math.exp(-(1 + k))
  const left = k < 1 ? 1 - Math.exp(-(1 - k)) : 0
  return left + right
}

/**
 * チェビシェフの不等式 P(|X − μ| ≥ kσ) ≤ 1/k² を、実際の確率と比べる図。
 * どんな分布でも上限を超えないが、上限はかなり大きめ（ゆるい）であることがわかる。
 */
export function ChebyshevPlot() {
  const [dist, setDist] = useState<Dist>('exp')
  const [k, setK] = useState(2)
  const mu = dist === 'normal' ? 0 : 1
  const f = dist === 'normal' ? (x: number) => normalPdf(x) : (x: number) => exponentialPdf(x, 1)
  const domain: [number, number] = dist === 'normal' ? [-4.5, 4.5] : [-0.5, 6.5]
  const yMax = dist === 'normal' ? 0.45 : 1.1
  const p = tailProb(dist, k)
  return (
    <div>
      <Controls>
        <Choice<Dist>
          options={[
            { value: 'exp', label: '指数分布（μ=1, σ=1）' },
            { value: 'normal', label: '標準正規分布（μ=0, σ=1）' },
          ]}
          value={dist}
          onChange={setDist}
        />
      </Controls>
      <Plot x={domain} y={[0, yMax]} height={240} hideY>
        <Area f={f} from={domain[0]} to={mu - k} color="c5" opacity={0.4} />
        <Area f={f} from={mu + k} to={domain[1]} color="c5" opacity={0.4} />
        <Curve f={f} samples={300} />
        <Marker x={mu} color="muted" label="μ" />
        <Marker x={mu - k} color="c5" label="μ−kσ" anchor="end" labelY={yMax * 0.8} />
        <Marker x={mu + k} color="c5" label="μ+kσ" labelY={yMax * 0.8} />
      </Plot>
      <p className="figure-readout">
        塗った部分（μ から kσ 以上はなれる確率）＝ <strong>{round(p, 4)}</strong>　≦　チェビシェフの上限 1/k² ＝{' '}
        <strong>{round(1 / (k * k), 4)}</strong>
      </p>
      <Controls>
        <Slider label="k（σ の何倍か）" value={k} min={1} max={4} step={0.1} onChange={setK} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}
