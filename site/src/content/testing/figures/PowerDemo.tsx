import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Area, Curve, Legend, Plot } from '../../../components/charts/Plot'
import { normalCdf, normalPdf, normalQuantile, round } from '../../../lib/stats'
import { ColorText, Mark, Toggle } from './parts'

/**
 * H0 の分布と H1 の分布（どちらも標本平均 x̄ の分布）を重ね、α・β・検出力を塗り分ける。
 * 右片側検定（H0: μ = 0, H1: μ = d）で、σ = 1 として x̄ の標準誤差は 1/√n。
 */
export function PowerDemo() {
  const [d, setD] = useState(0.5)
  const [n, setN] = useState(16)
  const [alpha, setAlpha] = useState(0.05)
  const se = 1 / Math.sqrt(n)
  const crit = normalQuantile(1 - alpha) * se
  const beta = normalCdf(crit, d, se)
  const f0 = (x: number) => normalPdf(x, 0, se)
  const f1 = (x: number) => normalPdf(x, d, se)
  const peak = normalPdf(0, 0, se)
  const yMax = peak * 1.2
  return (
    <div>
      <Plot x={[-1.6, 2.4]} y={[0, yMax]} hideY xTicks={[-1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2]} xLabel="標本平均 x̄（μ0 = 0、σ = 1 とした目盛り）">
        <Area f={f1} from={-Infinity} to={crit} color="c4" opacity={0.35} />
        <Area f={f1} from={crit} to={Infinity} color="c3" opacity={0.35} />
        <Area f={f0} from={crit} to={Infinity} color="c5" opacity={0.6} />
        <Curve f={f0} color="ink" />
        <Curve f={f1} color="c1" dashed />
        <Mark x={crit} color="c5" />
        <ColorText x={0} y={peak} dy={-6} color="ink">
          H0 の分布
        </ColorText>
        <ColorText x={d} y={peak} dy={-22} color="c1">
          H1 の分布
        </ColorText>
        <ColorText x={crit} y={yMax * 0.55} color="c5" anchor="start" dy={0}>
          {` 境目 ${round(crit, 3)}`}
        </ColorText>
      </Plot>
      <Legend
        items={[
          { color: 'c5', label: `α（第1種の過誤）= ${alpha}` },
          { color: 'c4', label: `β（第2種の過誤）≒ ${round(beta, 3)}` },
          { color: 'c3', label: `検出力 1 − β ≒ ${round(1 - beta, 3)}` },
        ]}
      />
      <p className="figure-readout">
        境目より右に x̄ が来たら「H0 を棄却」。本当は H1 が正しいときに棄却できる確率が<strong>検出力</strong>です。
      </p>
      <Toggle
        label="有意水準"
        options={[
          { value: 0.1, label: '10%' },
          { value: 0.05, label: '5%' },
          { value: 0.01, label: '1%' },
        ]}
        value={alpha}
        onChange={setAlpha}
      />
      <Controls>
        <Slider label="効果の大きさ（μ1 − μ0）÷ σ" value={d} min={0} max={1.2} step={0.05} onChange={setD} format={(v) => v.toFixed(2)} />
        <Slider label="標本の大きさ n" value={n} min={4} max={64} step={1} onChange={setN} format={(v) => `${v}`} />
      </Controls>
    </div>
  )
}
