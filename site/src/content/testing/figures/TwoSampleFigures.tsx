import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Area, Curve, Legend, Plot } from '../../../components/charts/Plot'
import { fPdf, fQuantile, normalPdf, round, tQuantile } from '../../../lib/stats'
import { ColorText, TestDistPlot, Verdict } from './parts'
import { peakOf } from './peak'

/**
 * 2つのグループの分布を重ねて、「平均の差」と「ばらつき」のどちらが t を決めるかを見せる。
 * 各グループ 10 人・等分散とし、t = 差 ÷ √(s² (1/10 + 1/10))。
 */
export function TwoGroupsDemo() {
  const [diff, setDiff] = useState(3)
  const [s, setS] = useState(3)
  const n = 10
  const df = 2 * n - 2
  const t = diff / Math.sqrt(s * s * (2 / n))
  const tc = tQuantile(0.975, df)
  const m1 = 50
  const m2 = 50 + diff
  const peak = normalPdf(0, 0, s)
  return (
    <div>
      <Plot x={[34, 72]} y={[0, peak * 1.25]} hideY xLabel="点数" xTicks={[35, 40, 45, 50, 55, 60, 65, 70]}>
        <Area f={(x) => normalPdf(x, m1, s)} from={-Infinity} to={Infinity} color="c1" opacity={0.2} />
        <Area f={(x) => normalPdf(x, m2, s)} from={-Infinity} to={Infinity} color="c2" opacity={0.2} />
        <Curve f={(x) => normalPdf(x, m1, s)} color="c1" />
        <Curve f={(x) => normalPdf(x, m2, s)} color="c2" />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: `グループ1（平均 ${m1}）` },
          { color: 'c2', label: `グループ2（平均 ${m2}）` },
        ]}
      />
      <p className="figure-readout">
        t = {diff} ÷ √({s}² × (1/10 + 1/10)) ≒ <strong>{round(t, 3)}</strong>　（自由度 {df} の両側 5% の境目 {round(tc, 3)}）→ <Verdict reject={Math.abs(t) > tc} />
      </p>
      <Controls>
        <Slider label="平均の差" value={diff} min={0} max={10} step={0.5} onChange={setDiff} format={(v) => v.toFixed(1)} />
        <Slider label="標準偏差 s（両方同じ）" value={s} min={1} max={8} step={0.5} onChange={setS} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}

/** F 検定：大きい方の分散を分子にして、上側 α/2 点と比べる */
export function FTestPlot({ F, d1, d2 }: { F: number; d1: number; d2: number }) {
  const upper = fQuantile(0.975, d1, d2)
  const xMax = Math.max(upper * 1.4, F + 1)
  const pdf = (x: number) => fPdf(x, d1, d2)
  return (
    <TestDistPlot
      pdf={pdf}
      x={[0, xMax]}
      yMax={peakOf(pdf, 0.02, xMax) * 1.25}
      reject={[[upper, Infinity]]}
      criticals={[{ x: upper, label: ` F0.025(${d1}, ${d2}) = ${round(upper, 2)}` }]}
      observed={F}
      observedLabel={` F = ${F}`}
      extra={
        <ColorText x={1} y={0} dy={-6} color="muted">
          1
        </ColorText>
      }
      xLabel={`F 分布（自由度 ${d1}, ${d2}）`}
    />
  )
}
